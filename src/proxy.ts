/**
 * src/middleware.ts
 *
 * Next.js Edge Middleware — authentication and access-control layer.
 *
 * Security reasoning:
 *  1. Middleware runs on EVERY request before any page renders, making it
 *     the correct place to enforce role and subscription checks.
 *  2. We use @supabase/ssr (not the legacy auth-helpers) so that session
 *     cookies are refreshed transparently on every request.
 *  3. The anon key is safe here because we read only the calling user's
 *     own profile row (enforced by RLS).
 *  4. The service role key is NEVER used in middleware.
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { UserRole, ProfileStatus } from "@/types/database";
import { getUserSubscriptionStatus } from "@/lib/access-control";

// ─── Route Classification ────────────────────────────────────────────────────

/**
 * Paths that are always public — no auth check, no redirects.
 * We match by prefix so /api/webhooks/razorpay is also allowed.
 */
const PUBLIC_PREFIXES = [
  "/",
  "/pricing",
  "/features",
  "/about",
  "/subjects",
  "/how-it-works",
  "/ai-reports",
  "/competitive-exams",
  "/direct-admission",
  "/api/webhooks",
  "/payment/verifying",
  "/_next",
  "/favicon",
  "/images",
  "/icons",
  "/manifest",
];

function isPublicPath(pathname: string): boolean {
  // Exact match for root
  if (pathname === "/") return true;
  return PUBLIC_PREFIXES.some(
    (prefix) => prefix !== "/" && pathname.startsWith(prefix)
  );
}

// ─── Role-based path restrictions ────────────────────────────────────────────

const ROLE_BLOCKED_PREFIXES: Record<UserRole, string[]> = {
  admin: ["/dashboard", "/parent"],
  parent: ["/dashboard", "/admin"],
  student: ["/admin", "/parent"],
};

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Always allow public routes without any processing
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // 2. Build a Supabase SSR client that can read/write cookies
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 3. Refresh session silently (updates cookie if token rotated)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. Unauthenticated → redirect to /login
  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Fetch the user's profile (role + status) — single query
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    // Profile missing — force sign out and back to login
    console.error("[middleware] Profile fetch failed:", profileError?.message);
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("reason", "profile_missing");
    return NextResponse.redirect(loginUrl);
  }

  const role = profile.role as UserRole;
  const status = profile.status as ProfileStatus;

  // 6. Block suspended / inactive accounts
  if (status === "blocked" || status === "inactive") {
    const suspendedUrl = request.nextUrl.clone();
    suspendedUrl.pathname = "/account-suspended";
    return NextResponse.redirect(suspendedUrl);
  }

  // 7. Role-based path restrictions
  const blockedPrefixes = ROLE_BLOCKED_PREFIXES[role] ?? [];
  const isRoleBlocked = blockedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isRoleBlocked) {
    // Redirect to the role's home instead of 403
    const homeByRole: Record<UserRole, string> = {
      admin: "/admin",
      parent: "/parent",
      student: "/dashboard",
    };
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = homeByRole[role];
    return NextResponse.redirect(homeUrl);
  }

  // 8. Subscription gate — only applies to students hitting /dashboard
  if (role === "student" && pathname.startsWith("/dashboard")) {
    const { hasAccess, reason } = await getUserSubscriptionStatus(
      supabase,
      user.id
    );

    if (!hasAccess) {
      const pricingUrl = request.nextUrl.clone();
      pricingUrl.pathname = "/pricing";
      pricingUrl.searchParams.set("reason", "subscription_required");
      pricingUrl.searchParams.set("detail", reason);
      return NextResponse.redirect(pricingUrl);
    }
  }

  // 9. All checks passed — continue to the requested page
  return response;
}

// ─── Matcher ─────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    /*
     * Match every route EXCEPT:
     *  - Next.js internals (_next/static, _next/image)
     *  - Browser-requested files (favicon, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
