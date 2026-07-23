import path from "node:path";
import type { CollectionEntry, CollectionKey } from "astro:content";
import trailingSlashChecker from "./trailingSlashChecker";
import config from "../../../.astro/config.generated.json";
import languagesJSON from "../../config/language.json";

let {
  enable: multilingualEnable,
  showDefaultLangInUrl,
  defaultLanguage,
  disableLanguages,
} = config.settings.multilingual;

export const getEnabledLocales = (): string[] => {
  let enabled = languagesJSON.map((lang) => lang.languageCode);
  const supported = languagesJSON.map((lang) => lang.languageCode);
  const disabled = multilingualEnable
    ? disableLanguages || []
    : supported.filter((lang) => lang !== defaultLanguage);

  if (disabled.length > 0) {
    enabled = supported.filter((lang) => !disabled.includes(lang as never));
  }

  return enabled;
};

export const enabledLanguages = getEnabledLocales();

export const normalizeLocaleCode = (
  providedLang: string | undefined,
): string => {
  const supportedLocaleCodes = getSupportedLanguages().map(
    (language) => language.languageCode,
  );

  if (providedLang && supportedLocaleCodes.includes(providedLang)) {
    return providedLang;
  }

  return defaultLanguage;
};

const translationCache: Record<string, any> = {};
export const useTranslations = async (lang: string): Promise<Function> => {
  const { defaultLanguage, disableLanguages } = config.settings.multilingual;

  const resolvedLang = disableLanguages?.includes(lang as never)
    ? defaultLanguage
    : lang;

  if (translationCache[resolvedLang]) {
    return translationCache[resolvedLang];
  }

  const language =
    languagesJSON.find((l) => l.languageCode === resolvedLang) ||
    languagesJSON.find((l) => l.languageCode === defaultLanguage);

  if (!language) {
    throw new Error("Default language configuration not found");
  }

  const contentDir = language.contentDir;
  let menu, dictionary;

  try {
    menu = await import(`../../../src/config/menu.${lang}.json`);
    dictionary = await import(`../../../src/i18n/${lang}.json`);
  } catch (error) {
    menu = await import(`../../../src/config/menu.${defaultLanguage}.json`);
    dictionary = await import(`../../../src/i18n/${defaultLanguage}.json`);
  }

  const translations = {
    ...menu,
    ...dictionary,
    contentDir,
  };

  type NestedObject = Record<string, any>;

  type DotNotationKeys<T> = T extends NestedObject
    ? {
        [K in keyof T & string]: T[K] extends NestedObject
          ? `${K}` | `${K}.${DotNotationKeys<T[K]>}`
          : `${K}`;
      }[keyof T & string]
    : never;

  const t = <T extends NestedObject>(key: DotNotationKeys<T>): string | any => {
    const keys = key.split(".");

    let value: any = translations;
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return "Not Found";
      }
    }

    return value;
  };

  translationCache[resolvedLang] = Object.assign(t, translations);

  return translationCache[resolvedLang];
};

let cachedLanguages: Array<any> | null = null;
export const getSupportedLanguages = (): Array<any> => {
  if (cachedLanguages) {
    return cachedLanguages;
  }

  const supportedLanguages = [...languagesJSON.map((lang) => lang)];
  let disabledLanguages = (
    config.settings.multilingual.enable
      ? config.settings.multilingual.disableLanguages
      : supportedLanguages
          .map(
            (lang) =>
              lang.languageCode !== defaultLanguage && lang.languageCode,
          )
          .filter(Boolean)
  ) as (typeof supportedLanguages)[0]["languageCode"][];

  cachedLanguages = disabledLanguages
    ? supportedLanguages.filter(
        (lang) => !disabledLanguages?.includes(lang.languageCode),
      )
    : supportedLanguages;

  return cachedLanguages;
};

export const supportedLanguages = getSupportedLanguages();

export function generatePaths(): Array<{
  params: { lang: string | undefined };
}> {
  const supportedLanguages = getSupportedLanguages();
  const paths = supportedLanguages.map((lang) => ({
    params: {
      lang:
        lang.languageCode === defaultLanguage && !showDefaultLangInUrl
          ? undefined
          : lang.languageCode,
    },
  }));

  return paths;
}

export const getLocaleUrlCTM = (
  url: string,
  providedLang: string | undefined,
  prependValue?: string,
): string => {
  const language = normalizeLocaleCode(providedLang);
  const languageCodes = languagesJSON.map((language) => language.languageCode);
  const languageDirectories = new Set(
    languagesJSON.map((language) => language.contentDir),
  );

  function checkIsExternal(url: string) {
    try {
      const parsedUrl = new URL(url, config.site.baseUrl);
      const baseUrl = new URL(config.site.baseUrl);

      if (!parsedUrl.protocol.startsWith("http")) {
        return false;
      }

      const isSameOrigin = parsedUrl.origin === baseUrl.origin;

      const isLocalhost =
        parsedUrl.hostname === "localhost" ||
        parsedUrl.hostname === "127.0.0.1";

      return !(isSameOrigin || isLocalhost);
    } catch (error) {
      return false;
    }
  }

  let updatedUrl = url;
  let isExternalUrl = checkIsExternal(url);

  if (isExternalUrl) return url;

  if (url.endsWith(".mdx") || url.endsWith(".md")) {
    updatedUrl = url.replace(/\.(md|mdx)$/, "");
  }

  if (url.startsWith("mailto:") || url.startsWith("tel:")) return url;

  const isAbsoluteUrl = url.startsWith("http://") || url.startsWith("https://");
  let hash;

  if (isAbsoluteUrl) {
    updatedUrl = new URL(url).pathname;

    if (url.includes("#")) {
      hash = url.split("#")[1];
    }
  }

  if (
    updatedUrl &&
    !updatedUrl.startsWith("/") &&
    !updatedUrl.startsWith("#") &&
    !updatedUrl.startsWith("?")
  ) {
    updatedUrl = `/${updatedUrl}`;
  }

  for (const langDir of languageDirectories) {
    if (updatedUrl.startsWith(`${langDir}/`)) {
      updatedUrl = updatedUrl.replace(`${langDir}/`, "/");
      break;
    }
  }

  if (prependValue) {
    if (!prependValue.startsWith("/")) {
      updatedUrl = path.posix.join("/" + prependValue, updatedUrl);
    } else {
      updatedUrl = path.posix.join(prependValue, updatedUrl);
    }
  }

  const isDefaultLanguage = language === defaultLanguage;

  const getUrlWithoutLang = (u: string): string | undefined => {
    const segments = u.split("/");
    const lang = languageCodes.find((item) => segments.includes(item));

    const urlWithoutLang = u.replace(`/${lang}`, "");

    if (urlWithoutLang === "") return "/";

    return urlWithoutLang;
  };

  const shouldShowDefaultLang = isDefaultLanguage && showDefaultLangInUrl;
  const shouldOmitDefaultLang = isDefaultLanguage && !showDefaultLangInUrl;

  if (updatedUrl === "/" || updatedUrl === "") {
    updatedUrl = `/${defaultLanguage || ""}`;
  }

  const prependLanguage = shouldOmitDefaultLang
    ? ""
    : `/${shouldShowDefaultLang ? defaultLanguage : language}`;

  updatedUrl = path.posix.join(
    prependLanguage,
    getUrlWithoutLang(updatedUrl) as string,
  );

  updatedUrl = trailingSlashChecker(updatedUrl);

  if (isAbsoluteUrl) {
    updatedUrl = new URL(url).origin + updatedUrl;

    if (hash) {
      updatedUrl = `${updatedUrl}#${hash}`;
    }
  }

  // Prepend Astro base path (e.g. /king/) for subdirectory deployments
  let basePath = "/";
  try {
    basePath = (import.meta as any).env?.BASE_URL || "/";
  } catch {}
  if (basePath !== "/") {
    updatedUrl = basePath.replace(/\/$/, "") + updatedUrl;
  }

  return updatedUrl;
};

type SlugEntry = Pick<CollectionEntry<CollectionKey>, "id" | "collection"> & {
  data?: {
    customSlug?: string;
  };
};

export const getEntryRouteParam = (
  entry: Pick<CollectionEntry<CollectionKey>, "id"> & {
    data?: {
      customSlug?: string;
    };
  },
): string =>
  entry.data?.customSlug ||
  entry.id
    .replace(/\.mdx?|\.md/g, "")
    .split("/")
    .pop() ||
  entry.id;

export const getEntrySlugCTM = (
  entry: SlugEntry,
  providedLang: string | undefined,
): string => {
  return getLocaleUrlCTM(
    getEntryRouteParam(entry),
    providedLang,
    entry.collection,
  );
};
