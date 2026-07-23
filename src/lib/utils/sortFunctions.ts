export const sortByDate = (array: any[]) => {
  const sortedArray = array.sort(
    (a: any, b: any) =>
      new Date(b.data.date && b.data.date).valueOf() -
      new Date(a.data.date && a.data.date).valueOf(),
  );
  return sortedArray;
};

type WeightedItem = {
  weight?: number | null;
  children?: WeightedItem[];
  menus?: WeightedItem[];
  [key: string]: any;
};

export function sortByWeight(array: WeightedItem[]): WeightedItem[] {
  return array
    .slice()
    .sort((a, b) => {
      const aWeight = a.weight ?? Infinity;
      const bWeight = b.weight ?? Infinity;
      return aWeight - bWeight;
    })
    .map((item) => ({
      ...item,
      ...(item.children ? { children: sortByWeight(item.children) } : {}),
      ...(item.menus ? { menus: sortByWeight(item.menus) } : {}),
    }));
}
