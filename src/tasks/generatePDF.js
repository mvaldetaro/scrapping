const generatePDF = async () => {
  const browser = await puppeteer.launch({ args: ["--start-maximized"] });
  const page = await browser.newPage();
  const url = "https://www.theenemy.com.br/";

  await page.goto(url);
  await page.pdf({ path: "the_enemy_home.pdf", format: "A4" });
  await browser.close();
};
