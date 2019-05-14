function getGithubPage(url) {}
var debugMode = true;
loadPage("GET", "https://github.com/NalinKamboj?tab=repositories", true)
  .then(function(response) {
    if (debugMode) {
      console.log("GH PAGE RECEIVED");
    }
    ghDoc = new DOMParser().parseFromString(response, "text/html");
    if (debugMode) {
      console.log(ghDoc);
    }

    return ghDoc;
  })
  .then(function(doc) {
    addItems(doc);
  })
  .catch(function(err) {
    console.error("Some error occurred.", err.statusText);
  });

function addItems(doc) {
  const repoList = doc.getElementById("user-repositories-list");
  console.log(repoList);

  //ADD CODE HERE....
}

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
