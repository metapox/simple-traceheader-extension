document.getElementById('save').addEventListener('click', function() {
  console.log('save clicked');
  var url = document.getElementById('url').value;
  chrome.storage.sync.set({'toolUrl': url}, function() {
    console.log('URL is ' + url);
  });
});
