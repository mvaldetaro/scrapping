const fs = require("fs");
//const puppeteer = require("puppeteer");
const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const moment = require("moment");
const _ = require("lodash");

puppeteer.use(pluginStealth());

const screenshot = async () => {
  const browser = await puppeteer.launch({ args: ["--start-maximized"] });
  const page = await browser.newPage();
  const url = "https://www.theenemy.com.br/";

  await page.goto(url);
  await page.screenshot({ path: "the_enemy_home.png" });
  await browser.close();
};

const generatePDF = async () => {
  const browser = await puppeteer.launch({ args: ["--start-maximized"] });
  const page = await browser.newPage();
  const url = "https://www.theenemy.com.br/";

  await page.goto(url);
  await page.pdf({ path: "the_enemy_home.pdf", format: "A4" });
  await browser.close();
};

function formatDate(pString) {
  console.log(pString);
  //   return pString.replace((match, p1, p2, p3, p4, p5, offset, string) => {
  //     console.log(p1, p2, p3, p4, p5);
  //     return pString;
  //   });
  return pString;
}

const scrapper = async () => {
  const browser = await puppeteer.launch({
    //headless: false,
    defaultViewport: { width: 1920, height: 1080 },
    args: ["--incognito"],
    // args: ["--desktop-window-1080p", "--start-maximized"],
  });
  const page = await browser.newPage();
  const url = "https://www.theenemy.com.br/news";
  await page.goto(url);

  const news = await page.evaluate(() => {
    let xNews = [
      ...document.querySelectorAll(".news-list--big > .news-list__item"),
    ];
    const xElements = xNews.map((pElem) => {
      const published_at = pElem
        .getElementsByClassName("news-list__item__content__info__time")[0]
        .innerHTML.replace(
          /(\d{2})\.(\d{2})\.(\d{4})\s(\d{2})H(\d{2})/gi,
          (match, p1, p2, p3, p4, p5, offset, string) => {
            return `${p3}-${p2}-${p1} ${p4}:${p5}`;
          }
        );

      return {
        title: pElem.getElementsByClassName(
          "news-list__item__content__title"
        )[0].innerHTML,
        image: {
          src: pElem.getElementsByTagName("img")[0].src,
        },
        link: pElem.getElementsByClassName("news-list__item__content__title")[0]
          .href,
        description: pElem.getElementsByClassName(
          "news-list__item__content__description"
        )[0].innerHTML,
        published_at: published_at,
        timestamp: new Date(published_at).getTime(),
      };
    });

    return xElements;
  });

  fs.writeFile("./data.json", JSON.stringify(news, null, 2), function (err) {
    if (err) throw err;
    console.log("Arquivo Gerado");
  });

  //await browser.close();
};

scrapper();
