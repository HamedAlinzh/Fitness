import type { Dictionary } from "./fa";

/** English UI strings. Typed against the Persian dictionary so the two can't drift. */
export const en: Dictionary = {
  meta: {
    siteTitle: "Personal Trainer, Training Plans & Fitness Coaching",
    tagline:
      "Specialist strength and fitness coaching — in person in Shiraz and online worldwide.",
  },

  nav: {
    home: "Home",
    about: "About",
    gallery: "Gallery",
    plans: "Plans",
    testimonials: "Reviews",
    blog: "Blog",
    contact: "Contact",
    cta: "Start a consultation",
    menuLabel: "Open menu",
    menu: "Menu",
    switchTo: "فارسی",
    switchLabel: "زبان / Language",
  },

  footer: {
    quickLinks: "Quick links",
    plans: "Plans",
    testimonials: "Student reviews",
    contactMe: "Get in touch",
    instagram: "Instagram",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    whatsappGreeting:
      "Hi, I found you through your website and wanted to ask about your plans.",
    rights: "All rights reserved.",
  },

  suggest: {
    text: "View this site in English?",
    accept: "English",
    dismiss: "No thanks",
  },

  more: "Read more →",

  hero: {
    badge: "Strength & fitness coach",
    title: "Build the best version of yourself with a plan made just for you",
    description:
      "Professional coaching — in person in Shiraz and online anywhere in the world. A personal training plan, daily follow-up and direct support.",
    primary: "Start a free consultation",
    secondary: "See the training gallery",
  },

  stats: [
    { value: "3+", label: "Years of coaching" },
    { value: "120+", label: "Current and former students" },
    { value: "100%", label: "Personalised, tailor-made plans" },
    { value: "In person & online", label: "Including Iranians living abroad" },
  ],

  services: {
    eyebrow: "Services",
    title: "Everything you need to reach your goal",
    description:
      "From your training plan to nutrition and daily follow-up — all under one roof.",
    items: [
      {
        title: "Personal training plan",
        description:
          "A plan designed around your goal, your level and the equipment you have.",
      },
      {
        title: "Nutrition guidance",
        description:
          "A diet matched to your training, set up with a nutrition specialist for better results.",
      },
      {
        title: "Online coaching",
        description:
          "Form corrections, steady follow-up and support from wherever you are.",
      },
      {
        title: "In-person coaching in Shiraz",
        description:
          "Train at the gym with direct supervision and hands-on technique corrections.",
      },
    ],
  },

  galleryPreview: {
    eyebrow: "Daily gallery",
    title: "A look at every day's training",
    description:
      "Photos and videos from training sessions and the gym, updated every day.",
    all: "See the full gallery →",
  },

  pricingPreview: {
    eyebrow: "Plans & pricing",
    title: "Choose the plan that fits you",
    description:
      "Every plan is online and open to students both inside and outside Iran — if you don't live in Iran, just get in touch.",
    all: "See all plans →",
  },

  testimonialsPreview: {
    eyebrow: "Student reviews",
    title: "What my students say",
    all: "See all reviews →",
  },

  blogPreview: {
    eyebrow: "Blog",
    title: "Training and nutrition articles",
    all: "See all articles →",
  },

  instagram: {
    eyebrow: "Instagram",
    title: "Follow the latest posts!",
    follow: "Follow on Instagram",
    viewReel: "View reel on Instagram",
    viewPost: "View post on Instagram",
  },

  cta: {
    title: "Ready to start your new journey?",
    description:
      "Send a message so I can hear your goal and we can put together the best plan — in person in Shiraz or online from anywhere.",
    button: "Book a free consultation",
  },

  about: {
    metaTitle: "About me",
    metaDescription:
      "Get to know the coach, the coaching journey and my approach to training and fitness.",
    whyTitle: "Why train with me?",
    reasons: [
      {
        title: "Specialist training and nutrition knowledge",
        points: [
          "Completed specialist courses in strength training and sports nutrition",
          "Knowledge kept up to date with current scientific sources",
        ],
      },
      {
        title: "A fully personal plan",
        points: [
          "Every plan is built around the person's goal, fitness level and daily life",
          "No one-size-fits-all templates",
        ],
      },
      {
        title: "In person in Shiraz, online everywhere",
        points: [
          "In-person training for those who live in Shiraz",
          "Online support for students in other cities and countries",
        ],
      },
      {
        title: "Continuous follow-up and support",
        points: [
          "Your plan is reviewed and adjusted as you progress",
          "Responsive and available throughout your program",
        ],
      },
    ],
  },

  pricing: {
    metaTitle: "Plans & pricing",
    metaDescription:
      "Online coaching plans for students in Iran and abroad — semi-private, VIP and group classes.",
    eyebrow: "Plans",
    title: "Choose the plan that fits your goal",
    description:
      "All plans are online and open to students both inside and outside Iran.",
    empty: "No plans have been added yet.",
    recommended: "Recommended",
    currency: "Toman",
    whatsappForPlan: "WhatsApp about this plan",
    call: "Call",
    planMessage: (title: string) =>
      `Hi, I'd like to talk about "${title}".`,
    inPerson: {
      before: "For",
      bold: "in-person coaching in Shiraz",
      link: "send me a message",
      after: "and we'll arrange it together.",
      message: "Hi, I'd like to talk about in-person coaching in Shiraz.",
    },
    band: {
      title: "All it takes to start is a call",
      description:
        "No form to fill in. Call or message me, we'll choose the right plan together, and then I'll send you a payment link.",
      directCall: "Call directly",
      whatsapp: "Message on WhatsApp",
      formPrompt: "Would you rather get advice first?",
      formLink: "There's a free consultation form",
      formSuffix: "too.",
      message: "Hi, I'd like to talk about your coaching plans.",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Read this before choosing a plan",
      items: [
        {
          question: "What's the difference between online and in-person plans?",
          answer:
            "Online plans include a training program, follow-up and remote support. In-person coaching is only for students in Shiraz and includes supervised sessions at the gym.",
        },
        {
          question: "Can I change plans during the month?",
          answer:
            "Yes — whenever you like, we can adjust your plan to fit your situation and goal.",
        },
        {
          question: "How do I pay?",
          answer:
            "Online payment through a secure gateway will be available on the site soon. For now we arrange payment through the contact form or a message.",
        },
      ],
    },
  },

  contact: {
    metaTitle: "Contact me",
    metaDescription:
      "Request a free consultation and get started, in person or online.",
    eyebrow: "Contact",
    title: "Ready to start your new journey?",
    description:
      "Fill in the form below so I can understand your goal and we can build the best plan together.",
    phone: "Phone",
    directMessage: "Direct message",
    viaForm: "Through this form",
    location: "Gym location",
    city: "Shiraz, Iran",
  },

  consultation: {
    steps: {
      goal: "What's your training goal?",
      level: "What's your current level?",
      mode: "Which type of coaching do you want?",
      daysPerWeek: "How many days a week can you train?",
    },
    choices: {
      goal: {
        FAT_LOSS: "Fat loss and weight reduction",
        MUSCLE_GAIN: "Building muscle",
        GENERAL_FITNESS: "General fitness and health",
        COMPETITION: "Training for a specific sport",
      },
      level: {
        BEGINNER: "Beginner",
        INTERMEDIATE: "Intermediate",
        ADVANCED: "Advanced",
      },
      mode: {
        online: "Online",
        "in-person": "In person in Shiraz",
        "not-sure": "I'm not sure yet",
      },
      daysPerWeek: {
        "2": "2 days",
        "3": "3 days",
        "4": "4 days",
        "5": "5 days or more",
      },
      channel: {
        whatsapp: "WhatsApp",
        telegram: "Telegram",
        call: "Phone call",
      },
    },
    stepCounter: (current: string, total: string) =>
      `Step ${current} of ${total}`,
    injuryQuestion: "Do you have a medical condition or an injury?",
    injuryNo: "No, nothing",
    injuryYes: "Yes, I do",
    injuryNote: "Briefly describe it (optional)",
    injuryPrivacy:
      "Only the coach sees this. It is never shown on the website.",
    contactQuestion: "How can I reach you?",
    name: "Full name",
    phone: "Phone number",
    phonePlaceholder: "+44 7700 900123",
    channelQuestion: "How would you like me to reply?",
    telegram: "Telegram username (optional)",
    telegramHint: "Fill this in if people can't find you on Telegram by phone number.",
    message: "Anything else I should know? (optional)",
    back: "Back",
    next: "Next",
    submit: "Send consultation request",
    sending: "Sending…",
    pickOne: "Please choose one option.",
    successTitle: "Your request has been received!",
    success:
      "Your consultation request has been received. I'll get back to you soon through the channel you chose.",
    duplicate:
      "Your request has already been received and is waiting to be reviewed. I'll be in touch soon.",
    errors: {
      answerAll: "Please answer every question.",
      name: "Please enter a name between 2 and 50 characters.",
      phone:
        "That phone number doesn't look valid. Include the country code, e.g. +44 7700 900123.",
      telegram: "That Telegram username isn't valid. Example: my_username",
    },
  },

  blog: {
    metaTitle: "Blog",
    metaDescription:
      "Educational articles on training, nutrition and healthy living.",
    eyebrow: "Blog",
    title: "Training and nutrition articles",
    description:
      "Practical tips for training better, eating right and avoiding injury.",
    empty: "No articles have been published yet.",
    readTime: (minutes: string) => `${minutes} min read`,
  },

  gallery: {
    metaTitle: "Gallery",
    metaDescription: "Daily photos and videos from training and the gym.",
    eyebrow: "Gallery",
    title: "Training moments, day by day",
    description:
      "Photos and videos of students training and life at the gym, updated every day.",
    filterAll: "All",
    filterImages: "Photos",
    filterVideos: "Videos",
    empty: "Nothing to show yet.",
    close: "Close",
    previous: "Previous",
    next: "Next",
    openFullscreen: (caption: string) => `View full screen: ${caption}`,
  },

  testimonials: {
    metaTitle: "Student reviews",
    metaDescription:
      "Stories from students who reached their goals with a personal plan.",
    eyebrow: "Student reviews",
    title: "What my students say",
    description:
      "Read the real results of steady support and follow-up in the students' own words.",
    empty: "No reviews yet.",
    formEyebrow: "Leave a review",
    formTitle: "Share your experience with others",
  },
};
