import { TraceParent, TraceStorage, TraceRuleManager } from './trace.js';

// set global variables for the background process
let traceStorage = new TraceStorage();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.action === "startTraceRquest") {
    startTraceRquest(message.tab);
  }
});

async function startTraceRquest(tab) {
  const traceparent = new TraceParent();

  await TraceRuleManager.enable(traceparent);
  chrome.tabs.reload(tab.id);
  await TraceRuleManager.disable();

  await traceStorage.save(traceparent, tab.url);
  await sleep(600); // wait for reload switch user experience
  await sendFinishMessage();
}

async function sendFinishMessage() {
  chrome.runtime.sendMessage({action: "finishTraceRquest"});
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};
