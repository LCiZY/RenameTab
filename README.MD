```json
{
    "enable": true,
    "rules":[
        {
            "type": "title", // type: title, link, domain, url, query
            "type_pattern": "http://.*",

            "title_pattern_to_replace": "事件", 
            "title_replacer": "abc",
            "op":"replace" // replace, prepend, append
            // 如果"type"匹配type_pattern规则，则对title进行title_pattern_to_replace正则替换replacer进行op操作
        }
    ]
}
```