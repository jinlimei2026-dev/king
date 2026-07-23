import path from "node:path";
import * as toml from "toml";
import { promises as fs } from "node:fs";
import { watch } from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

const configFilePath = path.resolve(
  PROJECT_ROOT,
  "src",
  "config",
  "config.toml",
);

const outputDir = path.resolve(PROJECT_ROOT, ".astro");
const outputFilePath = path.join(outputDir, "config.generated.json");

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function debounce(fn, delay = 150) {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
}

async function convertTomlToJson() {
  try {
    const content = await fs.readFile(configFilePath, "utf8");
    const parsed = toml.parse(content);

    await fs.mkdir(outputDir, { recursive: true });

    const tempFile = outputFilePath + ".tmp";

    await fs.writeFile(tempFile, JSON.stringify(parsed, null, 2), "utf8");
    await fs.rename(tempFile, outputFilePath);

    console.log(`[kingsenda-watcher] ✓ Generated ${outputFilePath}`);
  } catch (err) {
    console.error(
      "[kingsenda-watcher] ✖ Conversion failed:",
      err?.message ?? err,
    );
  }
}

const debouncedConvert = debounce(convertTomlToJson, 150);

async function watchFile() {
  console.log("[kingsenda-watcher] Watching config.toml for changes...");

  let watcher;

  const startWatcher = async () => {
    if (!(await pathExists(configFilePath))) {
      console.warn("[kingsenda-watcher] Waiting for config.toml...");
      setTimeout(startWatcher, 1000);
      return;
    }

    watcher = watch(configFilePath, (eventType) => {
      if (eventType === "change") {
        debouncedConvert();
      }

      if (eventType === "rename") {
        console.log("[kingsenda-watcher] File replaced, restarting watcher...");
        watcher.close();
        startWatcher();
      }
    });

    watcher.on("error", (err) => {
      console.error("[kingsenda-watcher] Watch error:", err);
      watcher.close();
      setTimeout(startWatcher, 1000);
    });
  };

  await startWatcher();
}

(async () => {
  await convertTomlToJson();

  if (process.argv.includes("--watch")) {
    await watchFile();
  } else {
    process.exit(0);
  }
})();
