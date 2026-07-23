import config from ".astro/config.generated.json";
import { defineCollection } from "astro:content";
import { button, sectionsSchema } from "./sections.schema";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const servicesFolder = config.settings.servicesFolder || "services";

const contentLoader = (base: string) =>
  glob({ pattern: "**/[^_]*.{md,mdx}", base });

const basePage = z.object({
  title: z.string(),
  breadcrumbTitle: z.string().optional(),
  author: z.string().optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  date: z.date().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  weight: z.number().optional(),
  draft: z.boolean().optional(),
  button: button.optional(),
  button1: button.optional(),
  button2: button.optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  robots: z.string().optional(),
  excludeFromSitemap: z.boolean().optional(),
  excludeFromCollection: z.boolean().optional(),
  customSlug: z.string().optional(),
  canonical: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  disableTagline: z.boolean().optional(),
  featuresList: z.any().optional(),
  specs: z.any().optional(),
  highlightTags: z
    .array(
      z.object({
        title: z.string(),
        subtitle: z.string(),
        icon: z.string(),
        themeColor: z.string(),
      }),
    )
    .optional(),
});

export const page = basePage.extend(sectionsSchema.shape);

export const marqueeConfig = z.object({
  elementWidth: z.string(),
  elementWidthAuto: z.boolean(),
  elementWidthInSmallDevices: z.string(),
  pauseOnHover: z.boolean(),
  reverse: z.enum(["reverse", ""]).optional(),
  duration: z.string(),
});

const serviceCollection = defineCollection({
  loader: contentLoader(`./src/content/${servicesFolder}`),
  schema: page.extend({
    icon: z.string().optional(),
    imagePosition: z.string().optional(),
    image3: z.string().optional(),
  }),
});

export const teamCollection = defineCollection({
  loader: contentLoader("./src/content/team"),
  schema: page.extend({
    image: z.string().optional(),
    profession: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    social: z
      .array(
        z.object({
          enable: z.boolean(),
          label: z.string(),
          icon: z.string(),
          url: z.string(),
        }),
      )
      .optional(),
    list: z
      .array(
        z.object({
          name: z.string(),
          role: z.string(),
          image: z.string(),
          status: z.string(),
          social: z.object({
            enable: z.boolean(),
            list: z.array(
              z.object({
                enable: z.boolean(),
                label: z.string(),
                icon: z.string(),
                url: z.string(),
              }),
            ),
          }),
        }),
      )
      .optional(),
  }),
});

const blogCollection = defineCollection({
  loader: contentLoader("./src/content/blog"),
  schema: page.extend({
    category: z.string().optional(),
    readingTime: z.string().optional(),
  }),
});

const casesCollection = defineCollection({
  loader: contentLoader("./src/content/cases"),
  schema: page.extend({
    category: z.string().optional(),
    coverImage: z.string().optional(),
  }),
});

export const collections = {
  [servicesFolder]: serviceCollection,
  products: serviceCollection,
  sections: defineCollection({
    loader: contentLoader("./src/content/sections"),
  }),
  homepage: defineCollection({
    loader: contentLoader("./src/content/homepage"),
  }),
  about: defineCollection({
    loader: contentLoader("./src/content/about"),
  }),
  pages: defineCollection({
    loader: contentLoader("./src/content/pages"),
  }),
  blog: blogCollection,
  cases: casesCollection,
};
