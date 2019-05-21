function getGithubPage(url) {}
var debugMode = true;
loadPage("GET", "js/repos.html", false) //Real link - https://github.com/NalinKamboj?tab=repositories
  .then(function(response) {
    if (debugMode) {
      console.log("GH PAGE RECEIVED");
    }
    ghDoc = new DOMParser().parseFromString(response, "text/html");
    if (debugMode) {
      console.log("[INFO] GH Repo Document - ");
      console.log(ghDoc);
    }
    return ghDoc;
  })
  .then(function(doc) {
    getRepoDetails(doc);
  })
  .then(function(data) {
    addRepos(data);
  })
  .catch(function(err) {
    console.error("Some error occurred.", err.statusText);
  });

function getRepoDetails(doc) {
  const repos = doc.getElementById("user-repositories-list");
  if (debugMode) {
    console.log("[INFO] Repositories list - ");
    console.log(repos);
  }

  //Get repository names
  var repoNameList = [];
  for (let item of repos.getElementsByTagName("h3")) {
    if (debugMode) {
      console.log("[INFO] Repo Name - " + item.textContent.trim());
    }
    repoNameList.push(item.textContent.trim());
  }

  //Get repository descriptions
  var repoDescList = [];
  for (let item of repos.getElementsByTagName("p")) {
    if (debugMode) {
      console.log("[INFO] Repo Desc - " + item.textContent.trim());
      // console.log(item.textContent);
    }
    repoDescList.push(item.textContent.trim());
  }
  // Get repository URLs
  var repoLinkList = [];
  for (let item of repos.getElementsByTagName("a")) {
    if (debugMode) {
      console.log("[INFO] Repo URL - " + item.href);
    }
    repoLinkList.push(item.href);
  }

  return {
    names: repoNameList,
    descriptions: repoDescList,
    links: repoLinkList
  };
}

//Function for adding GH data to the actual portfolio page
function addRepos(data) {}

// AJAX HTTP Page loader
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
