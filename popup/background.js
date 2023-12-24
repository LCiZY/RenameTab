function setPageTitle(newTitle) {
    document.title = newTitle;
}

String.prototype.replaceAll = function (search, replacement) {
    const regex = new RegExp(search, 'g');
    return this.replace(regex, replacement);
};

chrome.runtime.onInstalled.addListener(function () {
    console.log('extension installed.');
    // 监听标签页更新事件
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        // 检查标题变化
        if (changeInfo.title) {
            // 根据规则更新标题
            updateTabTitle(tabId, tab.url)
        }
    });
});


function updateTabTitle(tabId, tabUrl){
    chrome.tabs.get(tabId, function (currentTab) {
        var srcTitle = currentTab.title
        var toTitle = currentTab.title

        chrome.storage.local.get('rule_cfg', function (result) {
            ruleCfg = JSON.parse(result['rule_cfg']);
            console.log('db rule_cfg=', result['rule_cfg'], 'json ruleCfg=', ruleCfg);

            if (ruleCfg['enable'] !== true) {
                console.log('enable=', ruleCfg['enable'])
                return
            }

            if (ruleCfg['rules']) {
                for (i = 0; i < ruleCfg['rules'].length; i++) {
                    const rule = ruleCfg['rules'][i]
                    var typeMatcher = ''
                    if (rule['type'] == 'title') {
                        typeMatcher = srcTitle
                    } else if (rule['type'] == 'link') {
                        typeMatcher = tabUrl
                    } else if (rule['type'] == 'domain') {
                        typeMatcher = getDomainFromLink(tabUrl)
                    } else if (rule['type'] == 'url') {
                        typeMatcher = getPathFromLink(tabUrl)
                    } else if (rule['type'] == 'query') {
                        typeMatcher = getQueryFromLink(tabUrl)
                    }
                    console.log('Rule-', i, 'typeMatcher=', typeMatcher, 'op=', rule['op'])
                    try {
                        const typePatternRegex = new RegExp(rule['type_pattern']);
                        if (!typePatternRegex.test(typeMatcher)) {
                            console.log('typeMatcher=', typeMatcher, 'not match', rule['type_pattern'])
                            continue
                        }
                    } catch (error) {
                        console.log('parse type_pattern failed', rule['type_pattern'], 'err', error)
                        continue
                    }
                    if (rule['op'] == 'replace') {
                        toTitle = toTitle.replaceAll(rule['title_pattern_to_replace'], rule['title_replacer']);
                    } else if (rule['op'] == 'prepend' || rule['op'] == 'append') {
                        try {
                            const titlePatternRegex = new RegExp(rule['title_pattern_to_replace']);
                            if (!titlePatternRegex.test(toTitle))
                                continue
                        } catch (error) {
                            console.log('parse title_pattern_to_replace failed', rule['title_pattern_to_replace'], 'err', error)
                            continue
                        }
                        if (rule['op'] == 'prepend'){
                            if(!toTitle.startsWith(rule['title_replacer']))
                                toTitle = rule['title_replacer'] + toTitle
                        }
                        if (rule['op'] == 'append') {
                            if(!toTitle.endsWith(rule['title_replacer']))
                                toTitle = toTitle + rule['title_replacer']
                        }
                    }
                }
            }


            console.log('tab_id=', tabId, 'from=', srcTitle, 'to=', toTitle);
            if (srcTitle == toTitle) {
                return
            }

            chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: setPageTitle,
                args: [toTitle]
            });

        });
    });
}


const domainRegex = /^(https?:\/\/[^/]+)/;
function getDomainFromLink(link) {
    const domainMatch = link.match(domainRegex);
    const domain = domainMatch ? domainMatch[1] : '';
    return domain;
}

const pathRegex = /^(https?:\/\/[^?#]+?)(\/[^?#]*)/;
function getPathFromLink(link) {
    const pathMatch = link.match(pathRegex);
    const path = pathMatch ? pathMatch[2] : '';
    return path;
}

const queryRegex = /\?(.*)/;
function getQueryFromLink(link) {
    const queryMatch = link.match(queryRegex);
    const query = queryMatch ? queryMatch[1] : '';
    return query;
}


setInterval(function() {
    // trigger all tabs to be renamed
    chrome.tabs.query({}, function(tabs) {
        for(i = 0; i < tabs.length; i++)
            updateTabTitle(tabs[i].id, tabs[i].url)
    });
  }, 3000);  //1000ms
  