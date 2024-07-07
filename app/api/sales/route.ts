import puppeteer, { Page } from "puppeteer";

export async function GET(req: Request) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("http://syunnoeki.xsrv.jp/login.html");
  await page.type("input[name='id']", "01400");
  await page.type("input[name='pw']", "8275");
  await pageTransition(page, "input[value=' 認証 ']");
  await pageTransition(page, "input[value='年間の商品売上']");
  const tableHandle = await page.$("table[id='ls']");
  const html = await page.evaluate((body) => body?.innerText, tableHandle);
  const rows: string[] | undefined = html?.split("\n");
  const data: string[][] | undefined = rows?.map((item) => item.split("\t"));
  await page.close();
  return Response.json(data);
}

const pageTransition = async (page: Page, selector: string) => {
  await Promise.all([page.waitForNavigation(), page.click(selector)]);
};
