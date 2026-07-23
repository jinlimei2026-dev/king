import config from "../../../.astro/config.generated.json";
import { getCollectionCTM } from "@/lib/contentParser.astro";
import { getTaxonomy } from "@/lib/taxonomyParser.astro";
import type { CollectionKey } from "astro:content";
import {
  getEntryRouteParam,
  getLocaleUrlCTM,
  supportedLanguages,
} from "./i18nUtils";
import { slugifyyy } from "./textConverter";

const { blogFolder, caseStudiesFolder } = config.settings;
const languageCodes = supportedLanguages.map(
  (language) => language.languageCode,
);

const stripLocalePrefix = (pathname: string): string => {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const segments = normalizedPath.split("/").filter(Boolean);

  if (segments[0] && languageCodes.includes(segments[0])) {
    const strippedPath = `/${segments.slice(1).join("/")}`;
    return strippedPath === "/"
      ? strippedPath
      : strippedPath.replace(/\/+$/, "");
  }

  return normalizedPath === "/"
    ? normalizedPath
    : normalizedPath.replace(/\/+$/, "");
};

const normalizeSlug = (value?: string): string => slugifyyy(value || "");

const getEntryTranslationKey = (entryId: string): string =>
  entryId.split("/").slice(1).join("/");

const findLocalizedEntryRouteParam = async (
  collection: CollectionKey,
  currentSlug: string,
  sourceLang: string | undefined,
  targetLang: string | undefined,
): Promise<string | null> => {
  const currentEntries = await getCollectionCTM(collection, sourceLang);
  const currentEntry = currentEntries.find(
    (entry) =>
      normalizeSlug(getEntryRouteParam(entry)) === normalizeSlug(currentSlug),
  );

  if (!currentEntry) {
    return null;
  }

  const translationKey = getEntryTranslationKey(currentEntry.id);
  const targetEntries =
    sourceLang === targetLang
      ? currentEntries
      : await getCollectionCTM(collection, targetLang);

  const targetEntry = targetEntries.find(
    (entry) => getEntryTranslationKey(entry.id) === translationKey,
  );

  return targetEntry ? getEntryRouteParam(targetEntry) : null;
};

const findLocalizedCategorySlug = async (
  currentSlug: string,
  sourceLang: string | undefined,
  targetLang: string | undefined,
): Promise<string | null> => {
  const currentCategories = await getTaxonomy(
    blogFolder as "blog",
    "categories",
    sourceLang,
  );
  const currentCategory = currentCategories.find((category) => {
    const candidates = [category.slug, ...(category.aliases || [])];
    return candidates.some(
      (candidate) => normalizeSlug(candidate) === normalizeSlug(currentSlug),
    );
  });

  if (!currentCategory) {
    return null;
  }

  const sourceKeys = new Set(
    [currentCategory.slug, ...(currentCategory.aliases || [])].map(
      normalizeSlug,
    ),
  );
  const targetCategories =
    sourceLang === targetLang
      ? currentCategories
      : await getTaxonomy(blogFolder as "blog", "categories", targetLang);

  const targetCategory = targetCategories.find((category) => {
    const candidates = [category.slug, ...(category.aliases || [])].map(
      normalizeSlug,
    );
    return candidates.some((candidate) => sourceKeys.has(candidate));
  });

  return targetCategory?.slug || null;
};

export const getLocalizedPathnameCTM = async (
  pathname: string,
  sourceLang: string | undefined,
  targetLang: string | undefined,
): Promise<string> => {
  const basePath = stripLocalePrefix(pathname);
  const segments = basePath.split("/").filter(Boolean);

  if (segments.length === 0) {
    return getLocaleUrlCTM("/", targetLang);
  }

  if (segments[0] === blogFolder && segments[1] === "category" && segments[2]) {
    const localizedCategorySlug = await findLocalizedCategorySlug(
      segments[2],
      sourceLang,
      targetLang,
    );

    return getLocaleUrlCTM(
      localizedCategorySlug || segments[2],
      targetLang,
      `/${blogFolder}/category`,
    );
  }

  if (
    segments[0] === blogFolder &&
    segments[1] &&
    segments[1] !== "page" &&
    segments[1] !== "category"
  ) {
    const localizedEntrySlug = await findLocalizedEntryRouteParam(
      blogFolder as CollectionKey,
      segments[1],
      sourceLang,
      targetLang,
    );

    return getLocaleUrlCTM(
      localizedEntrySlug || segments[1],
      targetLang,
      `/${blogFolder}`,
    );
  }

  if (segments[0] === "services" && segments[1] && segments[1] !== "page") {
    const localizedEntrySlug = await findLocalizedEntryRouteParam(
      "products",
      segments[1],
      sourceLang,
      targetLang,
    );

    return getLocaleUrlCTM(
      localizedEntrySlug || segments[1],
      targetLang,
      "/services",
    );
  }

  if (
    segments[0] === caseStudiesFolder &&
    segments[1] &&
    segments[1] !== "page"
  ) {
    const localizedEntrySlug = await findLocalizedEntryRouteParam(
      caseStudiesFolder as CollectionKey,
      segments[1],
      sourceLang,
      targetLang,
    );

    return getLocaleUrlCTM(
      localizedEntrySlug || segments[1],
      targetLang,
      `/${caseStudiesFolder}`,
    );
  }

  if (segments.length === 1) {
    const localizedPageSlug = await findLocalizedEntryRouteParam(
      "pages" as CollectionKey,
      segments[0],
      sourceLang,
      targetLang,
    );

    if (localizedPageSlug) {
      return getLocaleUrlCTM(localizedPageSlug, targetLang);
    }
  }

  return getLocaleUrlCTM(basePath, targetLang);
};
