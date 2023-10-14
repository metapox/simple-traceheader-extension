document.addEventListener("DOMContentLoaded", function() {
  chrome.storage.sync.get(function(data) {
    const tools = data['tools'] || {};

    for (let key in tools) {
      const tool = tools[key];
      document.getElementById(`${tool.name}-current`).textContent = tool.url;
    }
  });

  const forms = document.querySelectorAll(".toolForm");
  forms.forEach((form) => {
    form.addEventListener("submit", toolFormAction);
  });
});

function toolFormAction(e) {
  e.preventDefault();

  const name = this.id;
  const url = document.getElementById(`${name}-url`).value;
  const tool = {
    name: name,
    url: url
  };

  chrome.storage.sync.get(function(data) {
    const tools = data['tools'] || {};
    tools[name]= tool;
    chrome.storage.sync.set({'tools': tools});
  });

  document.getElementById(`${name}-current`).textContent = url;
  this.reset();
}
