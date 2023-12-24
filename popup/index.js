const textarea = document.getElementById('myTextarea');

function isJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      console.error('invalid json str', str)
      return false;
    }
}

function handleRuleChange(event) {
    const textareaValue = event.target.value;
    console.log('rule changed: ', textareaValue);
    if(isJSON(textareaValue)) {
        // write to local storage
        chrome.storage.local.set({ 'rule_cfg': textareaValue }, function() {
            console.log('rule_cfg set');
        });

    }
}

function setTextareaContent() {
    chrome.storage.local.get('rule_cfg', function(result) {
        console.log('loaded rule_cfg=', result['rule_cfg']);
        textarea.value = result['rule_cfg'];
    });
}


setTextareaContent()

textarea.addEventListener('input', handleRuleChange);