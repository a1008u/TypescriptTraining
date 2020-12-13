import * as puppeteer from "puppeteer";
import * as site from "./json/site.json";
import { TARGET } from "~/src/puppeteer/json/url.json";
import * as fs from "fs";

import { performance } from "perf_hooks";
import {JSHandle} from "puppeteer";

async function mkBrowserAndPage() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.CHROME_BIN,
    args: [
      "--no-sandbox",
      "--headless",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
  });
  const page = await browser.newPage();
  return { browser, page };
}

const outputFile = (path: string, jsonStringify: string) => {
  fs.writeFileSync(path, jsonStringify);
};

async function pageConfig(page: puppeteer.Page) {
  await page.emulate(puppeteer.devices["iPhone X"]);
  await page.emulateTimezone("Asia/Tokyo");
}

async function getAllDom(page: puppeteer.Page, name: string) {
  return await page.$eval("html", (item) => item.innerHTML);
}

async function outputPageAllDom(page: puppeteer.Page, domainName: string) {
  const html_dom = await getAllDom(page, domainName);
  outputFile(`./output/dom/${domainName}.html`, html_dom);
}

async function getScreenShot(page: puppeteer.Page, name: string) {
  await page.screenshot({
    path: `./output/screenshot/${name}.png`,
    fullPage: true,
  });
}

async function getTargetTag(page: puppeteer.Page, targetTag: string) {
  const item = await page.$(targetTag);
  if (item) {
    const data = (await item.getProperty("src")).jsonValue;
    console.log("------ ", data);
  }
}

function getMetaData(page: puppeteer.Page) {
  return page.evaluate(() => {
    const results: metainfo[] = [];
    document.querySelectorAll("meta").forEach((meta: HTMLMetaElement) => {
      results.push({
        name: meta.getAttribute("name"),
        content: meta.getAttribute("content"),
        charset: meta.getAttribute("charset"),
        httpEquiv: meta.getAttribute("http-equiv"),
        property: meta.getAttribute("property"),
      });
    });
    return results;
  });
}

async function outputPageMetadata(page: puppeteer.Page, domainName: string) {
  const result = await getMetaData(page);
  const jsonStringify = JSON.stringify(result);
  outputFile(`./output/meta/${domainName}.json`, jsonStringify);
  return result;
}

async function getTextFromPage(page: puppeteer.Page, domainName: string) {
  console.log("ーーーーーーーーーーーーーgetTextFromPageを実行 start");

  const childrenNames = await page.evaluate((selector) => {
    const names = [];
    for (const element of document.querySelector(selector).children) {
      names.push(element.tagName);
    }
    return names;
  }, "body");
  console.log(childrenNames);

  const childrenNames2 = await page.evaluate((selector) => {
    const names: string[] = [];
    for (const element of document.querySelector(selector).children) {
      if (element.tagName === "DIV" || element.tagName === "META") {
        names.push(element.textContent);
      } else {
        console.log(element.tagName);
      }
    }
    return names;
  }, "body");
  console.log("ーーーーーーー" + childrenNames2);

  async function getText(dataset: string[]) {
    let cd = "";
    dataset.forEach((d) => {
      if (d) {
        cd = `${cd + d} -- `;
      }
    });
    return cd;
  }
  const cd = await getText(childrenNames2);
  outputFile(`./output/text/${domainName}.txt`, cd);
}

const targetTag = "#xxx";

const processAll = async function (page: puppeteer.Page, domainName: string) {
  const metainfo = await Promise.all([
    await outputPageAllDom(page, domainName),
    await getTargetTag(page, targetTag),
    await getScreenShot(page, domainName),
    await outputPageMetadata(page, domainName),
    await getTextFromPage(page, domainName),
  ]);
  return metainfo;
};

async function exec(site: TARGET): Promise<metainfo[]> {
  const { browser, page } = await mkBrowserAndPage();
  await pageConfig(page);

  // const response = await page.goto(site.url, { waitUntil: "networkidle2" });
  // "load" | "domcontentloaded" | "networkidle0" | "networkidle2" | LoadEvent[] | undefined'.
  const response = await page.goto(site.url, { waitUntil: "networkidle0" });
  console.log(response?.status());

  console.log(await page.metrics());

  // タグ取得
  const domainName: string = site.domain.replace(".", "_");
  const metainfo = await processAll(page, domainName);

  await browser.close();
  return metainfo[3];
}

const concurrentPromise = async <T>(
  promises: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> => {
  const results: T[] = [];
  let currentIndex = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const chunks = promises.slice(currentIndex, currentIndex + concurrency);
    if (chunks.length === 0) {
      break;
    }
    Array.prototype.push.apply(
      results,
      await Promise.all(chunks.map((c) => c()))
    );
    currentIndex += concurrency;
  }
  return results;
};

const main = async () => {
  const startTime = performance.now();
  console.log("main start");
  // main処理
  // const processAll = async function (targetSites: TARGET[]) {
  //   const x = await Promise.all([
  //     exec(targetSites[0]),
  //     exec(targetSites[1]),
  //     exec(targetSites[2]),
  //   ]);
  //   return x;
  // };
  // const re = await processAll(site.targets);
  // console.log(re);

  // 並列処理を調整して実行させる。
  const promises = site.targets.map((site) => exec.bind(null, site));
  await concurrentPromise(promises, 5);

  console.log("main end");
  const endTime = performance.now();
  console.log("time: ", endTime - startTime);
};

main();

interface metainfo {
  name: string | null;
  content: string | null;
  charset: string | null;
  httpEquiv: string | null;
  property: string | null;
}
