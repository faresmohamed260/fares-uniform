import type { Locale } from "./locale";

export type Localized = Record<Locale, string>;

export const media = {
  kgc: {
    logo: "/review-media/kgc/kgc-logo.webp",
    campus: "/review-media/kgc/kgc-building.webp",
    kindergarten: "/review-media/kgc/kindergarten-summer.png",
    primary: "/review-media/kgc/primary-summer.png",
    middle: "/review-media/kgc/middle-summer.png",
    high: "/review-media/kgc/high-summer.png",
    poloFront: "/review-media/kgc/high-summer-polo-front.png",
    poloBack: "/review-media/kgc/high-summer-polo-back.png",
  },
} as const;

export const sectors: Localized[] = [
  { en: "Education", ar: "التعليم" },
  { en: "Restaurants & cafés", ar: "المطاعم والمقاهي" },
  { en: "Hospitality", ar: "الضيافة" },
  { en: "Healthcare", ar: "الرعاية الصحية" },
  { en: "Corporate teams", ar: "فرق الشركات" },
];

export const stages = [
  {
    id: "kindergarten",
    number: "01",
    name: { en: "Kindergarten", ar: "رياض الأطفال" } satisfies Localized,
    line: { en: "A confident beginning.", ar: "بداية واثقة." } satisfies Localized,
    image: media.kgc.kindergarten,
  },
  {
    id: "primary",
    number: "02",
    name: { en: "Primary", ar: "الابتدائي" } satisfies Localized,
    line: { en: "Growing in one visual language.", ar: "نمو داخل لغة بصرية واحدة." } satisfies Localized,
    image: media.kgc.primary,
  },
  {
    id: "middle",
    number: "03",
    name: { en: "Middle", ar: "الإعدادي" } satisfies Localized,
    line: { en: "Identity becomes more distinct.", ar: "هوية تصبح أكثر تميزاً." } satisfies Localized,
    image: media.kgc.middle,
  },
  {
    id: "high",
    number: "04",
    name: { en: "High", ar: "الثانوي" } satisfies Localized,
    line: { en: "Ready for what comes next.", ar: "جاهزون لما هو قادم." } satisfies Localized,
    image: media.kgc.high,
  },
] as const;

export const processSteps = [
  {
    number: "01",
    title: { en: "Understand", ar: "نفهم" } satisfies Localized,
    copy: {
      en: "Start with the organization, people, roles and daily use — not a blank shirt.",
      ar: "نبدأ بالمؤسسة والأشخاص والأدوار والاستخدام اليومي — وليس بقميص فارغ.",
    } satisfies Localized,
  },
  {
    number: "02",
    title: { en: "Design", ar: "نصمّم" } satisfies Localized,
    copy: {
      en: "Turn identity and function into one coordinated visual system.",
      ar: "نحوّل الهوية والوظيفة إلى منظومة بصرية متناسقة واحدة.",
    } satisfies Localized,
  },
  {
    number: "03",
    title: { en: "Sample", ar: "نراجع العينة" } satisfies Localized,
    copy: {
      en: "Review the real garment, fit and details before the program scales.",
      ar: "نراجع القطعة الحقيقية والمقاس والتفاصيل قبل التوسع في الإنتاج.",
    } satisfies Localized,
  },
  {
    number: "04",
    title: { en: "Manufacture", ar: "نُصنّع" } satisfies Localized,
    copy: {
      en: "Produce the approved system consistently across roles, sizes and quantities.",
      ar: "ننتج المنظومة المعتمدة بثبات عبر الأدوار والمقاسات والكميات.",
    } satisfies Localized,
  },
  {
    number: "05",
    title: { en: "Handover", ar: "نسلّم" } satisfies Localized,
    copy: {
      en: "Deliver a program that still reads as one team when every piece is in use.",
      ar: "نسلّم برنامجاً يظل متماسكاً كفريق واحد عندما تدخل كل قطعة في الاستخدام.",
    } satisfies Localized,
  },
] as const;

export const copy = {
  en: {
    navWork: "Work",
    navGarments: "Garments",
    navProcess: "Process",
    navEnquire: "Start a program",
    reviewLabel: "Protected design review · real current media",
    heroKicker: "Uniform programs · Alexandria",
    heroTitleA: "Designed as one.",
    heroTitleB: "Worn together.",
    heroBody: "Fares designs and manufactures coordinated uniform programs around the identity, people and real work of an organization.",
    heroPrimary: "Explore selected work",
    heroSecondary: "See how we work",
    proof: "Current review project",
    selectedWork: "Selected work",
    selectedWorkTitle: "One program. Four stages. A consistent identity.",
    selectedWorkBody: "KGC National is the current real-media review case: four stage-specific worn looks connected by one program system.",
    viewProject: "Enter the program",
    systemKicker: "The program, not the product card",
    systemTitle: "Identity becomes a system people can actually wear.",
    systemBody: "A strong uniform program holds together across roles, seasons, garments and years without flattening everyone into the same outfit.",
    garmentKicker: "Garment continuity",
    garmentTitle: "From worn context to the garment itself — without losing the story.",
    garmentBody: "The selected High-stage summer look moves into its real front/back packshots. Inspection stays photographic because no separated construction layers exist in the current source media.",
    inspect: "Inspect the garment",
    processKicker: "From brief to handover",
    processTitle: "A manufacturing relationship, not an add-to-cart flow.",
    sectorsKicker: "Built to flex",
    sectorsTitle: "The same system can adapt across organizations without pretending they share one identity.",
    closingTitle: "Start with your team, not a template.",
    closingBody: "Tell us what the organization needs to wear, where it needs to work, and what should stay unmistakably yours.",
    closingCta: "Discuss a uniform program",
    workTitle: "Uniform programs, seen in context.",
    workBody: "The archive grows only from real, reviewable work. We do not pad it with fictional clients.",
    garmentsTitle: "Garments without storefront logic.",
    garmentsBody: "Browse the real media currently available for review. No prices, stock indicators or fabricated product photography.",
    enquiryTitle: "Start the conversation with context intact.",
    enquiryBody: "This review form demonstrates the final hierarchy and states only. It does not submit data.",
    systemTitlePage: "Design system / review states",
  },
  ar: {
    navWork: "الأعمال",
    navGarments: "القطع",
    navProcess: "المنهج",
    navEnquire: "ابدأ برنامجاً",
    reviewLabel: "مراجعة تصميم محمية · وسائط حقيقية حالية",
    heroKicker: "برامج زي موحّد · الإسكندرية",
    heroTitleA: "مصمّم كمنظومة واحدة.",
    heroTitleB: "يُرتدى بروح واحدة.",
    heroBody: "تصمّم Fares وتصنّع برامج زي متكاملة حول هوية المؤسسة وأفرادها وطبيعة عملهم الفعلية.",
    heroPrimary: "استكشف أعمالاً مختارة",
    heroSecondary: "تعرّف على منهجنا",
    proof: "مشروع المراجعة الحالي",
    selectedWork: "أعمال مختارة",
    selectedWorkTitle: "برنامج واحد. أربع مراحل. هوية متناسقة.",
    selectedWorkBody: "KGC National هي حالة المراجعة الحالية بوسائط حقيقية: أربع إطلالات للمراحل داخل منظومة زي واحدة.",
    viewProject: "ادخل البرنامج",
    systemKicker: "البرنامج وليس بطاقة المنتج",
    systemTitle: "تتحول الهوية إلى منظومة يمكن للناس ارتداؤها فعلاً.",
    systemBody: "برنامج الزي القوي يبقى متماسكاً عبر الأدوار والمواسم والقطع والسنوات دون أن يجعل الجميع نسخة واحدة.",
    garmentKicker: "استمرارية القطعة",
    garmentTitle: "من سياق الارتداء إلى القطعة نفسها — من دون فقد القصة.",
    garmentBody: "تنتقل إطلالة المرحلة الثانوية الصيفية إلى صور القطعة الحقيقية من الأمام والخلف. تبقى المعاينة فوتوغرافية لأن المصدر الحالي لا يحتوي على طبقات تصنيع منفصلة.",
    inspect: "افحص القطعة",
    processKicker: "من المتطلبات إلى التسليم",
    processTitle: "علاقة تصنيع، وليست تجربة «أضف إلى السلة».",
    sectorsKicker: "منظومة مرنة",
    sectorsTitle: "يمكن للنظام نفسه أن يتكيف مع مؤسسات مختلفة دون الادعاء بأن لها هوية واحدة.",
    closingTitle: "ابدأ بفريقك، لا بقالب جاهز.",
    closingBody: "أخبرنا بما يحتاج فريقك إلى ارتدائه، وأين يعمل، وما الذي يجب أن يظل مميزاً لهويتك.",
    closingCta: "ناقش برنامج الزي",
    workTitle: "برامج الزي في سياقها الحقيقي.",
    workBody: "يتوسع الأرشيف فقط من أعمال حقيقية قابلة للمراجعة. لا نملؤه بعملاء خياليين.",
    garmentsTitle: "قطع من دون منطق المتجر.",
    garmentsBody: "استعرض الوسائط الحقيقية المتاحة حالياً للمراجعة. لا أسعار ولا مخزون ولا تصوير منتجات مختلق.",
    enquiryTitle: "ابدأ الحوار مع الحفاظ على السياق.",
    enquiryBody: "هذا النموذج يعرض التسلسل البصري والحالات فقط في بيئة المراجعة ولا يرسل بيانات.",
    systemTitlePage: "نظام التصميم / حالات المراجعة",
  },
} as const;
