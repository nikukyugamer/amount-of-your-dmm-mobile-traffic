require('dotenv').config();
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.16 Safari/537.36')

  await page.goto('https://mvno.dmm.com/mypage/-/datatraffic/');
  await page.waitFor(1000);

  await page.type('#login_id', process.env.DMM_USERNAME, {delay: 1000});
  await page.type('#password', process.env.DMM_PASSWORD, {delay: 1000});
  await page.click('#loginbutton_script_on > span > input[type=submit]')

  await page.waitFor(5000);

  await page.screenshot( {
    path: path.resolve(__dirname, '../logs/dmm_mobile_data_traffic_info_debug.png'),
    fullPage: true
  });

  await browser.close();
})();
