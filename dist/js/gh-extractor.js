function getGithubPage(url) {}

loadPage("GET", "https://github.com/NalinKamboj?tab=repositories", true)
  .then(function(response) {
    console.log("REQUEST COMPLETE!");
    // var name = JSON.parse(response);
    console.log(response);
  })
  .catch(function(err) {
    console.error("Some error occurred.", err.statusText);
  });

function loadPage(method, url, useproxy = false) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    if (useproxy) {
      url = proxyurl + url;
      console.log("[INFO] " + url);
    }

    xhr.open(method, url);
    // console.log("XHR ");
    // console.log(xhr);
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: this.statusText
        });
      }
    };
    xhr.onerror = function() {
      reject({
        status: this.status,
        statusText: this.statusText
      });
    };
    xhr.send();
  });
}
