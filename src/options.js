const url = document.getElementById('url-label');
chrome.storage.sync.get('toolUrl', function(data) {
  url.textContent = `URL: ${data['toolUrl']}`;
});

document.getElementById('save').addEventListener('click', function() {
  const url = document.getElementById('url').value;
  chrome.storage.sync.set({'toolUrl': url}, function() {
    console.log('URL is ' + url);
  });
});
