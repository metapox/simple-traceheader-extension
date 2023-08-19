function createTraceLink(toolUrl) {
  chrome.storage.local.get(function(data) {
    const traces = data['traceData'] || [];
    let linksDiv = document.getElementById('links');
    console.log(linksDiv);

    traces.forEach(function(trace) {
      const tr = document.createElement('tr');
      tr.classList.add("collection-item");
      const uritd = document.createElement('td');
      uritd.textContent = trace.url;

      const traceparenttd = document.createElement('td');
      let a = document.createElement('a');
      a.href = toolUrl.replace('${traceparent}', trace.headerValue.traceId); // Assuming each traceparent is a URL
      a.classList.add("collection-item");
      a.textContent = 'prod';
      a.target = "_blank";
      traceparenttd.appendChild(a);
      tr.appendChild(uritd);
      tr.appendChild(traceparenttd);

      linksDiv.appendChild(tr);
    });
  });
}
chrome.storage.sync.get('toolUrl', function(data) {
  createTraceLink(data['toolUrl']);
});

document.addEventListener('DOMContentLoaded', function() {
  const switchButton = document.querySelector('input[type="checkbox"]');
  chrome.storage.sync.get('enabled', function(data) {
    switchButton.checked = data.enabled;
  });

  switchButton.addEventListener('change', function() {
    if (switchButton.checked) {
      chrome.runtime.sendMessage({action: "startBackgroundProcess"});
      chrome.browserAction.setIcon({path: "img/on_icon.png"});
    } else {
      chrome.runtime.sendMessage({action: "stopBackgroundProcess"});
      chrome.browserAction.setIcon({path: "img/off_icon.png"});
    }
    chrome.storage.sync.set({enabled: switchButton.checked});
  });
});
