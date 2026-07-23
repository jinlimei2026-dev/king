import { getImage } from "astro:assets";

const bgOptimizedImage = async (
  src: string,
  format?: "auto" | "avif" | "jpeg" | "png" | "svg" | "webp",
) => {
  src = `/src/assets${src}`;
  const images = import.meta.glob(
    "/src/assets/images/**/*.{jpeg,jpg,png,svg,gif}",
  );

  if (!src || !images[src]) {
    console.error(
      `\x1b[31mImage not found - ${src}.\x1b[0m Make sure the image is in the /src/assets/images folder.`,
    );

    return "";
  }

  const getImagePath = async (image: string) => {
    try {
      const imageData = (await images[image]()) as any;
      return imageData;
    } catch (error) {
      return `Image not found - ${src}. Make sure the image is in the /src/assets/images folder.`;
    }
  };

  const image = await getImagePath(src);

  const OptimizedImage = await getImage({
    src: image.default,
    format: format,
  });

  return OptimizedImage.src;
};

export default bgOptimizedImage;
