import { launch, Page } from "puppeteer-core";
import { getOptions } from "./options";
let _page: Page | null;

async function getPage(isDev: boolean) {
  if (_page) {
    return _page;
  }
  const options = await getOptions(isDev);
  const browser = await launch(options);
  _page = await browser.newPage();
  return _page;
}

export async function getScreenshot(
  html: string,
  isDev: boolean,
  width: number = 1200,
  height: number = 630,
  target?: string
) {
  const page = await getPage(isDev);
  await page.setViewport({ width, height });
  await page.setContent(html, { waitUntil: "networkidle0" });

  if (target) {
    await page.waitForSelector(target);
    const clip = await page.evaluate(s => {
      const el = document.querySelector<HTMLElement>(s);
      if (!el) {
        return null;
      }

      const { width, height, top: y, left: x } = el.getBoundingClientRect();
      return { width, height, x, y };
    }, target);

    if (clip) {
      const file = await page.screenshot({ clip, type: "png" });
      return file;
    }
  }

  const file = await page.screenshot({ type: "png" });
  return file;
}
