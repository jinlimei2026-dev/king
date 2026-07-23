import { visit } from "unist-util-visit";
export default function remarkParseContent(): any {
  return (tree: any) => {
    visit(tree, "heading", (node) => {
      const headingText = node.children
        .map((child: any) => child.value)
        .join("");

      const classRegex = /\[([^\]]+)\]/g;
      let match;
      let classes = [];

      while ((match = classRegex.exec(headingText)) !== null) {
        const classList = match[1].split(/\s+/);
        for (const word of classList) {
          if (word.startsWith(".")) {
            classes.push(word.slice(1));
          }
        }
      }

      if (classes.length > 0) {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};

        const newClass = classes.join(" ");
        if (node.data.hProperties.class) {
          node.data.hProperties.class += " " + newClass;
        } else {
          node.data.hProperties.class = newClass;
        }
      }

      node.children = node.children?.map((child: any) => ({
        ...child,
        value: child.value.replace(classRegex, "").trim(),
      }));
    });

    visit(tree, "image", (node: any) => {
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      node.data.hProperties.loading = "lazy";
    });
  };
}
