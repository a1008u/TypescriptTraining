import * as puppeteer from "puppeteer";
import * as site from "./json/site.json";
import { TARGET } from "~/src/puppeteer/json/url.json";
import * as fs from "fs";

const main = async () => {
  console.log("main start");
  // 事前準備
  // const browser = await puppeteer.launch({ headless: true });
  // const page = await browser.newPage();
  // await page.emulate(puppeteer.devices["iPhone X"]);

  // urlが動的になれば複数のサイトで利用できる。
  // const url = "https://tokyolucci.jp/";

  async function exec(site: TARGET): Promise<metainfo[]> {
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
    await page.emulate(puppeteer.devices["iPhone X"]);
    console.log(site.url);
    // const response = await page.goto(site.url, { waitUntil: "networkidle2" });
    // "load" | "domcontentloaded" | "networkidle0" | "networkidle2" | LoadEvent[] | undefined'.
    const response = await page.goto(site.url, { waitUntil: "networkidle0" });
    console.log(response?.status());

    // screenshot
    const name: string = site.domain.replace(".", "_");
    await page.screenshot({
      path: `./output/screenshot/${name}.png`,
      fullPage: true,
    });

    // タグ取得
    const targetTag = "#xxx";
    const item = await page.$(targetTag);
    if (item) {
      console.log(item);
      const data = await (await item.getProperty("src")).jsonValue();
      console.log("------ ", data);
    }

    // meta取得
    const result = await page.evaluate(() => {
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
    // console.log(result);

    console.log("main end");
    await browser.close();

    const jsonStringify = JSON.stringify(result);
    fs.writeFileSync(`./output/meta/${name}.json`, jsonStringify);

    return result;
  }

  const processAll = async function (targetSites: TARGET[]) {
    const x = await Promise.all([
      exec(targetSites[0]),
      exec(targetSites[1]),
      exec(targetSites[2]),
    ]);
    return x;
  };

  // main処理
  const re = await processAll(site.targets);
  console.log(re);

  // urls.targetUrl.forEach(async (url) => {
  // const browser = await puppeteer.launch({ headless: true });
  // const page = await browser.newPage();
  // await page.emulate(puppeteer.devices["iPhone X"]);
  // console.log(url);
  // const response = await page.goto(url, { waitUntil: "networkidle2" });
  // console.log(response?.status());
  // // タグ取得
  // const targetTag = "#xxx";
  // const item = await page.$(targetTag);
  // if (item) {
  //   console.log(item);
  //   const data = await (await item.getProperty("src")).jsonValue();
  //   console.log("------ ", data);
  // }
  // // meta取得
  // const result = await page.evaluate(() => {
  //   const results: metainfo[] = [];
  //   document.querySelectorAll("meta").forEach((meta: HTMLMetaElement) => {
  //     results.push({
  //       name: meta.getAttribute("name"),
  //       content: meta.getAttribute("content"),
  //       charset: meta.getAttribute("charset"),
  //       httpEquiv: meta.getAttribute("http-equiv"),
  //       property: meta.getAttribute("property"),
  //     });
  //   });
  //   return results;
  // });
  // console.log(result);
  // console.log("main end");
  // await browser.close();
  // });

  // タグ確認
  // const targetTag = "#xxx";
  // const item = await page.$(targetTag);
  // if (item) {
  //   console.log(item);
  //   const data = await (await item.getProperty("src")).jsonValue();
  //   console.log("------ ", data);
  // }

  // const result = await page.evaluate(() => {
  //   const x = document.querySelector('meta[name="description"]');
  //   if (x) {
  //     return [x.getAttribute("content")];
  //   }
  // });
  // if (result) {
  //   result.forEach((r) => console.log(r));
  // }
  // const result = await page.evaluate(() => {
  //   const results: metainfo[] = [];
  //   document.querySelectorAll("meta").forEach((meta: HTMLMetaElement) => {
  //     results.push({
  //       name: meta.getAttribute("name"),
  //       content: meta.getAttribute("content"),
  //       charset: meta.getAttribute("charset"),
  //       httpEquiv: meta.getAttribute("http-equiv"),
  //       property: meta.getAttribute("property"),
  //     });
  //   });
  //   return results;
  // });
  // console.log(result);
  // result.forEach((x) => console.log(x.getAttribute("content")));

  // metas.forEach(async (meta) => {
  //   console.log(meta);
  //   // console.log((await meta.getProperty("content")).jsonValue());
  // });

  // 実際のスクレイピング
  // const url = "https://google.com/";
  // await page.goto(url, { waitUntil: "networkidle0" });

  // await page.waitFor('input[name="q"]');
  // await page.type('input[name="q"]', "iphone");

  // await page.screenshot({ path: "home1.png" });

  // // await page.title() でも良い
  // // const title = await page.$eval("head > title", (e) => e.text);
  // const title = await page.title();
  // console.log("title is the ", title);

  // const cal: puppeteer.ElementHandle | null = await page.$("html");
  // if (cal) {
  //   (await cal.$$("div")).forEach((x) => console.log(x));
  // }

  // // console.log(cal);

  // console.log("main end");
  // await browser.close();
};

main();

interface metainfo {
  name: string | null;
  content: string | null;
  charset: string | null;
  httpEquiv: string | null;
  property: string | null;
}
