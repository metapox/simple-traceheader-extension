import { Trace } from './trace.js';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.action === "startTraceRquest") {
    setTraceParent();
  }
})

// traceparentの更新して、ルールを更新する
function setTraceParent() {
  const traceparent = new Trace();
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ["traceparent"],
    addRules: [{
      id: "traceparent",
      priority: 1,
      action: {
        type: "modifyHeaders",
        requestHeaders: [{
          header: "traceparent",
          operation: "set",
          value: traceparent.toString()
        }]
      },
      condition: {
        urlFilter: "<all_urls>",
        resourceTypes: ["main_frame"]
      }
    }]
  });
}
