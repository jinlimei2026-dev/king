export function recursiveCloneObject(obj: any) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const copy: any = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    copy[key] = recursiveCloneObject(obj[key]);
  }

  return copy;
}
