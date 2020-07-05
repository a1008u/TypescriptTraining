declare module "~/src/puppeteer/json/url.json" {
  interface URL {
    targetUrl: string[];
  }

  export interface TARGETS {
    targets: TARGET[];
  }

  export interface TARGET {
    domain: string;
    url: string;
  }

  const targetSites: TARGETS;
  export default targetSites;
}
