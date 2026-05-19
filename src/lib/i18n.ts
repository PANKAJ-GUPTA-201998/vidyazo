// Vidyazo i18n — Simple translation system

export type Language = "en" | "hi";

export const translations = {
  // ============================================================
  // NAVBAR
  // ============================================================
  "nav.subjects": { en: "Subjects", hi: "विषय" },
  "nav.features": { en: "Features", hi: "सुविधाएं" },
  "nav.pricing": { en: "Pricing", hi: "मूल्य" },
  "nav.howItWorks": { en: "How it Works", hi: "कैसे काम करता है" },
  "nav.about": { en: "About", hi: "हमारे बारे में" },
  "nav.directAdmission": { en: "Direct Admission", hi: "डायरेक्ट एडमिशन" },
  "nav.login": { en: "Login to Dashboard", hi: "डैशबोर्ड लॉगिन" },
  "nav.startLearning": { en: "Start Learning Now", hi: "अभी पढ़ना शुरू करें" },

  // ============================================================
  // HERO
  // ============================================================
  "hero.badge": { en: "Smart Learning Platform", hi: "स्मार्ट लर्निंग प्लेटफॉर्म" },
  "hero.heading1": { en: "A New", hi: "पढ़ने का" },
  "hero.heading2": { en: "Way to Learn", hi: "नया तरीका" },
  "hero.subtitle": {
    en: "Personal tuition for Class 6-12 students & competitive exams. Live classes, weekly tests, and smart progress reports.",
    hi: "कक्षा 6-12 के छात्रों और प्रतियोगी परीक्षाओं के लिए पर्सनल ट्यूशन। लाइव क्लासेस, साप्ताहिक टेस्ट, और स्मार्ट प्रोग्रेस रिपोर्ट।",
  },
  "hero.ctaPrimary": { en: "Start Free Trial", hi: "फ्री ट्रायल शुरू करें" },
  "hero.ctaSecondary": { en: "Chat on WhatsApp", hi: "WhatsApp पर बात करें" },
  "hero.classRange": { en: "Class 6-12", hi: "कक्षा 6-12" },

  // ============================================================
  // STATS
  // ============================================================
  "stats.students": { en: "Happy Students", hi: "खुश छात्र" },
  "stats.tests": { en: "Tests Generated", hi: "टेस्ट बनाए" },
  "stats.classes": { en: "Classes Held", hi: "क्लासेस हुईं" },
  "stats.boards": { en: "Boards Covered", hi: "बोर्ड कवर" },

  // ============================================================
  // FEATURES
  // ============================================================
  "features.badge": { en: "Features", hi: "सुविधाएं" },
  "features.heading": { en: "Everything You Need to", hi: "आपको चाहिए सब" },
  "features.headingHighlight": { en: "Excel", hi: "कुछ यहां है" },
  "features.subtitle": {
    en: "A complete learning ecosystem designed for Indian students",
    hi: "भारतीय छात्रों के लिए बना एक संपूर्ण शिक्षा प्लेटफॉर्म",
  },

  // ============================================================
  // PRICING
  // ============================================================
  "pricing.badge": { en: "Pricing", hi: "मूल्य" },
  "pricing.heading": { en: "Choose Your", hi: "अपना चुनें" },
  "pricing.headingHighlight": { en: "Plan", hi: "प्लान" },
  "pricing.subtitle": {
    en: "Affordable plans designed for every student's needs",
    hi: "हर छात्र की ज़रूरत के अनुसार किफायती प्लान",
  },
  "pricing.monthly": { en: "Monthly", hi: "मासिक" },
  "pricing.annual": { en: "Annual", hi: "वार्षिक" },
  "pricing.saveUpto": { en: "Save up to 20%", hi: "20% तक बचाएं" },
  "pricing.trialFree": { en: "7-day free trial", hi: "7 दिन का फ्री ट्रायल" },
  "pricing.moneyBack": { en: "15-day money-back guarantee", hi: "15 दिन की मनी-बैक गारंटी" },
  "pricing.noHidden": { en: "No hidden fees", hi: "कोई छुपे शुल्क नहीं" },
  "pricing.mostPopular": { en: "MOST POPULAR", hi: "सबसे लोकप्रिय" },
  "pricing.bestValue": { en: "BEST VALUE", hi: "सर्वोत्तम मूल्य" },
  "pricing.batchPlan": { en: "Batch Plan", hi: "बैच प्लान" },
  "pricing.hybridPlan": { en: "Hybrid Plan", hi: "हाइब्रिड प्लान" },
  "pricing.oneOnOne": { en: "1-on-1 Plan", hi: "1-ऑन-1 प्लान" },

  // ============================================================
  // HOW IT WORKS
  // ============================================================
  "hiw.badge": { en: "How It Works", hi: "कैसे काम करता है" },
  "hiw.heading": { en: "Simple", hi: "सरल" },
  "hiw.headingHighlight": { en: "3 Steps", hi: "3 कदम" },
  "hiw.headingEnd": { en: "to Start", hi: "शुरू करने के लिए" },
  "hiw.subtitle": {
    en: "Getting started with Vidyazo is as easy as 1-2-3",
    hi: "Vidyazo के साथ शुरू करना उतना ही आसान है जितना 1-2-3",
  },

  // ============================================================
  // FAQ
  // ============================================================
  "faq.badge": { en: "FAQs", hi: "सवाल-जवाब" },
  "faq.heading": { en: "Got", hi: "" },
  "faq.headingHighlight": { en: "Questions?", hi: "सवाल हैं?" },

  "faq.q1": { en: "What subjects do you teach?", hi: "आप कौन से विषय पढ़ाते हैं?" },
  "faq.a1": {
    en: "We currently offer Mathematics, English, Sanskrit, and Science for Class 6-12 students across CBSE, ICSE, UP, MP, and Bihar boards.",
    hi: "हम फिलहाल कक्षा 6-12 के छात्रों के लिए गणित, अंग्रेजी, संस्कृत और विज्ञान पढ़ाते हैं — CBSE, ICSE, UP, MP और बिहार बोर्ड के लिए।",
  },

  "faq.q2": { en: "How are the classes conducted?", hi: "कक्षाएं कैसे होती हैं?" },
  "faq.a2": {
    en: "All classes are live via Google Meet. You get the link before class and can also watch recordings later.",
    hi: "सभी क्लासेस Google Meet पर लाइव होती हैं। क्लास से पहले लिंक मिलता है और बाद में रिकॉर्डिंग भी देख सकते हैं।",
  },

  "faq.q3": { en: "How do weekly tests work?", hi: "साप्ताहिक टेस्ट कैसे काम करते हैं?" },
  "faq.a3": {
    en: "Every Sunday, an MCQ test is released on your dashboard. You get instant results with topic-wise analysis.",
    hi: "हर रविवार, आपके डैशबोर्ड पर एक MCQ टेस्ट आता है। आपको तुरंत रिजल्ट मिलता है — टॉपिक-वाइज विश्लेषण के साथ।",
  },

  "faq.q4": { en: "Do parents get updates?", hi: "क्या माता-पिता को अपडेट मिलते हैं?" },
  "faq.a4": {
    en: "Yes! Parents receive weekly progress reports via WhatsApp with scores, attendance, and improvement areas.",
    hi: "हां! माता-पिता को WhatsApp पर हर हफ्ते प्रगति रिपोर्ट मिलती है — स्कोर, उपस्थिति और सुधार के क्षेत्रों के साथ।",
  },

  "faq.q5": { en: "Can I get a refund?", hi: "क्या मुझे रिफंड मिल सकता है?" },
  "faq.a5": {
    en: "We offer a 7-day free trial and a 15-day money-back guarantee. Full details on the pricing page.",
    hi: "हम 7 दिन का फ्री ट्रायल और 15 दिन की मनी-बैक गारंटी देते हैं। पूरी जानकारी प्राइसिंग पेज पर।",
  },

  // ============================================================
  // FOOTER
  // ============================================================
  "footer.tagline": {
    en: "A New Way to Learn — Personal tuition for Class 6-12 students.",
    hi: "पढ़ने का नया तरीका — कक्षा 6-12 के छात्रों के लिए पर्सनल ट्यूशन।",
  },
  "footer.quickLinks": { en: "Quick Links", hi: "त्वरित लिंक" },
  "footer.connect": { en: "Connect", hi: "जुड़ें" },
  "footer.rights": { en: "All rights reserved.", hi: "सभी अधिकार सुरक्षित।" },

  // ============================================================
  // CTA / COMMON
  // ============================================================
  "cta.whatsapp": { en: "Chat on WhatsApp", hi: "WhatsApp पर बात करें" },
  "cta.joinBatch": { en: "Join Batch", hi: "बैच ज्वाइन करें" },
  "cta.getHybrid": { en: "Get Hybrid", hi: "हाइब्रिड लें" },
  "cta.book1on1": { en: "Book 1-on-1", hi: "1-ऑन-1 बुक करें" },
  "cta.bookDemo": { en: "Book Free Demo", hi: "फ्री डेमो बुक करें" },

  // ============================================================
  // TEACHERS SECTION
  // ============================================================
  "teachers.badge": { en: "Our Teachers", hi: "हमारे शिक्षक" },
  "teachers.heading": { en: "Meet Your", hi: "मिलिए अपने" },
  "teachers.headingHighlight": { en: "Teachers", hi: "शिक्षकों से" },
  "teachers.subtitle": {
    en: "Qualified, experienced, and dedicated to your success",
    hi: "योग्य, अनुभवी, और आपकी सफलता के लिए समर्पित",
  },

  // ============================================================
  // RESULTS SECTION
  // ============================================================
  "results.badge": { en: "Student Results", hi: "छात्र परिणाम" },
  "results.heading": { en: "Real Results,", hi: "असली परिणाम," },
  "results.headingHighlight": { en: "Real Students", hi: "असली छात्र" },
  "results.subtitle": {
    en: "See how Vidyazo students transformed their scores",
    hi: "देखें कैसे Vidyazo छात्रों ने अपने अंक बदले",
  },
  "results.before": { en: "Before", hi: "पहले" },
  "results.after": { en: "After", hi: "बाद में" },
  "results.improvement": { en: "Improvement", hi: "सुधार" },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Language): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] || entry["en"];
}
