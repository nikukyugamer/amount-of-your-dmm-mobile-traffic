require('dotenv').config();
const puppeteer = require('puppeteer');
const path = require('path');

const dmmMobileClient = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.16 Safari/537.36'
  );

  await page.goto('https://mvno.dmm.com/mypage/-/datatraffic/');
  await page.waitFor(1000);

  await page.type('#login_id', process.env.DMM_USERNAME, { delay: 1000 });
  await page.type('#password', process.env.DMM_PASSWORD, { delay: 1000 });
  await page.click('#loginbutton_script_on > span > input[type=submit]');

  await page.waitFor(3000);

  const eachDayRowSelector =
    'body > section > div > section.area-right > section.box-recentCharge > div > table > tbody > tr';
  const targetTrElements = await page.$$(eachDayRowSelector);
  const resultDataArray = [];

  // Promise で forEach は使えない
  for (let i = 0; i < targetTrElements.length; i++) {
    const targetTdElements = await targetTrElements[i].$$('td');
    const eachRowDataArray = [];

    for (let j = 0; j < targetTdElements.length; j++) {
      const cellData = await (
        await targetTdElements[j].getProperty('textContent')
      ).jsonValue();

      eachRowDataArray.push(cellData.trim());
    }
    resultDataArray.push(eachRowDataArray);
  }

  // Printデバッグ
  // console.log(resultDataArray.length);

  // TODO: CSV出力

  // スクリーンショットによるデバッグ
  // await page.screenshot({
  //   path: path.resolve(
  //     __dirname,
  //     '../logs/dmm_mobile_data_traffic_info_debug.png'
  //   ),
  //   fullPage: true
  // });

  await browser.close();
};

// dmmMobileClient();
