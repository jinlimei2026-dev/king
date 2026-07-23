import { recursiveCloneObject } from "./objectFunctions";

export default function overrideObjects(target: any, source: any): any {
  const result = recursiveCloneObject(target);

  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      result[key] &&
      typeof result[key] === "object"
    ) {
      result[key] = overrideObjects(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}
