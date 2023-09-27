function createTraceLinkList(toolUrl1, toolUrl2) {
  chrome.storage.local.get(function(data) {
    const traces = data['traceData'] || [];
    let linksDiv = document.getElementById('links');

    traces.forEach(function(trace) {
      const tr = document.createElement('tr');
      tr.classList.add("collection-item");

      const uritd = document.createElement('td');
      uritd.classList.add("truncate-text");
      const urip = document.createElement('p');
      urip.textContent = trace.url;
      uritd.appendChild(urip);
      tr.appendChild(uritd);

      const prodtd = document.createElement('td');
      prodtd.appendChild(createTraceLink('prod', toolUrl1, trace.headerValue.traceId));
      tr.appendChild(prodtd);

      const devtd = document.createElement('td');
      devtd.appendChild(createTraceLink('dev', toolUrl2, trace.headerValue.traceId));
      tr.appendChild(devtd);

      linksDiv.appendChild(tr);
    });
  });
}

function createTraceLink(linkName, toolUrl, traceId) {
  if(!toolUrl) {
    let ptag = document.createElement('p');
    ptag.textContent = linkName;
    return ptag
  } else {
    let link = document.createElement('a');
    link.href = toolUrl.replace('${traceparent}', traceId);
    link.textContent = linkName;
    link.target = "_blank";
    return link
  }
}

chrome.storage.sync.get(function(data) {
  createTraceLinkList(data['toolUrl1'], data['toolUrl2']);
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
