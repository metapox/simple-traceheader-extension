function createTraceLink(toolUrl1, toolUrl2) {
  chrome.storage.local.get(function(data) {
    const traces = data['traceData'] || [];
    let linksDiv = document.getElementById('links');
    console.log(linksDiv);

    traces.forEach(function(trace) {
      const tr = document.createElement('tr');
      tr.classList.add("collection-item");
      const uritd = document.createElement('td');
      uritd.textContent = trace.url;
      tr.appendChild(uritd);

      const prodtd = document.createElement('td');
      let proda = document.createElement('a');
      proda.href = toolUrl1.replace('${traceparent}', trace.headerValue.traceId); // Assuming each traceparent is a URL
      proda.textContent = 'prod';
      proda.target = "_blank";
      prodtd.appendChild(proda);
      tr.appendChild(prodtd);

      const devtd = document.createElement('td');
      let deva = document.createElement('a');
      deva.href = toolUrl2.replace('${traceparent}', trace.headerValue.traceId); // Assuming each traceparent is a URL
      deva.textContent = 'dev';
      deva.target = "_blank";
      devtd.appendChild(deva);
      tr.appendChild(devtd);

      linksDiv.appendChild(tr);
    });
  });
}
chrome.storage.sync.get(function(data) {
  console.log(data);
  createTraceLink(data['toolUrl1'], data['toolUrl2']);
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
