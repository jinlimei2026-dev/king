import { fontProviders } from "astro/config";
export function generateAstroFontsConfig(fontsJson: Array<any>): Array<any> {
  const fonts = fontsJson.map((font) => {
    const weights = [
      ...new Set(
        font.variants.map((variant: { weight: any }) => variant.weight),
      ),
    ];
    const styles = [
      ...new Set(font.variants.map((variant: { style: any }) => variant.style)),
    ];

    const cssVariable = font.cssVariable.startsWith("--")
      ? font.cssVariable
      : `--${font.cssVariable}`;

    let provider;
    switch (font.provider) {
      case "google-fonts":
        provider = fontProviders.google();
        break;
      case "fontsource":
        provider = fontProviders.fontsource();
        break;
      case "bunny":
        provider = fontProviders.bunny();
        break;
      case "fontshare":
        provider = fontProviders.fontshare();
        break;
      case "local":
        provider = "local";
        break;
      default:
        provider = fontProviders.google();
    }

    const astroFont = {
      provider: provider,
      name: font.name,
      cssVariable: cssVariable,
      fallbacks: [font.fallback || "sans-serif"],
    };

    if (provider !== "local" && styles.length > 0) {
      // @ts-expect-error
      astroFont.styles = styles;
    }

    if (font.display) {
      // @ts-expect-error
      astroFont.display = font.display;
    }

    if (provider !== "local" && weights.length > 0) {
      // @ts-expect-error
      astroFont.weights = weights;
    }

    if (font.optimizedFallbacks !== undefined) {
      // @ts-expect-error
      astroFont.optimizedFallbacks = font.optimizedFallbacks;
    }

    if (font.subsets) {
      // @ts-expect-error
      astroFont.subsets = font.subsets;
    }

    if (font.provider === "local") {
      // @ts-expect-error
      astroFont.variants = font.variants;
    }

    return astroFont;
  });

  return fonts;
}
