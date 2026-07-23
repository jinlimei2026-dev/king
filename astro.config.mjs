import mdx from "@astrojs/mdx";
import remarkToc from "remark-toc";
import AutoImport from "astro-auto-import";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import rehypeExternalLinks from "rehype-external-links";
import { enabledLanguages } from "./src/lib/utils/i18nUtils.ts";
import remarkParseContent from "./src/lib/utils/remarkParseContent.ts";
import config from "./.astro/config.generated.json";
import fontsJson from "./src/config/fonts.json";
import { generateAstroFontsConfig } from "./src/lib/utils/AstroFont.ts";

const fonts = generateAstroFontsConfig(fontsJson);

let {
  seo: { sitemap: sitemapConfig },
  settings: {
    multilingual: { showDefaultLangInUrl, defaultLanguage },
  },
} = config;

export default defineConfig({
  site: process.env.SITE_URL || config.site.baseUrl || "http://kingsendainsulation.com",
  base: process.env.BASE_PATH || "/",
  trailingSlash: config.site.trailingSlash ? "always" : "never",
  devToolbar: {
    enabled: false,
  },
  image: {
    layout: "constrained",
  },
  fonts,

  i18n: {
    locales: enabledLanguages,
    defaultLocale: defaultLanguage,
    routing: {
      prefixDefaultLocale: showDefaultLangInUrl,
    },
  },

  integrations: [
    sitemapConfig.enable ? sitemap() : null,
    AutoImport({
      imports: [
        "@/shortcodes/ImageList.astro",
        "@/shortcodes/ImageItem.astro",
        "@/shortcodes/InfoBlockItem.astro",
        "@/shortcodes/InfoBlockList.astro",
      ],
    }),
    mdx(),
  ],

  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      ],
    ],
    remarkPlugins: [remarkParseContent, remarkToc],

    shikiConfig: {
      theme: "light-plus",
      wrap: false,
    },
    extendDefaultPlugins: true,
  },

  vite: {
    logLevel: "error",
    build: {
      minify: true,
    },
    plugins: [tailwindcss()],
    server: {
      allowedHosts: true,
    },
  },
});
