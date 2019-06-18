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
  .then(function(data) {
    resizeAllGridItems();
  })
  .catch(function(err) {
    console.error("Some error occurred.", err.statusText);
  });

/**
 *
 * @param {HTMLDoc} [doc] HTML Document for the user's GitHub webpage
 * @returns {JSON} Name, Description and URL of the user's GitHub repositories.
 */
function getRepoDetails(doc) {
  const repos = doc.getElementById("user-repositories-list");
  var repoInfo = [];
  var projectDiv = document.getElementsByClassName("projects")[0];
  if (debugMode) {
    console.log("[INFO] Repositories list - ");
    console.log(repos);
  }

  for (let item of repos.getElementsByTagName("h3")) {
    // repoNameList.push(item.textContent.trim());
    var linkItem = item.getElementsByTagName("a")[0];
    // console.log("[INFO] Repo URL - " + linkItem.href);
    // repoLinkList.push(linkItem.href);
    var info = {};
    info["link"] = linkItem.href;
    info["name"] = item.textContent.trim(); //TODO Format result
    repoInfo.push(info);

    //Card loader placeholder element
    // loader = document.createElement("div");
    // loader.setAttribute("class", "project card-loader");
    // projectDiv.appendChild(loader);
  }

  if (debugMode) {
    console.log("[INFO] Repo Info");
    console.log(repoInfo);
  }

  //Get repository descriptions
  var repoDescList = [];
  var details = repos.getElementsByTagName("p");
  for (let index = 0; index < details.length; index++) {
    // const desc = details[index];
    repoInfo[index].description = details[index].textContent.trim();
  }

  if (debugMode) {
    console.log("[INFO] Final REPO INFO");
    console.log(repoInfo);
  }

  return repoInfo;
}

//Function for adding GH data to the actual portfolio page
/**
 *
 * @param {Array[JSON]} [data] GitHub repositories' info.
 *
 * @description Function for adding Repositories' data to the webpage.
 */
function addRepos(data) {
  if (debugMode) {
    console.log("[INFO] Inside addRepos()");
  }

  var projects = document.getElementsByClassName("projects")[0];

  for (let index = 0; index < data.length; index++) {
    projectItem = document.createElement("div");
    projectItem.setAttribute("class", "item");

    projectHeading = document.createElement("h3");
    // projectHeading.setAttribute("class", "text-secondary");
    projectHeading.textContent = data[index].name;

    projectDesc = document.createElement("p");
    projectDesc.textContent = data[index].description; //Might cause an error. TODO Improve this ASAP!

    // <a href="#" class="btn-dark">
    // <i class="fab fa-github"></i> Github
    // </a>
    projectLink = document.createElement("a");
    projectLink.setAttribute("class", "btn-dark top bottom");
    projectLink.setAttribute("href", data[index].link);

    githubIcon = document.createElement("i");
    githubIcon.setAttribute("class", "fab fa-github");
    projectLink.appendChild(githubIcon);
    // projectLink.textContent = "Github";

    projectItem.appendChild(projectHeading);
    projectItem.appendChild(projectDesc);
    projectItem.appendChild(projectLink);

    projects.appendChild(projectItem);
  }

  if (debugMode) {
    console.log("[INFO] Repos addition complete!");
  }
}

/**
 *
 * @param {*} [item] Item to be resized in the grid
 *
 * Resized grid items individually.
 */
function resizeGrid(item) {
  grid = document.getElementsByClassName("projects")[0];
  rowHeight = parseInt(
    window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
  );
  rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue("grid-gap"));

  if (debugMode) {
    console.log("[INFO] Resizer - ");
    console.log("\tRow Height - " + rowHeight + ", Gap - " + rowGap);
  }
  console.log("\tReal Height - " + item.getBoundingClientRect().height);
  rowSpan = Math.ceil(
    (item.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap)
  );

  if (debugMode) {
    console.log("\tRow Span - " + rowSpan);
  }
  item.style.gridRowEnd = "span " + rowSpan;
}

//TODO Extend this function and make it portable
function resizeAllGridItems() {
  allItems = document.getElementsByClassName("item");
  if (debugMode) {
    console.log("[INFO] Grid Items - ");
    console.log(allItems);
  }
  for (x = 0; x < allItems.length; x++) {
    resizeGrid(allItems[x]);
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
