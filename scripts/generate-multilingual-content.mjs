import path from "node:path";
import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "..");

const CONTENT_DIR = path.resolve(PROJECT_ROOT, "src", "content");
const CONFIG_DIR = path.resolve(PROJECT_ROOT, "src", "config");
const I18N_DIR = path.resolve(PROJECT_ROOT, "src", "i18n");
const LANGUAGE_FILE = path.join(CONFIG_DIR, "language.json");

const TARGET_LANG = {
  languageName: "Fr",
  languageCode: "fr",
  contentDir: "french",
  weight: 2,
};

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
};
const log = (msg, color = "reset") => {
  console.log(`${colors[color]}${msg}${colors.reset}`);
};

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function readJsonFile(filePath) {
  try {
    const mod = await import(filePath);
    return mod.default ?? mod;
  } catch {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  }
}

const copyDir = async (src, dest) => {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
};

const findEnglishDirs = async (baseDir) => {
  const result = [];
  const entries = await fs.readdir(baseDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(baseDir, entry.name);
    if (!entry.isDirectory()) continue;

    if (entry.name.toLowerCase() === "english") {
      result.push(fullPath);
    } else {
      result.push(...(await findEnglishDirs(fullPath)));
    }
  }

  return result;
};

const cloneContent = async () => {
  log(`Cloning English content → ${TARGET_LANG.languageCode}...`, "cyan");

  try {
    if (!(await pathExists(CONTENT_DIR))) {
      log(`⚠️ CONTENT_DIR not found: ${CONTENT_DIR}`, "yellow");
      return;
    }

    const englishDirs = await findEnglishDirs(CONTENT_DIR);
    if (englishDirs.length === 0) {
      log("⚠️ No english folders found inside content.", "yellow");
      return;
    }

    let completed = 0;
    const total = englishDirs.length;

    for (const enDir of englishDirs) {
      const parentDir = path.dirname(enDir);
      const newDir = path.join(parentDir, TARGET_LANG.contentDir);

      await fs.mkdir(newDir, { recursive: true });
      await copyDir(enDir, newDir);

      completed++;
      const percent = Math.round((completed / total) * 100);

      log(
        `📂 Cloned ${enDir} → ${newDir} [${completed}/${total}] (${percent}%)`,
        "green",
      );
    }

    log(`✅ Finished cloning all content (${total} sections).`, "cyan");
  } catch (err) {
    log(`⚠️ Error cloning content: ${err?.message ?? String(err)}`, "yellow");
  }
};

const cloneMenu = async () => {
  const enMenu = path.join(CONFIG_DIR, "menu.en.json");
  const newMenu = path.join(
    CONFIG_DIR,
    `menu.${TARGET_LANG.languageCode}.json`,
  );

  try {
    if (!(await pathExists(enMenu))) {
      log(`⚠️ Missing menu file: ${enMenu}`, "yellow");
      return;
    }
    await fs.copyFile(enMenu, newMenu);
    log(`✅ Created menu file: ${newMenu}`, "green");
  } catch (err) {
    log(`⚠️ Error cloning menu: ${err?.message ?? String(err)}`, "yellow");
  }
};

const cloneI18n = async () => {
  const enFile = path.join(I18N_DIR, "en.json");
  const newFile = path.join(I18N_DIR, `${TARGET_LANG.languageCode}.json`);

  try {
    if (!(await pathExists(enFile))) {
      log(`⚠️ Missing i18n file: ${enFile}`, "yellow");
      return;
    }
    await fs.copyFile(enFile, newFile);
    log(`✅ Created i18n file: ${newFile}`, "green");
  } catch (err) {
    log(`⚠️ Error cloning i18n: ${err?.message ?? String(err)}`, "yellow");
  }
};

const updateLanguageConfig = async () => {
  try {
    if (!(await pathExists(LANGUAGE_FILE))) {
      log(`⚠️ Missing language.json: ${LANGUAGE_FILE}`, "yellow");
      return;
    }

    const languages = await readJsonFile(LANGUAGE_FILE);

    const exists = languages.some(
      (lang) => lang?.languageCode === TARGET_LANG.languageCode,
    );

    if (!exists) {
      const updated = [...languages, TARGET_LANG];
      await fs.writeFile(
        LANGUAGE_FILE,
        JSON.stringify(updated, null, 2),
        "utf8",
      );
      log(`✅ Added ${TARGET_LANG.languageCode} to language.json`, "green");
    } else {
      log(
        `ℹ️ ${TARGET_LANG.languageCode} already exists in language.json`,
        "yellow",
      );
    }
  } catch (err) {
    log(
      `⚠️ Error updating language.json: ${err?.message ?? String(err)}`,
      "yellow",
    );
  }
};

const run = async () => {
  log("🚀 Starting language generation...", "cyan");
  await cloneContent();
  await cloneMenu();
  await cloneI18n();
  await updateLanguageConfig();
  log("🎉 Language generation completed.", "green");
};

run();
