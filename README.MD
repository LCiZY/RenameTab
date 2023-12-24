# 重命名标签Edge插件
V1: 可以根据一定的规则进行重命名操作，以下是配置模板：
```json
{
    "enable": true,
    "rules":[
        {
            "type": "link", // type: title, link, domain, url, query
            "type_pattern": "http://.*",

            "title_pattern_to_replace": "事件", 
            "title_replacer": "abc",
            "op":"replace" // replace, prepend, append
            // 如果"type"匹配type_pattern规则，则对title进行title_pattern_to_replace正则替换replacer进行op操作
        }
    ]
}
```
> 上述配置表示对`link`(网址链接)符合`type_pattern`正则表达式匹配的tab生效。将原tab标题匹配正则表达式`title_pattern_to_replace`的部分进行`op`操作，操作结果是`title_replacer`

---

V2: TODO