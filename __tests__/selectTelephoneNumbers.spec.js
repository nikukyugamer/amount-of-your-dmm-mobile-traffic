const path = require('path');
const filePath =
  'file://' +
  path.resolve(__dirname, './dmm_mobile_data_traffic_info_sample.html');
let targetOptions;

describe('電話番号を正しく選べているかどうかのテスト', () => {
  beforeEach(async () => {
    await page.goto(filePath);

    const targetOptionElement = '#fn-number > option';
    targetOptions = await page.$$(targetOptionElement);
  });

  it('1つ目の option が選べること (070-1111-2222)', async () => {
    const targetValue = await (await targetOptions[0].getProperty('value')) // 'value' はランダムな値（他も同様）
      .jsonValue();

    let resultObject;
    try {
      resultObject = await page.select('#fn-number', targetValue.trim());
    } catch (error) {
      resultObject = error;
    }

    // not.toEqual([Error: No node found for selector: #fn-numdber])
    await expect(resultObject).toEqual([targetValue.trim()]);
  });

  it('1つ目の option の電話番号が 070-1111-2222 であること', async () => {
    const targetTelephoneNumber = await (
      await targetOptions[0].getProperty('textContent')
    ).jsonValue();
    await expect(targetTelephoneNumber.trim()).toEqual('070-1111-2222');
  });

  it('2つ目の option が選べること (070-3333-4444)', async () => {
    const targetValue = await (await targetOptions[1].getProperty('value')) // 'value' はランダムな値（他も同様）
      .jsonValue();

    let resultObject;
    try {
      resultObject = await page.select('#fn-number', targetValue.trim());
    } catch (error) {
      resultObject = error;
    }

    // not.toEqual([Error: No node found for selector: #fn-numdber])
    await expect(resultObject).toEqual([targetValue.trim()]);
  });

  it('2つ目の option の電話番号が 070-3333-4444 であること', async () => {
    const targetTelephoneNumber = await (
      await targetOptions[1].getProperty('textContent')
    ).jsonValue();
    await expect(targetTelephoneNumber.trim()).toEqual('070-3333-4444');
  });

  it('3つ目の option が選べること (070-5555-6666)', async () => {
    const targetValue = await (await targetOptions[2].getProperty('value')) // 'value' はランダムな値（他も同様）
      .jsonValue();

    let resultObject;
    try {
      resultObject = await page.select('#fn-number', targetValue.trim());
    } catch (error) {
      resultObject = error;
    }

    // not.toEqual([Error: No node found for selector: #fn-numdber])
    await expect(resultObject).toEqual([targetValue.trim()]);
  });

  it('2つ目の option の電話番号が 070-5555-6666 であること', async () => {
    const targetTelephoneNumber = await (
      await targetOptions[2].getProperty('textContent')
    ).jsonValue();
    await expect(targetTelephoneNumber.trim()).toEqual('070-5555-6666');
  });
});
