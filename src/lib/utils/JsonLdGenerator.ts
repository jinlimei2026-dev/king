import { absoluteUrl } from "./absoluteUrl";
import { getLocaleUrlCTM } from "@/lib/utils/i18nUtils";
import trailingSlashChecker from "./trailingSlashChecker";
import social from "@/config/social.json";

export type JSONLDProps = {
  canonical?: string;
  title?: string;
  description?: string;
  image?: string;
  categories?: string[];
  author?: string;
  pageType?: string;

  [key: string]: any;
};

export default function JsonLdGenerator(content: JSONLDProps, Astro: any) {
  let {
    canonical = "/",
    title = "",
    description = "",
    image = "",
    pageType = "",
    lang,
    alternateLangs = [],
    config,
  } = content || {};

  if (!lang) {
    lang = config.settings.multilingual.defaultLanguage;
  }

  let jsonLdData: Record<string, any> = {
    "@context": "https://schema.org",
  };

  switch (pageType) {
    default:
      jsonLdData["@type"] = "WebPage";
      jsonLdData.name = title;
      jsonLdData.description = description;
      jsonLdData.image = image;
      jsonLdData.url = canonical;

      if (lang) {
        jsonLdData.inLanguage = lang;
      }
  }

  const siteTitle =
    config.site.title +
    (config.site.tagline &&
      (config.site.taglineSeparator || " - ") + config.site.tagline);

  jsonLdData["isPartOf"] = {
    "@type": "WebSite",
    name: siteTitle,
    description: config.site.description,
    url: trailingSlashChecker(Astro.url.origin),
  };

  if (alternateLangs.length > 0) {
    jsonLdData.alternateLanguage = alternateLangs
      .filter((alt: any) => Astro.currentLocale !== alt.languageCode)
      .map((alt: any) => ({
        "@type": "WebPage",
        url: getLocaleUrlCTM(canonical, alt.languageCode),
        inLanguage: alt.languageCode,
      }));
  }

  jsonLdData.publisher = {
    "@type": "Organization",
    name: config.seo.author,
    url: trailingSlashChecker(Astro.url.origin),
    sameAs: social.main.filter((item) => item.enable).map((item) => item.url),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(config.site.logo, Astro),
    },
  };

  return jsonLdData;
}
