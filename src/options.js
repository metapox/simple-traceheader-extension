const prodUrl = document.getElementById('prod-url-label');
chrome.storage.sync.get('toolUrl1', function(data) {
  prodUrl.textContent = `URL: ${data['toolUrl1']}`;
});

document.getElementById('prod-save').addEventListener('click', function() {
  const url = document.getElementById('prod-url').value;
  chrome.storage.sync.set({'toolUrl1': url}, function() {
    console.log('URL is ' + url);
  });
});

const devUrl = document.getElementById('dev-url-label');
chrome.storage.sync.get('toolUrl2', function(data) {
  devUrl.textContent = `URL: ${data['toolUrl2']}`;
});

document.getElementById('dev-save').addEventListener('click', function() {
  const url = document.getElementById('dev-url').value;
  chrome.storage.sync.set({'toolUrl2': url}, function() {
    console.log('URL is ' + url);
  });
});
