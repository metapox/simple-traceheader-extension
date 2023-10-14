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

class TraceStorage {
  constructor(maxEntries = 5) {
    this.maxEntries = maxEntries;
    this.data = [];

    chrome.storage.local.get(function(data) {
      this.data = data['traceData'] || [];
    });
  }

  async save(traceparent, url) {
    this.data.unshift({traceparent, url});
    if (this.data.length > this.maxEntries) {
      this.data.splice(this.maxEntries);
    }
    chrome.storage.local.set({'traceData': this.data});
    chrome.runtime.sendMessage({action: "changeTraceData", traceData: this.data});
  }
}

export { TraceStorage, TraceParent }
