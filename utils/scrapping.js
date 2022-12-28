import { chromium } from "playwright-core";

const scrappingBCV = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.goto("https://www.bcv.org.ve/");

  const data = await page.evaluate(() => {
    const element = document.querySelector("#dolar>field-content");

    return element;
  });

  console.log(data);
};

module.exports = {
  scrappingBCV,
};
