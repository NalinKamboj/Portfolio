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
    var repoDetails = getRepoDetails(doc);
    return repoDetails;
  })
  .then(function(data) {
    addRepos(data);
  })
  .catch(function(err) {
    console.error("Some error occurred.", err.statusText);
  });

function getRepoDetails(doc) {
  const repos = doc.getElementById("user-repositories-list");
  var projectDiv = document.getElementsByClassName("projects")[0];
  if (debugMode) {
    console.log("[INFO] Repositories list - ");
    console.log(repos);
  }

  //Get repository names
  var repoNameList = [];
  var repoLinkList = [];

  for (let item of repos.getElementsByTagName("h3")) {
    if (debugMode) {
      console.log("[INFO] Repo Name - " + item.textContent.trim());
    }
    repoNameList.push(item.textContent.trim());
    var linkItem = item.getElementsByTagName("a")[0];
    console.log("[INFO] Repo URL - " + linkItem.href);
    repoLinkList.push(linkItem.href);

    //Card loader placeholder element
    // loader = document.createElement("div");
    // loader.setAttribute("class", "project card-loader");
    // projectDiv.appendChild(loader);
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
  // console.log("[INFO] REPOS - ");
  // console.log(repos);
  // for (let item of repos.getElementsByTagName("a")) {
  //   if (debugMode) {
  //     console.log("[INFO] Repo URL - " + item.href);
  //   }
  //   repoLinkList.push(item.href);
  // }

  return {
    names: repoNameList,
    descriptions: repoDescList,
    links: repoLinkList
  };
}

//Function for adding GH data to the actual portfolio page
function addRepos(data) {
  if (debugMode) {
    console.log("[INFO] Inside addRepos()");
    console.log(data);
    // console.log(data.descriptions);
  }

  var projects = document.getElementsByClassName("projects")[0];

  for (let index = 0; index < data.names.length; index++) {
    projectItem = document.createElement("div");
    projectItem.setAttribute("class", "item");

    projectHeading = document.createElement("h3");
    // projectHeading.setAttribute("class", "text-secondary");
    projectHeading.textContent = data.names[index];

    projectDesc = document.createElement("p");
    projectDesc.textContent = data.descriptions[index]; //Might cause an error. TODO Improve this ASAP!

    projectItem.appendChild(projectHeading);
    projectItem.appendChild(projectDesc);
    projects.appendChild(projectItem);
  }
}

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
