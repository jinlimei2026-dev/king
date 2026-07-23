import type { ChildNavigationLink, NavigationLink } from "@/types";
import { getLocaleUrlCTM } from "@/lib/utils/i18nUtils";

type NavItem = NavigationLink | ChildNavigationLink;

const normalizePath = (value: string): string => {
  const path = value.split("?")[0]?.split("#")[0] || "/";
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path || "/";
};

const toInternalPath = (
  url: string | undefined,
  locale: string | undefined,
  currentHostname: string | undefined,
): string | null => {
  if (!url) return null;
  const localized = getLocaleUrlCTM(url, locale);
  try {
    const parsedUrl = new URL(localized);

    if (!parsedUrl.protocol.startsWith("http")) return null;
    if (!currentHostname || parsedUrl.hostname !== currentHostname) {
      return null;
    }

    return normalizePath(parsedUrl.pathname);
  } catch {
    return normalizePath(localized);
  }
};

export const isActiveUrl = (
  url: string | undefined,
  currentPath: string,
  locale: string | undefined,
  currentHostname: string | undefined,
): boolean => {
  if (!url || url.includes("#")) return false;
  const targetPath = toInternalPath(url, locale, currentHostname);
  if (!targetPath) return false;
  return normalizePath(currentPath) === targetPath;
};

const isEnabled = (item: NavItem | undefined): boolean =>
  item?.enable !== false;

export const isActiveMenu = (
  menu: NavItem,
  currentPath: string,
  locale: string | undefined,
  currentHostname: string | undefined,
): boolean => {
  if (!isEnabled(menu)) return false;
  if (isActiveUrl(menu.url, currentPath, locale, currentHostname)) {
    return true;
  }

  if (
    menu.children?.some((child) =>
      isActiveMenu(child, currentPath, locale, currentHostname),
    )
  ) {
    return true;
  }

  const megaMenus = (menu as NavigationLink).menus;
  if (
    megaMenus?.some((mega) =>
      isActiveMenu(mega, currentPath, locale, currentHostname),
    )
  ) {
    return true;
  }

  return false;
};
