export type Locale = "en" | "ar";
export type LocalizedText = Record<Locale, string>;

export type Look = {
  id: string;
  name: LocalizedText;
  garment: LocalizedText;
  note: LocalizedText;
  sharedAcross: "all" | string[] | null;
  variant: "polo" | "hoodie" | "jacket" | "utility";
};

export type Cohort = {
  id: string;
  name: LocalizedText;
  tagline: LocalizedText;
  lookIds: string[];
};

export type Project = {
  id: string;
  programId: string;
  organization: LocalizedText;
  program: LocalizedText;
  sector: LocalizedText;
  heroEyebrow: LocalizedText;
  storyTitle: LocalizedText;
  heroModelSrc?: string;
  cohortMediaSrc?: Record<string, string>;
  inspectionMedia?: Record<string, { frontSrc: string; backSrc?: string; mode: "flat" | "synthetic-exploded" }>;
  synthetic: boolean;
  identity?: {
    logoSrc: string;
    logoAlt: LocalizedText;
    locationSrc: string;
    locationAlt: LocalizedText;
  };
  summary: LocalizedText;
  skin: { accent: string; accentSoft: string; ink: string; motif: "diagonal" | "piping" };
  cohortsLabel: LocalizedText;
  cohorts: Cohort[];
  looks: Look[];
};

const kgcLooks: Look[] = [
  { id: "summer", name: { en: "Summer polo", ar: "بولو صيفي" }, garment: { en: "Short-sleeve polo", ar: "بولو بأكمام قصيرة" }, note: { en: "Stage-specific identity", ar: "هوية خاصة بالمرحلة" }, sharedAcross: null, variant: "polo" },
  { id: "winter", name: { en: "Winter polo", ar: "بولو شتوي" }, garment: { en: "Long-sleeve polo", ar: "بولو بأكمام طويلة" }, note: { en: "Stage-specific identity", ar: "هوية خاصة بالمرحلة" }, sharedAcross: null, variant: "polo" },
  { id: "hoodie", name: { en: "Hoodie", ar: "هودي" }, garment: { en: "Layered hoodie", ar: "هودي للطبقات" }, note: { en: "Shared or unique by cohort", ar: "مشترك أو مميز حسب المرحلة" }, sharedAcross: ["kindergarten", "primary"], variant: "hoodie" },
  { id: "puffer", name: { en: "Puffer", ar: "جاكيت مبطن" }, garment: { en: "Navy puffer jacket", ar: "جاكيت مبطن كحلي" }, note: { en: "Shared across every cohort", ar: "مشترك بين جميع المراحل" }, sharedAcross: "all", variant: "jacket" },
  { id: "sport", name: { en: "Training suit", ar: "طقم رياضي" }, garment: { en: "Jacket, shirt & sweatpants", ar: "جاكيت وقميص وبنطال رياضي" }, note: { en: "Shared design across every cohort", ar: "تصميم مشترك بين جميع المراحل" }, sharedAcross: "all", variant: "utility" },
];

export const projects: Project[] = [
  {
    id: "kgc-national",
    programId: "national",
    organization: { en: "KGC", ar: "KGC" },
    program: { en: "National program", ar: "البرنامج الوطني" },
    sector: { en: "Education · review fixture", ar: "التعليم · نموذج للمراجعة" },
    heroEyebrow: { en: "Schools today. A brighter tomorrow.", ar: "مدارس اليوم. غد أكثر إشراقاً." },
    storyTitle: { en: "Purpose in every layer.", ar: "غرض في كل طبقة." },
    heroModelSrc: "/review-media/kgc/high-summer.png",
    cohortMediaSrc: {
      kindergarten: "/review-media/kgc/kindergarten-summer.png",
      primary: "/review-media/kgc/primary-summer.png",
      middle: "/review-media/kgc/middle-summer.png",
      high: "/review-media/kgc/high-summer.png",
    },
    inspectionMedia: {
      "high:summer": {
        frontSrc: "/review-media/kgc/high-summer-polo-front.png",
        backSrc: "/review-media/kgc/high-summer-polo-back.png",
        mode: "flat",
      },
    },
    synthetic: false,
    identity: {
      logoSrc: "/media/kgc-logo.webp",
      logoAlt: { en: "Kawmeya Girls' College crest", ar: "شعار كلية قومية البنات" },
      locationSrc: "/media/kgc-building.webp",
      locationAlt: { en: "K.G.C. campus in Alexandria", ar: "مبنى K.G.C. في الإسكندرية" },
    },
    summary: {
      en: "One coordinated system across four stages, with shared outerwear and stage-specific identity.",
      ar: "منظومة متناسقة لأربع مراحل، بملابس خارجية مشتركة وهوية خاصة بكل مرحلة.",
    },
    skin: { accent: "#ee4b3d", accentSoft: "#dceffa", ink: "#102a43", motif: "diagonal" },
    cohortsLabel: { en: "Stages", ar: "المراحل" },
    cohorts: [
      { id: "kindergarten", name: { en: "Kindergarten", ar: "رياض الأطفال" }, tagline: { en: "A confident start.", ar: "بداية واثقة." }, lookIds: kgcLooks.map((look) => look.id) },
      { id: "primary", name: { en: "Primary", ar: "الابتدائي" }, tagline: { en: "Growing together.", ar: "ننمو معاً." }, lookIds: kgcLooks.map((look) => look.id) },
      { id: "middle", name: { en: "Middle", ar: "الإعدادي" }, tagline: { en: "More to become.", ar: "المزيد لنحققه." }, lookIds: kgcLooks.map((look) => look.id) },
      { id: "high", name: { en: "High", ar: "الثانوي" }, tagline: { en: "Ready for what's next.", ar: "مستعدون للخطوة القادمة." }, lookIds: kgcLooks.map((look) => look.id) },
    ],
    looks: kgcLooks,
  },
  {
    id: "harbor-house",
    programId: "guest-experience",
    organization: { en: "Harbor House", ar: "هاربور هاوس" },
    program: { en: "Guest experience program", ar: "برنامج تجربة الضيوف" },
    sector: { en: "Hospitality · synthetic", ar: "الضيافة · نموذج تخيلي" },
    heroEyebrow: { en: "One service language. Every guest moment.", ar: "لغة خدمة واحدة. في كل لحظة." },
    storyTitle: { en: "Intent in every detail.", ar: "قصد في كل تفصيل." },
    synthetic: true,
    summary: {
      en: "A clearly synthetic hospitality study with three roles, proving the system is not tied to schools.",
      ar: "دراسة ضيافة تخيلية بثلاثة أدوار تثبت أن النظام غير مرتبط بالمدارس.",
    },
    skin: { accent: "#1a7f72", accentSoft: "#dfe9df", ink: "#17332f", motif: "piping" },
    cohortsLabel: { en: "Roles", ar: "الأدوار" },
    cohorts: [
      { id: "front-of-house", name: { en: "Front of house", ar: "خدمة الضيوف" }, tagline: { en: "A composed welcome.", ar: "ترحيب راقٍ." }, lookIds: ["service", "evening", "outerwear"] },
      { id: "kitchen", name: { en: "Kitchen", ar: "المطبخ" }, tagline: { en: "Built for the pace.", ar: "مصمم لوتيرة العمل." }, lookIds: ["service", "utility"] },
      { id: "facilities", name: { en: "Facilities", ar: "المرافق" }, tagline: { en: "Ready across every space.", ar: "جاهز لكل مساحة." }, lookIds: ["utility", "outerwear"] },
    ],
    looks: [
      { id: "service", name: { en: "Service", ar: "الخدمة" }, garment: { en: "Piped service shirt", ar: "قميص خدمة بحواف" }, note: { en: "Role-specific cut", ar: "قصة خاصة بالدور" }, sharedAcross: null, variant: "polo" },
      { id: "evening", name: { en: "Evening", ar: "المساء" }, garment: { en: "Layered guest jacket", ar: "جاكيت ضيافة بطبقات" }, note: { en: "Front-of-house identity", ar: "هوية خدمة الضيوف" }, sharedAcross: null, variant: "jacket" },
      { id: "utility", name: { en: "Utility", ar: "العمل" }, garment: { en: "Utility overshirt", ar: "قميص عمل خارجي" }, note: { en: "Shared by operational roles", ar: "مشترك بين الأدوار التشغيلية" }, sharedAcross: ["kitchen", "facilities"], variant: "utility" },
      { id: "outerwear", name: { en: "Outerwear", ar: "الملابس الخارجية" }, garment: { en: "Weather layer", ar: "طبقة للطقس" }, note: { en: "Shared across guest-facing teams", ar: "مشتركة بين فرق خدمة الضيوف" }, sharedAcross: ["front-of-house", "facilities"], variant: "hoodie" },
    ],
  },
];
