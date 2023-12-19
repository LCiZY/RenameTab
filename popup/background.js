function setPageTitle(newTitle) {
    document.title = newTitle;
}
  
String.prototype.replaceAll = function(search, replacement) {
    const regex = new RegExp(search, 'g');
    return this.replace(regex, replacement);
  };
  
chrome.runtime.onInstalled.addListener(function() {
    console.log('extension installed.');
    // 监听标签页更新事件
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        // 检查标题变化
        if (changeInfo.title) {
            // 获取当前标签页的标题
            chrome.tabs.get(tabId, function(currentTab) {
                const tabUrl = tab.url;
                var srcTitle = currentTab.title
                var toTitle = currentTab.title
                var rule = {}
 
                chrome.storage.local.get('url_2_rules', function(result) {
                    rule = JSON.parse(result['url_2_rules']);
                    console.log('url_2_rules=', result['url_2_rules'], 'rule=', rule);

                    for (const urlPattern in rule) {
                        if(urlPattern != '*') {
                            try {
                                const regex = new RegExp(urlPattern);
                                if(!regex.test(tabUrl)) {
                                    continue
                                }
                            } catch (error) {
                                continue
                            }
                        }

                        if (typeof rule[urlPattern] === 'object') {
                            for (const regexp in rule[urlPattern]) {
                                var replacer = rule[urlPattern][regexp]
                                toTitle = toTitle.replaceAll(regexp, replacer);
                            }
                        } else {
                          console.log(`invalid Key: ${urlPattern}, Value: ${rule[urlPattern]}`);
                        }
                    }
    
                    console.log('tab_id=', tabId, 'from=',srcTitle, 'to=', toTitle);
    
                    chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        function: setPageTitle,
                        args: [toTitle]
                    });

                });
            });
        }
    });
});