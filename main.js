import { Telegraf } from "telegraf";
import fs from "fs";
// import { scrappingBCV } from "./utils/scrapping";

import { chromium } from "playwright-core";
// import { bold } from "telegraf/typings/format";

const scrappingBCV = async () => {
  const browser = await chromium.launch({
    headless: true,
  });
  const page = await browser.newPage();

  await page.goto("https://www.bcv.org.ve/", {
    timeout: 60000,
    waitUntil: "load",
  });

  await page.waitForSelector("#dolar");
  const element = await page.textContent("#dolar");
  let str = element.split("");
  str = str.filter((char) => char !== " ");
  str = str.filter((char) => char !== "\n");
  str = str.filter((char) => char !== "\t");
  str = str.join("");

  let title = str.substring(0, 3);
  let price = str.substring(3);
  const final = title + " " + price;

  await browser.close();
  return final;
};

const scrappingMonitor = async () => {
  const browser = await chromium.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto("https://dolartoday.com/", {
    waitUntil: "load",
    timeout: 100000,
  });
  await page.waitForSelector("#result");

  const value = await page.evaluate(() => {
    const input = document.querySelector("#result");
    return input.value;
  });

  await browser.close();
  return value;
};

const bot = new Telegraf("5820229721:AAEz0VaP2OjAQ188LWd-I4k03eoTF8raiA0");

bot.start((ctx) => {
  ctx.reply("Welcome to @bcv_price_bot \n\n Commands: \n /bcv \n /paralelo");
});

bot.command("help", (ctx) => {
  ctx.reply("Welcome to @bcv_price_bot \n\n Commands: \n /bcv \n /paralelo");
});

bot.command("bcv", async (ctx) => {
  ctx.reply("Haciendo scrapping...");
  const text = await scrappingBCV();
  ctx.reply(`✅ BCV CAMBIO \n BS. ${text}`);
});

bot.command("paralelo", async (ctx) => {
  ctx.reply("Haciendo scrapping...");
  const text = await scrappingMonitor();
  ctx.reply(`✅ DOLARTODAY CAMBIO \n ${text}`);
});

bot.launch();
console.log("Server running");

// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));
