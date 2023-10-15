// set global variables
const TOOL_KEYS = ['prod', 'dev'];
let tools = [];

// list
// parameter traces = [{url, traceparent}]
// parameter tools = [{name, url}]
function updateList(traces, tools) {
  let links = document.getElementById('links');
  let innerHtml = '';
  traces.forEach(trace => {
    innerHtml += tr(trace, tools);
  });

  links.innerHTML = innerHtml;
}

// tr parts
// parameter trace = {url, traceparent}
// parameter tools = [{name, url}]
function tr(trace, tools) {
  innerHtml = `<tr class="collection-item">
    <td class="truncate-text"><p>${trace.url}</p></td>`
  TOOL_KEYS.forEach(key => {
    let tool = tools[key];
    if(tool == null) tool = {name: key, url: null};
    innerHtml += `<td>${traceLink(trace, tool)}</td>`
  });
  innerHtml += `</tr>`
  return innerHtml;
}

// trace link
// parameter trace = {url, traceparent}
// parameter tool = {name, url}
function traceLink(trace, tool) {
  let innerHtml;
  if(!tool.url) {
    innerHtml = `<p>${tool.name}</p>`;
  } else {
    innerHtml = `<a href="${tool.url.replace('${traceparent}', trace.traceparent.traceId)}" target="_blank">${tool.name}</a>`;
  }

  return innerHtml;
}

// set initial tracedata
chrome.storage.local.get(function(data) {
  const traces = data['traceData'] || [];
  chrome.storage.sync.get(function(data) {
    tools = data['tools'] || [];
    updateList(traces, tools);
  });
});

// set event listener for message
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.action === "changeTraceData") {
    updateList(message.traceData, tools);
  }
});

// button parts
document.addEventListener('DOMContentLoaded', function() {
  const switchButton = document.querySelector('input[type="checkbox"]');

  chrome.storage.sync.get('enabled', function(data) {
    switchButton.checked = data.enabled;
  });

  switchButton.addEventListener('change', function() {
    if (switchButton.checked) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let activeTab = tabs[0];
        chrome.runtime.sendMessage({action: "startTraceRquest", tab: activeTab});
      });
    }
    chrome.storage.sync.set({enabled: switchButton.checked});
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.action === "finishTraceRquest") {
      switchButton.checked = false;
      chrome.storage.sync.set({enabled: switchButton.checked});
    }
  });
});


// const switchButton = new SwitchButton();

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if(message.action === "finishTraceRquest") {
//     switchButton.disable();
//   }
// });

// class SwitchButton {
//   constructor(selector, onChange, onDisable) {
//     this.switchButton = selector;
//     chrome.storage.sync.get('enabled', function(data) {
//       this.switchButton.checked = data.enabled;
//     });
//     this.switchButton.addEventListener('change', this.onChange);
//   }

//   onChange() {
//     if (this.switchButton.checked) {
//       chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         chrome.runtime.sendMessage({action: "startTraceRquest", tab: tabs[0]});
//       });
//     }
//     chrome.storage.sync.set({enabled: this.switchButton.checked});
//   }

//   disable() {
//     this.switchButton.checked = false;
//   }
// }
