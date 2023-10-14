import { TraceParent, TraceStorage } from './trace.js';

// set global variables for the background process
let traceStorage = new TraceStorage();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.action === "startTraceRquest") {
    startTraceRquest(message.tab);
  }
});

async function startTraceRquest(tab) {
  const traceparent = new TraceParent();
  await removeTraceParentRule();
  await setTraceParentRule(traceparent);
  chrome.tabs.reload(tab.id);
  await traceStorage.save(traceparent, tab.url);
  await removeTraceParentRule();
  await sleep(600);
  await sendFinishMessage();
}

async function setTraceParentRule(traceparent) {
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [{
      id: 100231,
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
    removeRuleIds: [100231]
  });
}

async function sendFinishMessage() {
  chrome.runtime.sendMessage({action: "finishTraceRquest"});
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};
