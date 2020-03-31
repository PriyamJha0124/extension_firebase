chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
  chrome.declarativeContent.onPageChanged.addRules([
    {
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostEquals: "relay.amazon.com" }
        })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }
  ]);
});
