import config from "../../../.astro/config.generated.json";

const trailingSlashChecker = (url: string): string => {
  const [urlPath, fragment] = url.split("#");
  const hasTrailingSlash = urlPath.endsWith("/");
  const shouldHaveTrailingSlash = config.site.trailingSlash;
  const adjustedPath = shouldHaveTrailingSlash
    ? hasTrailingSlash
      ? urlPath
      : `${urlPath}/`
    : hasTrailingSlash
      ? urlPath.slice(0, -1)
      : urlPath;

  const fullURL = fragment ? `${adjustedPath}#${fragment}` : adjustedPath;

  return fullURL as string;
};

export default trailingSlashChecker;
