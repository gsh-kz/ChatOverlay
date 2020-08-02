
chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
  if (tab.url == undefined) {
    return;
  }
  if (info.status === 'complete' && tab.url.indexOf('https://www.youtube.com/watch?') !== -1) {
    chrome.tabs.executeScript(null, { file: './js/content.js' }, () => {});
  }
});
