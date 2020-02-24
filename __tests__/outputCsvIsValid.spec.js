const path = require('path');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const targetHTMLFilePath =
  'file://' +
  path.resolve(__dirname, './dmm_mobile_data_traffic_info_sample.html');
const outputCSVFilePath = path.resolve(
  __dirname,
  './dmm_mobile_data_traffic_result.csv'
);
let eachDayRowSelector;
let targetTrElements;
let resultDataArray = [];
let lines = [];
let targetRecords = [];

describe('出力されるファイルがCSVのフォーマットに則っていること', () => {
  // 'beforeEach' にすると CSV ファイルに追記されてしまうので注意する
  beforeAll(async () => {
    await page.goto(targetHTMLFilePath);

    eachDayRowSelector =
      'body > section > div > section.area-right > section.box-recentCharge > div > table > tbody > tr';
    targetTrElements = await page.$$(eachDayRowSelector);
    targetTdElements = await targetTrElements[0].$$('td');

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

    // CSVファイルがすでに存在していた場合は削除する
    // https://github.com/ryu1kn/csv-writer/issues/26
    if (await fs.existsSync(outputCSVFilePath)) {
      await fs.unlinkSync(outputCSVFilePath);
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
    await csvWriter.writeRecords(targetRecords);
    const text = await fs.readFileSync(outputCSVFilePath, 'utf8');
    lines = text.toString().split('\n');
  });

  // TODO: ちゃんと調べるためには http://csvlint.io/documentation を使うなどした方がよい
  it('1行目のヘッダが「日付,高速データ通信量,低速データ通信量,SNSフリー通信量」となっていること', async () => {
    await expect(lines[0]).toMatch(
      /^日付,高速データ通信量,低速データ通信量,SNSフリー通信量$/
    );
  });

  it('31行目（30日目）の内容が期待通りに記録されていること', async () => {
    await expect(lines[30]).toMatch(
      /^[2][0-9]{3}\/[0-1][1-9]\/[0-3][0-9],[0-9]+MB,[0-9]+MB,([0-9]+MB)|未契約$/
    );
  });

  it('32行目は空行であること', async () => {
    await expect(lines[31]).toMatch(/^$/);
  });

  it('33行目は存在しないこと', async () => {
    await expect(lines[32]).toBeUndefined();
  });
});
