const SELECTORS = {
  GOOGLE: {
    SEARCH_INPUT: 'input[name="q"]',
    SEARCH_BUTTON: 'input[type="submit"][name="btnK"][value*="Google"]',
    RESULT_ITEM: 'a[href*="webdriverio-v5-released"]'
  },
  WEBDRIVER_IO: {
    ANCHOR: "#how-to-upgrade-to-v5",
    GO_TOP_BUTTON: "#back-to-top"
  }
};

const memo = {
  spec: 0,
  suite: 0,
  tag: 0
};

async function createTag(browser: WebdriverIOAsync.BrowserObject) {
  // ブラウザから言語情報を取得
  const langs: string[] = await browser.executeAsync(function(done) {
    done(window.navigator.languages);
  });
  const labelLang = langs.map(v => v.split(";")[0].replace("-", "")).join("_");
  return function tag(key: string = "") {
    const value = [
      [memo.suite, memo.spec, memo.tag].join("_"),
      key,
      labelLang
    ].join("-");
    memo.tag++;
    return value;
  };
}

afterAll(() => {
  memo.spec = 0;
  memo.suite++;
});

afterEach(() => {
  memo.spec++;
  memo.tag = 0;
});

describe("Searchable WebdriverIO V5 released article", () => {
  it("can search on Google", async () => {
    // TODO: TSの型を定義する
    const browserA: any = browser;

    await browser.url("https://www.google.com");
    const elem = await $(SELECTORS.GOOGLE.SEARCH_INPUT);
    await elem.waitForExist();
    const tag = await createTag(browser);

    await elem.setValue("WebdriverIO V5 released");

    const searchBtn = await $(SELECTORS.GOOGLE.SEARCH_BUTTON);
    await searchBtn.waitForDisplayed(); // wait for suggestion

    await searchBtn.click();
    await (await $(SELECTORS.GOOGLE.RESULT_ITEM)).click();

    // show blog article is WebdriverIO V5 released
    const anchor = await $(SELECTORS.WEBDRIVER_IO.ANCHOR);
    await anchor.waitForExist();
    await anchor.scrollIntoView();

    const goTopBtn = await $(SELECTORS.WEBDRIVER_IO.GO_TOP_BUTTON);
    await goTopBtn.waitForDisplayed();
    const opts = { hideElements: [goTopBtn] };
    expect(
      await browserA.checkScreen(tag("HowToUpgradeToV5"), opts)
    ).toBeLessThan(0.1);
  });

  it("headers", async () => {
    const browserA: any = browser;
    await browser.url("https://httpbin.org/headers");
    const tag = await createTag(browser);
    await browserA.checkScreen(tag("headers"));
  });
});
