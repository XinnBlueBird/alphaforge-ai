/* eslint-disable */
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const BASE = process.env.BASE_URL || "https://alphaforge-ai-sigma.vercel.app";
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "raw");
const SCENES = require(path.join(ROOT, "scenes.json"));
const DUR_LIST = require(path.join(ROOT, "voice", "durations.json"));
const DUR = Object.fromEntries(DUR_LIST.map((d) => [d.id, d.dur]));
const PAD = 0.6;

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const t0 = Date.now();
const elapsed = () => ((Date.now() - t0) / 1000).toFixed(1);

async function smoothScrollTo(page, y, durationMs = 1200) {
  await page
    .evaluate(
      ({ y, durationMs }) =>
        new Promise((resolve) => {
          const startY = window.scrollY;
          const distance = y - startY;
          const start = performance.now();
          function step(now) {
            const t = Math.min(1, (now - start) / durationMs);
            const eased = 1 - Math.pow(1 - t, 3);
            window.scrollTo(0, startY + distance * eased);
            if (t < 1) requestAnimationFrame(step);
            else resolve();
          }
          requestAnimationFrame(step);
        }),
      { y, durationMs }
    )
    .catch(() => {});
}

async function smoothScrollBy(page, dy, durationMs = 1200) {
  const y = await page.evaluate(() => window.scrollY).catch(() => 0);
  await smoothScrollTo(page, y + dy, durationMs);
}

async function safeClick(page, selector, opts = {}) {
  return page
    .locator(selector)
    .first()
    .click({ timeout: 3000, ...opts })
    .then(() => true)
    .catch(() => false);
}

async function slowType(page, selector, text, perCharMs = 38) {
  const loc = page.locator(selector).first();
  const ok = await loc
    .click({ timeout: 4000 })
    .then(() => true)
    .catch(() => false);
  if (!ok) return false;
  for (const ch of text) {
    await page.keyboard.type(ch);
    await sleep(perCharMs);
  }
  return true;
}

// Per-scene action library
async function runAction(page, scene) {
  const a = scene.action;
  switch (a) {
    case "scroll_tour":
      await sleep(1500);
      await smoothScrollBy(page, 350, 2200);
      await smoothScrollBy(page, 450, 2200);
      await smoothScrollTo(page, 0, 1200);
      break;
    case "scroll_stats":
      await sleep(1000);
      await smoothScrollBy(page, 300, 1800);
      await smoothScrollBy(page, 400, 1800);
      await smoothScrollBy(page, 400, 1800);
      break;
    case "scroll_show":
      await sleep(1500);
      await smoothScrollBy(page, 250, 1800);
      await smoothScrollBy(page, 350, 1800);
      await smoothScrollBy(page, 300, 1800);
      break;
    case "type_and_submit":
      await sleep(1200);
      await slowType(page, "input[placeholder*='ticker' i], input[type='text']", scene.type_text || "SOL");
      await sleep(700);
      await safeClick(page, "button:has-text('Forge'), button:has-text('Generate'), button[type='submit']");
      await sleep(7000);
      await smoothScrollBy(page, 300, 1500);
      break;
    case "type_terminal":
      await sleep(1200);
      await slowType(page, "textarea, input[type='text']", scene.type_text || "");
      await sleep(600);
      await page.keyboard.press("Enter").catch(() => {});
      await sleep(8500);
      await smoothScrollBy(page, 200, 1200);
      break;
    case "tab_tour":
      await sleep(1200);
      for (const lbl of ["Token", "X", "Project", "DeFi"]) {
        await page
          .locator(`button:has-text("${lbl}"), [role='tab']:has-text("${lbl}")`)
          .first()
          .click({ timeout: 1500 })
          .catch(() => {});
        await sleep(1500);
      }
      await smoothScrollBy(page, 250, 1500);
      break;
    case "click_run":
      await sleep(1200);
      await safeClick(page, "button:has-text('Run'), button:has-text('Backtest'), button[type='submit']");
      await sleep(4000);
      await smoothScrollBy(page, 350, 1800);
      break;
    case "click_compose":
      await sleep(1200);
      await safeClick(page, "button:has-text('Compose'), button:has-text('Sample'), button:has-text('Generate')");
      await sleep(4500);
      await smoothScrollBy(page, 250, 1500);
      break;
    case "click_simulate":
      await sleep(1200);
      // try one of the sample chips first to populate
      const chip = await safeClick(page, "button:has-text('USDC'), button:has-text('1000'), button:has-text('SOL')");
      if (chip) await sleep(1200);
      await safeClick(page, "button:has-text('Simulate'), button[type='submit']");
      await sleep(4500);
      await smoothScrollBy(page, 350, 1800);
      break;
    default:
      await sleep(1500);
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    recordVideo: { dir: OUT_DIR, size: { width: 1280, height: 720 } },
  });
  const page = await context.newPage();

  let cumulative = 0;
  for (let i = 0; i < SCENES.length; i++) {
    const s = SCENES[i];
    const audio = DUR[s.id];
    if (audio === undefined) {
      console.error(`[err] no duration for scene ${s.id}`);
      process.exit(1);
    }
    const sceneDur = audio + PAD;
    const sceneEnd = cumulative + sceneDur;
    const sceneEndMs = t0 + sceneEnd * 1000;

    console.log(
      `[${elapsed()}s] scene ${i + 1}/${SCENES.length}: ${s.label.padEnd(18)} ` +
        `audio=${audio.toFixed(2)}s budget=${sceneDur.toFixed(2)}s start=${cumulative.toFixed(1)}s`
    );

    const url = s.path.startsWith("http") ? s.path : `${BASE}${s.path}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => {});
    await sleep(800); // settle

    await runAction(page, s);

    // HARD HOLD until scene's audio is done
    const remaining = sceneEndMs - Date.now();
    if (remaining > 0) {
      console.log(`  hold ${(remaining / 1000).toFixed(1)}s...`);
      await sleep(remaining);
    } else {
      console.log(`  ! overran by ${(-remaining / 1000).toFixed(2)}s`);
    }
    cumulative += sceneDur;
    console.log(`  end @ ${elapsed()}s (planned ${sceneEnd.toFixed(2)}s)`);
  }

  await context.close();
  await browser.close();

  const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith(".webm"));
  console.log(`\n[${elapsed()}s] DONE — output: ${files.map((f) => path.join(OUT_DIR, f)).join(", ")}`);
})();
