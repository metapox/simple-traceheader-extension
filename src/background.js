import crypto from 'crypto'

class TraceParent {
  constructor() {
    this.version = Buffer.alloc(1).toString('hex')
    this.traceId = crypto.randomBytes(16).toString('hex')
    this.id = crypto.randomBytes(8).toString('hex')
    this.flags = '01'
  }

  toString() {
    return `${this.version}-${this.traceId}-${this.id}-${this.flags}`
  }
}

const headerValues = new Map();
const traceData = [];
const maxEntries = 5;  // Adjust this to your needs

function handleBeforeSendHeaders(details) {
  if (details.type === 'main_frame') {
    const headerValue = new TraceParent;
    headerValues.set(details.tabId, headerValue);
    saveTraceData(traceData, headerValue, details.url);
  }

  // Set the header for child requests
  const storedHeaderValue = headerValues.get(details.tabId);
  if (storedHeaderValue) {
    details.requestHeaders.push({
      name: 'traceparent',
      value: storedHeaderValue.toString()
    });

    return {requestHeaders: details.requestHeaders};
  }
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "startBackgroundProcess") {
    chrome.webRequest.onBeforeSendHeaders.addListener(
      handleBeforeSendHeaders,
      {urls: ['<all_urls>']},
      ['blocking', 'requestHeaders']
    );
  } else if (message.action === "stopBackgroundProcess") {
    console.log('stopBackgroundProcess');
    chrome.webRequest.onBeforeSendHeaders.removeListener(handleBeforeSendHeaders);
  }
});

async function saveTraceData(traceData, headerValue, url) {
  // Save the traceData to storage
  // TODO計算量を考えて実装する多分いまO(n)
  // どこでソートすべきかも考える
  traceData.unshift({headerValue, url});
  if (traceData.length > maxEntries) {
    traceData.splice(maxEntries);
  }
  chrome.storage.local.set({'traceData': traceData});
}
