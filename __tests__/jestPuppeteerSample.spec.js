// 'page' は Page のインスタンスとして予め定義されているので、いきなり使ってよい
xtest('should display `google` text on page', async () => {
  page = await browser.newPage();
  await page.goto('https://google.com');
  await expect(page).toMatch('google');
});
