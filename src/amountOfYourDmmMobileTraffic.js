require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = dmmMobileClient = async ordinalNumberOfTelephoneNumber => {
  // TODO: ユーザ名とパスワードが設定されていなかった場合、例外を吐いて止める

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.16 Safari/537.36'
  );

  await page.goto('https://mvno.dmm.com/mypage/-/datatraffic/');
  await page.waitFor(5000);

  await page.type('#login_id', process.env.DMM_USERNAME, { delay: 1000 });
  await page.type('#password', process.env.DMM_PASSWORD, { delay: 1000 });
  await page.click('#loginbutton_script_on > span > input[type=submit]');

  await page.waitFor(5000);

  const targetOptionElement = '#fn-number > option';
  targetOptions = await page.$$(targetOptionElement);

  const targetValue = await (
    await targetOptions[ordinalNumberOfTelephoneNumber - 1].getProperty('value')
  ).jsonValue();
  await page.select('#fn-number', targetValue.trim());

  // TODO: 待ちすぎ
  await page.waitFor(10000);

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

  // CSVファイルがすでに存在していた場合は削除する
  // https://github.com/ryu1kn/csv-writer/issues/26
  // '__dirname' で 'outputCSVFilePath' を指定すると、CLI の実行時にうまくいかない
  const outputCSVFilePath = './amount_of_dmm_mobile.csv';
  if (fs.existsSync(outputCSVFilePath)) {
    fs.unlinkSync(outputCSVFilePath);
  }

  const csvWriter = createCsvWriter({
    path: outputCSVFilePath,
    header: [
      { id: 'date', title: '日付' },
      { id: 'amountOfFastDataTraffic', title: '高速データ通信量' },
      { id: 'amountOfSlowDataTraffic', title: '低速データ通信量' },
      { id: 'amountOfSNSFreeTraffic', title: 'SNSフリー通信量' }
    ]
  });

  let targetRecords = [];
  let eachRecordObject = {};
  for (let m = 0; m < resultDataArray.length; m++) {
    eachRecordObject = {
      date: resultDataArray[m][0],
      amountOfFastDataTraffic: resultDataArray[m][1],
      amountOfSlowDataTraffic: resultDataArray[m][2],
      amountOfSNSFreeTraffic: resultDataArray[m][3]
    };

    targetRecords.push(eachRecordObject);
  }

  await csvWriter.writeRecords(targetRecords);

  // スクリーンショットによるデバッグ
  // await page.screenshot({
  //   path: './dmm_mobile_data_traffic_info_debug.png',
  //   fullPage: true
  // });

  await browser.close();
};
