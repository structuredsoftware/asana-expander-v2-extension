import browser from "webextension-polyfill";

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab): void => {
    if (changeInfo.title !== undefined) {
        if (!tab.url || !tab.url.includes('asana.com')) {
            return;
        }

        browser.tabs
            .sendMessage(tabId, {
                message: 'url-changed',
                url: tab.url,
            })
            .catch(() => undefined);
    }
});
