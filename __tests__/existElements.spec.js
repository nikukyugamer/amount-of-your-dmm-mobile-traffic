const path = require('path');
const filePath =
  'file://' +
  path.resolve(__dirname, './dmm_mobile_data_traffic_info_sample.html');
let eachDayRowSelector;
let targetTrElements;
// let targetCells = [];
let resultDataArray = [];

describe('要素が存在するかどうかのテスト', () => {
  beforeEach(async () => {
    await page.goto(filePath);

    eachDayRowSelector =
      'body > section > div > section.area-right > section.box-recentCharge > div > table > tbody > tr';
    targetTrElements = await page.$$(eachDayRowSelector);
    targetTdElements = await targetTrElements[0].$$('td');
  });

  // 「月」の単位ではなく、直近30日分のデータが存在する
  it('対象となる <tr> が 30個（30行）存在すること', async () => {
    await expect(targetTrElements.length).toEqual(30);
  });

  it('対象となる <td> が 4つ（4列）存在すること', async () => {
    await expect(targetTdElements.length).toEqual(4);
  });

  it('結果のデータが二重配列に格納されており、その順序が「日付」「高速データ通信量」「低速データ通信量」「SNSフリー通信量」になっていること', async () => {
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

    await expect(resultDataArray.length).toEqual(30);
    await expect(resultDataArray[0].length).toEqual(4);

    // 「日付」「高速データ通信量」「低速データ通信量」「SNSフリー通信量」
    await expect(resultDataArray[0][0]).toMatch(
      /^[2][0-9]{3}\/[0-1][1-9]\/[0-3][0-9]/
    );
    await expect(resultDataArray[0][1]).toMatch(/[0-9]+MB/);
    await expect(resultDataArray[0][2]).toMatch(/[0-9]+MB/);
    await expect(resultDataArray[0][3]).toMatch(/([0-9]+MB)|未契約/);
  });
});
