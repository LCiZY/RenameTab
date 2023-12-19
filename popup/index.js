const textarea = document.getElementById('myTextarea');

function isJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  }

function handleInput(event) {
    const textareaValue = event.target.value;
    console.log('文本框内容变化：', textareaValue);
    if(isJSON(textareaValue)) {
        chrome.storage.local.set({ 'url_2_rules': textareaValue }, function() {
            console.log('规则已写入到本地存储');
        });
    }
}

function setTextareaContent() {
    chrome.storage.local.get('url_2_rules', function(result) {
        console.log('url_2_rules=', result['url_2_rules']);
        textarea.value = result['url_2_rules'];
    });
}


setTextareaContent()

textarea.addEventListener('input', handleInput);