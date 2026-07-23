import { z } from "astro/zod";

export const sharedButton = z
  .object({
    enable: z.boolean().optional(),
    tag: z.enum(["a", "button"]).optional(),
    url: z.string().optional(),
    label: z.string(),
    class: z.string().optional(),
    rel: z.string().optional(),
    target: z.string().optional(),
    icon: z
      .object({
        enable: z.boolean().optional(),
        name: z.string(),
        position: z.enum(["left", "right"]).optional(),
        className: z.string().optional(),
      })
      .optional(),
    hoverEffect: z
      .enum([
        "text-flip",
        "creative-fill",
        "magnetic",
        "magnetic-text-flip",
        "none",
      ])
      .optional(),
    variant: z.enum(["fill", "outline", "text", "white"]).optional(),
  })
  .catchall(z.any());

export const sharedButtonTag = sharedButton.refine(
  (data) => data.tag !== "a" || !!data.url,
  {
    message: "`url` is required when `tag` is 'a'",
    path: ["url"],
  },
);

export const sharedContactItem = z.object({
  title: z.string(),
  icon: z.string(),
  description: z.string(),
  button: sharedButton.optional(),
});

export const button = sharedButton || sharedButtonTag;

export const videoConfigSchema = z.object({
  src: z.string(),
  type: z.string().optional(),
  provider: z.enum(["youtube", "vimeo", "html5"]).optional(),
  poster: z.string().optional(),
  autoplay: z.boolean().optional(),
  id: z.string().optional(),
});

export const inputFieldSchema = z.object({
  label: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  halfWidth: z.boolean().optional(),
  defaultValue: z.string().optional(),
  name: z.string().optional(),
  selected: z.boolean().optional(),
  value: z.union([z.boolean(), z.string()]).optional(),
  checked: z.boolean().optional(),
  type: z.enum(["text", "email", "radio", "checkbox"]).optional(),
  id: z.string().optional(),
  tag: z.literal("textarea").optional(),
  rows: z.string().optional(),
  group: z.string().optional(),
  groupLabel: z.string().optional(),
  items: z
    .array(
      z.object({
        label: z.string(),
        name: z.string().optional(),
        id: z.string().optional(),
        value: z.string().optional(),
        required: z.boolean().optional(),
        groupLabel: z.string().optional(),
        group: z.string().optional(),
        type: z.enum(["radio", "checkbox"]).optional(),
        halfWidth: z.boolean().optional(),
        defaultValue: z.string().optional(),
        checked: z.boolean().optional(),
      }),
    )
    .optional(),
  dropdown: z
    .object({
      type: z.enum(["select", "search"]).optional(),
      search: z
        .object({
          placeholder: z.string().optional(),
        })
        .optional(),
      items: z.array(
        z.object({
          label: z.string(),
          selected: z.boolean().optional(),
          value: z.string(),
        }),
      ),
    })
    .optional(),
  content: z.string().optional(),
  note: z.enum(["info", "warning", "success", "deprecated", "hint"]).optional(),
  parentClass: z.string().optional(),
});

export const animatedNumber = z.object({
  type: z.string().optional(),
  value: z.union([z.number(), z.string()]).optional(),
  prependValue: z.string().optional(),
  appendValue: z.string().optional(),
});

const announcementBar = z.object({
  label: z.string(),
  icon: z.string().optional(),
  url: z.string().optional(),
  avatars: z.array(z.string()).optional(),
});

const heroButtonVideoSchema = z.object({
  src: z.string(),
  type: z.string().optional(),
  provider: z.enum(["youtube", "vimeo", "html5"]).optional().default("youtube"),
  poster: z.string().optional(),
  autoplay: z.boolean().optional(),
  id: z.string().optional(),
});

const heroButtonSchema = sharedButton
  .extend({
    type: z.enum(["button", "video"]).optional(),
    video: heroButtonVideoSchema.optional(),
  })
  .refine((data) => data.tag !== "a" || !!data.url, {
    message: "`url` is required when `tag` is 'a'",
    path: ["url"],
  });

const heroLeftBlockSchema = z.object({
  enable: z.boolean().default(true),
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  images: z
    .array(
      z.object({
        src: z.string(),
        alt: z.string(),
      }),
    )
    .optional(),
  items: z
    .array(
      z.object({
        text: z.string(),
        outlined: z.boolean().default(false),
      }),
    )
    .optional(),
});

const heroRightBlockSchema = z.object({
  enable: z.boolean().default(true),
  title: z.string(),
  description: z.string(),
  author: z.string(),
  icons: z.array(z.string()),
});

export const featuresSectionSchema = z
  .object({
    enable: z.boolean().default(false).optional(),
    bgShape: z.string().optional(),
    features: z.array(
      z.object({
        icon: z.string().optional(),
        title: z.string(),
        description: z.string(),
      }),
    ),
  })
  .optional();

export const heroSectionSchema = z
  .object({
    enable: z.boolean().default(true),
    title: z.union([z.string(), z.array(z.string())]).optional(),
    description: z.string().optional(),
    decorativeImage: z.string().optional(),
    ArrowdecorationImage: z.string().optional(),
    image: z.string().optional(),
    imageFrame: z.string().optional(),
    lineShape: z.string().optional(),
    gradientLeft: z.string().optional(),
    gradientRight: z.string().optional(),
    announcementBar: announcementBar.optional(),
    leftBlock: heroLeftBlockSchema.optional(),
    rightBlock: heroRightBlockSchema.optional(),
    button: heroButtonSchema.optional(),
    buttonPlay: heroButtonSchema.optional(),
    subtitle: z.string().optional(),
    socialLinks: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
          hoverEffect: z
            .enum([
              "text-flip",
              "creative-fill",
              "magnetic",
              "magnetic-text-flip",
              "none",
            ])
            .optional(),
        }),
      )
      .optional(),
    satisfactionClients: z
      .object({
        enable: z.boolean().default(true),
        count: z.string(),
        label: z.string(),
        avatars: z.array(z.string()).optional(),
        avatarAlt: z.string().optional(),
      })
      .optional(),
    slides: z
      .array(
        z.object({
          image: z.string(),
          alt: z.string().optional(),
          subtitle: z.string().optional(),
          title: z.string().optional(),
          button: heroButtonSchema.optional(),
        }),
      )
      .optional(),
    featuresGrid: featuresSectionSchema.optional(),
    imageAlt: z.string(),
    video: videoConfigSchema.optional(),
  })
  .catchall(z.any())
  .superRefine((data, ctx) => {
    if (data.slides?.length && !data.featuresGrid) {
      ctx.addIssue({
        code: "custom",
        message: "featuresGrid is required when slides are provided.",
        path: ["featuresGrid"],
      });
    }
  });

const popover = z.object({
  enable: z.boolean().default(false),
  title: z.string(),
  description: z.string(),
});

export const pricingSectionSchema = z
  .object({
    enable: z.boolean().default(false).optional(),
    badge: z.string().optional(),
    title: z.string().optional(),
    pricingComparisonTitle: z.string().optional(),
    pricingComparisonTogglerLabel: z.string().optional(),
    plans: z
      .object({
        enable: z.boolean().default(true),
        list: z.array(
          z.object({
            selected: z.boolean().default(false),
            label: z.string(),
          }),
        ),
      })
      .optional(),
    list: z.array(
      z.object({
        enable: z.boolean().default(true),
        icon: z.string().optional(),
        featured: z.boolean().default(false),
        featuresLabel: z.string().optional(),
        badge: z
          .object({
            enable: z.boolean().default(false),
            label: z.string(),
            variant: z.enum(["popular", "new", "recommended"]).optional(),
          })
          .optional(),
        name: z.string(),
        description: z.string(),
        price: z
          .array(
            animatedNumber.extend({
              typeAlternateValue: z.string().optional(),
            }),
          )
          .optional(),
        features: z.array(z.string()).optional(),
        button: button.optional(),
      }),
    ),
    comparison: z
      .array(
        z.object({
          label: z.string(),
          popover: popover.optional(),
          list: z.array(
            z.object({
              value: z.string(),
              showInCard: z.boolean(),
              included: z.array(z.union([z.boolean(), z.string()])),
              popover: popover.optional(),
            }),
          ),
        }),
      )
      .optional(),
  })
  .optional();

export const contactFormSchema = z.object({
  title: z.string().optional(),
  action: z.string().optional(),
  emailSubject: z.string().optional(),
  note: z.string().optional(),
  submitButton: z.object({
    enable: z.boolean().optional(),
    label: z.string(),
  }),
  inputs: z.array(inputFieldSchema),
});

export const commentFormSchema = z.object({
  title: z.string().optional(),
  emailSubject: z.string().optional(),
  submitButton: z.object({
    enable: z.boolean().optional(),
    label: z.string(),
  }),
  inputs: z.array(inputFieldSchema),
});

export const faqSectionSchema = z
  .object({
    enable: z.boolean().default(true).optional(),
    title: z.string().optional(),
    badge: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
  })
  .optional();

export const contactSectionSchema = z
  .object({
    enable: z.boolean().default(false),
    badge: z.string(),
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    characterImage: z.string().optional(),
    characterImageAlt: z.string().optional(),
    contactInformation: z.array(sharedContactItem),
    form: contactFormSchema,
    testimonial: z.object({
      enable: z.boolean().default(true),
      content: z.string().optional(),
      customer: z.object({
        avatar: z.string(),
        name: z.string(),
        role: z.string(),
      }),
    }),
    list: z.array(
      z.object({
        icon: z.string(),
        title: z.string(),
        description: z.string(),
      }),
    ),
  })
  .optional();

export const commentSectionSchema = z
  .object({
    enable: z.boolean().default(false),
    title: z.string(),
    form: commentFormSchema,
  })
  .optional();

export const officeLocationsSchema = z.object({
  enable: z.boolean().default(false),
  locationTitle: z.string().optional(),
  mapLink: z.string().optional(),
  list: z.array(
    z.object({
      enable: z.boolean().default(false),
      title: z.string(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      description: z.string().optional(),
    }),
  ),
});

export const teamSectionSchema = z
  .object({
    enable: z.boolean().default(false).optional(),
    badge: z.string().optional(),
    title: z.string().optional(),
    list: z.array(
      z.object({
        name: z.string(),
        image: z.string(),
        role: z.string(),
      }),
    ),
  })
  .optional();

export const testimonialSectionSchema = z
  .object({
    enable: z.boolean().default(true).optional(),
    title: z.string().optional(),
    badge: z.string().optional(),
    limit: z.union([z.number(), z.literal(false)]),
  })
  .optional();

export const aboutCompanySectionSchema = z
  .object({
    enable: z.boolean().default(true),
    badge: z.string().optional(),
    title: z.string(),
    description: z.string(),
    image: z.string(),
    imageAlt: z.string().optional(),
    imageSecondary: z.string().optional(),
    imageSecondaryAlt: z.string().optional(),
    images: z.array(z.string()).optional(),
    bgPatternImage: z.string().optional(),
    bgPatternImageAlt: z.string().optional(),
    sinceYear: z.string().optional(),
    rating: z
      .object({
        enable: z.boolean().default(true),
        score: z.string(),
        label: z.string(),
      })
      .optional(),
    button: sharedButton.optional(),
    founder: z
      .object({
        name: z.string(),
        role: z.string(),
        avatar: z.string(),
      })
      .optional(),
    experienceBadge: z
      .object({
        icon: z.string().optional(),
        label: z.string(),
        value: z.string(),
      })
      .optional(),
    features: z
      .array(
        z.object({
          icon: z.string(),
          title: z.string(),
          description: z.string(),
        }),
      )
      .optional(),
  })
  .optional();

export const ourServicesSectionSchema = z
  .object({
    enable: z.boolean().default(true),
    badge: z.string().optional(),
    title: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    button: sharedButton.optional(),
    footerText: z.string().optional(),
    footerLink: z
      .object({
        label: z.string(),
        url: z.string(),
      })
      .optional(),
    cardLayout: z.enum(["horizontal", "accordion", "card"]).optional(),
  })
  .optional();

export const numbersSectionSchema = z
  .object({
    enable: z.boolean().default(true),
    title: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    badge: z.string().optional(),
    list: z.array(
      z.object({
        value: z.string(),
        label: z.string().optional(),
        description: z.string(),
      }),
    ),
  })
  .optional();

export const featuresSplitSectionSchema = z
  .object({
    enable: z.boolean().default(true),
    title: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    badge: z.string().optional(),
    list: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    ),
  })
  .optional();

export const workingProcessSectionSchema = z
  .object({
    enable: z.boolean().default(true),
    badge: z.string().optional(),
    title: z.string(),
    image: z.string().optional(),
    list: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string().optional(),
      }),
    ),
  })
  .optional();

export const caseStudiesSectionSchema = z
  .object({
    enable: z.boolean().default(true),
    title: z.string(),
    limit: z.number().optional(),
    badge: z.string().optional(),
    cardLayout: z.enum(["case-studies"]).optional(),
  })
  .optional();

export const getInTouchSectionSchema = z
  .object({
    enable: z.boolean().default(true),
    hero: z
      .object({
        image: z.string(),
        imageAlt: z.string().optional(),
        taglineLeft: z.string().optional(),
        taglineRight: z.string().optional(),
        playLabel: z.string().optional(),
        video: videoConfigSchema.optional(),
        button: z
          .object({
            label: z.string(),
            url: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .optional();

export const customersSectionSchema = z
  .object({
    enable: z.boolean().default(true),
    description: z.string().optional(),
    list: z.array(
      z.object({
        name: z.string(),
        src: z.string(),
        alt: z.string(),
      }),
    ),
  })
  .optional();

export const blogSectionSchema = z.object({
  enable: z.boolean().default(true),
  badge: z.string().optional(),
  title: z.string().optional(),
  limit: z.number().optional(),
  cardLayout: z.enum(["card", "horizontal", "rounded", "compact"]).optional(),
  button: sharedButton.optional(),
});

export const marqueeTickerSchema = z
  .object({
    enable: z.boolean().default(true),
    items: z.array(z.string()).min(1),
    marquee: z
      .object({
        elementWidth: z.string().optional(),
        elementWidthAuto: z.boolean().default(true),
        elementWidthInSmallDevices: z.string().optional(),
        pauseOnHover: z.boolean().default(false),
        reverse: z.enum(["reverse", ""]).optional(),
        duration: z.string().default("30s"),
        image: z.string().optional(),
        imageLight: z.string().optional(),
      })
      .optional(),
  })
  .optional();

export const marqueeSectionSchema = z
  .object({
    enable: z.boolean().default(true),
    title: z.string().optional(),
    description: z.string().optional(),
    marquee: z.object({
      elementWidth: z.string().optional(),
      elementWidthAuto: z.boolean().default(true),
      elementWidthInSmallDevices: z.string().optional(),
      pauseOnHover: z.boolean().default(false),
      reverse: z.enum(["reverse", ""]).optional(),
      duration: z.string().default("50s"),
      text: z.string().optional(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      imageLight: z.string().optional(),
    }),
  })
  .optional();

export const whoWeAreSectionSchema = z.object({
  enable: z.boolean().default(true),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  progressBars: z
    .array(
      z.object({
        label: z.string(),
        percentage: z.number(),
      }),
    )
    .optional(),
  badge: z.string().optional(),
  title: z.string(),
  list: z
    .array(
      z.object({
        title: z.string(),
        value: z.string(),
        description: z.string(),
      }),
    )
    .optional(),
});

export const joinOurCommunitySectionSchema = z
  .object({
    enable: z.boolean().default(true),
    badge: z.string().optional(),
    title: z.string(),
    button: sharedButtonTag.optional(),
    bgImage: z.string().optional(),
  })
  .optional();

export const trustSectionSchema = z
  .object({
    enable: z.boolean().default(true),
    stats: z.array(
      z.object({
        value: z.string(),
        appendValue: z.string().optional(),
        label: z.string(),
        image: z.string().optional(),
      }),
    ),
    bgPattern: z.string().optional(),
    bgImage: z.string().optional(),
  })
  .optional();

export const experienceSectionSchema = z
  .object({
    enable: z.boolean().default(true),
    image: z.string(),
    imageAlt: z.string().optional(),
    bgPattern: z.string().optional(),
    bgPatternAlt: z.string().optional(),
    stats: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
        description: z.string().optional(),
        variant: z.enum(["white", "primary"]).default("white"),
      }),
    ),
  })
  .optional();

export const aboutHeroSectionSchema = z
  .object({
    enable: z.boolean().default(true).optional(),
    breadcrumb: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().optional(),
        }),
      )
      .optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    arrowBanner: z.string().optional(),
    spinningText: z.string().optional(),
    video: videoConfigSchema.optional(),
  })
  .optional();

export const aboutUsSectionSchema = z
  .object({
    enable: z.boolean().default(true).optional(),
    title: z.string().optional(),
    features: z
      .array(
        z.object({
          title: z.string(),
          description: z.string().optional(),
        }),
      )
      .optional(),
    imageLeft: z.string().optional(),
    imageLeftAlt: z.string().optional(),
    imageRight: z.string().optional(),
    imageRightAlt: z.string().optional(),
    satisfactionClients: z
      .object({
        enable: z.boolean().default(false).optional(),
        avatars: z.array(z.string()).optional(),
        avatarAlt: z.string().optional(),
        count: z.string().optional(),
        label: z.string().optional(),
      })
      .optional(),
  })
  .optional();

export const factSectionSchema = z
  .object({
    enable: z.boolean().default(true).optional(),
    facts: z
      .array(
        z.object({
          number: z.string(),
          appendValue: z.string().optional(),
          label: z.string(),
        }),
      )
      .optional(),
  })
  .optional();

export const successSectionSchema = z
  .object({
    enable: z.boolean().default(true).optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    progressBars: z
      .array(
        z.object({
          label: z.string(),
          percentage: z.number(),
        }),
      )
      .optional(),
  })
  .optional();

export const businessServiceSchema = z
  .object({
    enable: z.boolean().default(true).optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    satisfactionClients: z
      .object({
        enable: z.boolean().default(false).optional(),
        avatars: z.array(z.string()).optional(),
        avatarAlt: z.string().optional(),
        count: z.string().optional(),
        label: z.string().optional(),
      })
      .optional(),
    list: z
      .array(
        z.object({
          active: z.boolean().default(false),
          title: z.string(),
          content: z.string(),
        }),
      )
      .optional(),
  })
  .optional();

export const serviceWorkSectionSchema = z
  .object({
    enable: z.boolean().default(true).optional(),
    title: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    description: z.string().optional(),
    decorativeImage: z.string().optional(),
    button: sharedButton.optional(),
  })
  .optional();

export const fourZeroFourSectionSchema = z
  .object({
    enable: z.boolean().default(true).optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    button: sharedButton.optional(),
    image: z.string().optional(),
  })
  .optional();

export const sectionsSchema = z
  .object({
    contactSectionSchema,
    commentFormSchema,
    commentSectionSchema,
    teamSectionSchema,
    testimonialSectionSchema,
    pricingSectionSchema,
    heroSectionSchema,
    featuresSectionSchema,
    faqSectionSchema,
    aboutCompanySectionSchema,
    numbersSectionSchema,
    ourServicesSectionSchema,
    featuresSplitSectionSchema,
    workingProcessSectionSchema,
    caseStudiesSectionSchema,
    getInTouchSectionSchema,
    customersSectionSchema,
    blogSectionSchema,
    trustSectionSchema,
    marqueeTickerSchema,
    marqueeSectionSchema,
    whoWeAreSectionSchema,
    joinOurCommunitySectionSchema,
    experienceSectionSchema,
    aboutHeroSectionSchema,
    aboutUsSectionSchema,
    factSectionSchema,
    successSectionSchema,
    businessServiceSchema,
    officeLocationsSchema,
    serviceWorkSectionSchema,
    fourZeroFourSectionSchema,
  })
  .partial();
