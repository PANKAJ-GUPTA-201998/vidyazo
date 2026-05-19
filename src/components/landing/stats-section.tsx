"use client";

import { useEffect, useState, useRef } from "react";
import { Users, BookOpen, Target, TrendingUp } from "lucide-react";

function AnimatedCounter({ endValue, suffix = "", prefix = "", duration = 2000 }: { endValue: number, suffix?: string, prefix?: string, duration?: number }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTime: number | null = null;
          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // easeOutExpo
            const easeProgress = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
            
            countRef.current = Math.floor(easeProgress * endValue);
            setCount(countRef.current);

            if (percentage < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(endValue);
            }
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [endValue, duration]);

  // Format large numbers with commas
  const formattedCount = count >= 1000 ? count.toLocaleString() : count.toString();

  return (
    <span ref={elementRef}>
      {prefix}{formattedCount}{suffix}
    </span>
  );
}

export function StatsSection() {
  const stats = [
    { label: "Active Students", value: 600, suffix: "+", icon: Users, color: "text-blue-500", bg: "bg-blue-100" },
    { label: "Average Score Increase", value: 15, prefix: "+", suffix: "%", icon: TrendingUp, color: "text-green-500", bg: "bg-green-100" },
    { label: "Live Classes Conducted", value: 50000, suffix: "+", icon: BookOpen, color: "text-orange-500", bg: "bg-orange-100" },
    { label: "Tests Generated", value: 100000, suffix: "+", displayValue: "100k+", icon: Target, color: "text-purple-500", bg: "bg-purple-100" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e] mb-4">
            Trusted by Thousands of Indian Families
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Our results speak for themselves. We are proud to be the fastest-growing online tuition platform.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300 shadow-sm">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-6 ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`} />
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-[#1a1a2e] mb-1 sm:mb-2 flex items-center">
                {stat.displayValue ? (
                  // Custom rendering for 100k+ if needed, but since we animate to 100,000, let's just let the counter do its thing
                  // We can either count to 100 and append 'k+' or count to 100,000
                  stat.displayValue.includes('k') ? (
                    <AnimatedCounter endValue={100} prefix={stat.prefix} suffix="k+" />
                  ) : (
                    <AnimatedCounter endValue={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  )
                ) : (
                  <AnimatedCounter endValue={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                )}
              </h3>
              <p className="text-gray-600 font-medium text-xs sm:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
