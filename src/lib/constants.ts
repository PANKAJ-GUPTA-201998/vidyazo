// Vidyazo Constants

export const APP_NAME = "Vidyazo";
export const APP_TAGLINE = "A New Way to Learn";
export const APP_DESCRIPTION = "Personal tuition for Class 6-12 students";

// Colors
export const COLORS = {
  primary: "#1a1a2e",
  accent: "#e94560",
  accentLight: "#ff6b81",
  background: "#ffffff",
  surface: "#f8f9fa",
  textPrimary: "#1a1a2e",
  textSecondary: "#6c757d",
  success: "#28a745",
  warning: "#ffc107",
  error: "#dc3545",
} as const;

// Pricing (in paise)
export const PRICING = {
  batch: {
    name: "Batch Plan",
    price: 89900, // Rs 899
    priceDisplay: "₹899",
    features: [
      "3 classes/week",
      "MCQ weekly test",
      "Parent progress dashboard (Portal)",
      "Monthly PTM",
    ],
  },
  hybrid: {
    name: "Hybrid Plan",
    price: 149900, // Rs 1,499
    priceDisplay: "₹1,499",
    popular: true,
    features: [
      "5 classes/week",
      "Weekly test",
      "WhatsApp doubt support",
      "Parent portal details",
      "Monthly PTM",
      "1 personal session/month",
    ],
  },
  one_on_one: {
    name: "1-on-1 Plan",
    price: 299900, // Rs 2,999
    priceDisplay: "₹2,999",
    features: [
      "5 classes/week",
      "2x weekly test",
      "WhatsApp doubt support",
      "Parent portal details",
      "Monthly PTM",
      "Daily personal session",
    ],
  },
} as const;

// Annual Pricing (in paise)
export const ANNUAL_PRICING = {
  batch: {
    name: "Batch Plan (Annual)",
    price: 999900, // Rs 9,999
    priceDisplay: "₹9,999",
    monthlySaving: 789, // Rs saved vs monthly
    features: [
      "Everything in Batch Monthly",
      "Save ₹789/year",
      "2 months free!",
    ],
  },
  hybrid: {
    name: "Hybrid Plan (Annual)",
    price: 1649900, // Rs 16,499
    priceDisplay: "₹16,499",
    monthlySaving: 1489,
    popular: true,
    features: [
      "Everything in Hybrid Monthly",
      "Save ₹1,489/year",
      "Best Value!",
    ],
  },
  one_on_one: {
    name: "1-on-1 Plan (Annual)",
    price: 3299900, // Rs 32,999
    priceDisplay: "₹32,999",
    monthlySaving: 2989,
    features: [
      "Everything in 1-on-1 Monthly",
      "Save ₹2,989/year",
      "3 months free!",
    ],
  },
} as const;

// Boards
export const BOARDS = [
  { value: "CBSE", label: "CBSE" },
  { value: "ICSE", label: "ICSE" },
  { value: "UP", label: "UP Board" },
  { value: "MP", label: "MP Board" },
  { value: "BIHAR", label: "Bihar Board" },
  { value: "MAHARASHTRA", label: "Maharashtra Board" },
  { value: "OTHER", label: "Other" },
] as const;

// Classes
export const CLASS_GRADES = [6, 7, 8, 9, 10, 11, 12] as const;

// WhatsApp
export const WHATSAPP_NUMBER = "917060123858";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

// Social Links
export const SOCIAL_LINKS = {
  whatsapp: WHATSAPP_LINK,
  youtube: "https://www.youtube.com/@VIDYAZOOFFICIAL",
  instagram: "https://www.instagram.com/vidyazo",
} as const;

// Test constraints
export const TEST_MIN_QUESTIONS = 10;
export const TEST_MAX_QUESTIONS = 30;
export const BATCH_MAX_CAPACITY = 25;

// Performance thresholds
export const PERFORMANCE = {
  excellent: 80,
  good: 60,
  needsWork: 40,
} as const;
