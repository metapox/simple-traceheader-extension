function createTraceLink(toolUrl) {
  chrome.storage.local.get(function(data) {
    console.log(data);
    const traces = data['traceData'];
    let linksDiv = document.getElementById('links');

    traces.forEach(function(trace) {
      let a = document.createElement('a');
      a.href = toolUrl.replace('${traceparent}', trace.headerValue.traceId); // Assuming each traceparent is a URL
      console.log(trace.headerValue.traceId);
      a.textContent = trace.url;
      a.target = "_blank"
      linksDiv.appendChild(a);
      linksDiv.appendChild(document.createElement('br')); // Add a line break after each link
    });
  });
}
chrome.storage.sync.get('toolUrl', function(data) {
  createTraceLink(data['toolUrl']);
});

