import { TraceParent, TraceStorage } from './trace.js';

// set variables for the background process
let traceStorage = new TraceStorage();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.action === "startTraceRquest") {
    startTraceRquest(sender);
  }
})

async function startTraceRquest(sender) {
  const traceparent = new TraceParent();

  try {
    await setTraceParentRule(traceparent);
    chrome.tabs.reload(sender.tab.id);
    await traceStorage.save(traceparent, sender.tab.url);
    await removeTraceParentRule();
  } catch (e) {
    console.log(e);
  }
}

async function setTraceParentRule(traceparent) {
  await chrome.declarativeNetRequest.updateDynamicRules({
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
        urlFilter: "*://*/*",
        resourceTypes: ["main_frame"]
      }
    }]
  });
}

async function removeTraceParentRule() {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ["traceparent"]
  });
}
