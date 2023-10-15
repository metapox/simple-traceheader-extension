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

    chrome.storage.local.get((data) => {
      this.data = data['traceData'] || [];
    });
  }

  async save(traceparent, url) {
    this.data.unshift({traceparent, url});
    if (this.data.length > this.maxEntries) {
      this.data.splice(this.maxEntries);
    }
    await chrome.storage.local.set({'traceData': this.data});
    await chrome.runtime.sendMessage({action: "changeTraceData", traceData: this.data});
  }
}

class TraceRuleManager {
  static async enable(traceparent) {
    await this.disable();
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [{
        id: this.ruleId(),
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

  static async disable() {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [this.ruleId()]
    });
  }

  static ruleId() {
    return 100231;
  }
}

export { TraceStorage, TraceParent, TraceRuleManager }
