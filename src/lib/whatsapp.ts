const API_URL = process.env.WHATSAPP_API_URL!;
const API_KEY = process.env.WHATSAPP_API_KEY!;

interface WhatsAppResponse {
  success: boolean;
  error?: string;
}

/**
 * Generic template sender used by server actions.
 * Falls back to console.log in development when API key is missing.
 */
export async function sendWhatsAppTemplate(opts: {
  phone: string;
  templateName: string;
  params: string[];
}): Promise<WhatsAppResponse> {
  if (!API_KEY || API_KEY === "your_aisensy_key") {
    console.log("[WhatsApp Mock]", opts.templateName, "→", opts.phone, opts.params);
    return { success: true };
  }
  return sendWhatsAppMessage(opts.templateName, opts.phone, opts.params);
}

async function sendWhatsAppMessage(
  campaignName: string,
  destination: string,
  templateParams: string[]
): Promise<WhatsAppResponse> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey: API_KEY,
        campaignName,
        destination,
        userName: "Vidyazo",
        templateParams,
        media: {},
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`WhatsApp API error: ${errorText}`);
      return { success: false, error: errorText };
    }

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`WhatsApp send failed: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

// Retry wrapper - retry once after 5 minutes on failure
async function sendWithRetry(
  campaignName: string,
  destination: string,
  templateParams: string[]
): Promise<WhatsAppResponse> {
  const result = await sendWhatsAppMessage(
    campaignName,
    destination,
    templateParams
  );
  if (!result.success) {
    console.log(`Retrying WhatsApp message to ${destination} in 5 minutes...`);
    await new Promise((resolve) => setTimeout(resolve, 5 * 60 * 1000));
    return sendWhatsAppMessage(campaignName, destination, templateParams);
  }
  return result;
}

export async function sendWeeklyReport(
  parentPhone: string,
  studentName: string,
  score: string,
  weakTopics: string,
  encouragement: string,
  reportLink: string
): Promise<WhatsAppResponse> {
  return sendWithRetry("weekly_report", parentPhone, [
    studentName,
    score,
    weakTopics,
    encouragement,
    reportLink,
  ]);
}

export async function sendTestReminder(
  studentPhone: string,
  studentName: string,
  dashboardLink: string
): Promise<WhatsAppResponse> {
  return sendWithRetry("test_reminder", studentPhone, [
    studentName,
    dashboardLink,
  ]);
}

export async function sendClassReminder(
  studentPhone: string,
  className: string,
  meetLink: string,
  time: string
): Promise<WhatsAppResponse> {
  return sendWithRetry("class_reminder", studentPhone, [
    className,
    time,
    meetLink,
  ]);
}

export async function sendPaymentReminder(
  parentPhone: string,
  studentName: string,
  month: string,
  amount: string,
  payLink: string
): Promise<WhatsAppResponse> {
  return sendWithRetry("payment_reminder", parentPhone, [
    studentName,
    month,
    amount,
    payLink,
  ]);
}

export async function sendParentLink(
  parentPhone: string,
  studentName: string,
  magicLink: string
): Promise<WhatsAppResponse> {
  return sendWithRetry("parent_link", parentPhone, [studentName, magicLink]);
}
