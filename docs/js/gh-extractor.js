function getGithubPage(url) {}
var debugMode = true;
var repoDetails;
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
    window.repoDetails = repoDetails;
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
  // var projectDiv = document.getElementsByClassName("projects")[0];

  //RegEx for checking View URLs inside the repo description
  var expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

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
    info["name"] = item.textContent.trim().replace(/-/g, " "); //TODO Format result
    repoInfo.push(info);
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

    var urlRegex = new RegExp(expression);
    var linkMatch = urlRegex.exec(repoInfo[index].description);

    repoInfo[index].description = details[index].textContent
      .replace(expression, "")
      .trim();

    if (linkMatch != null) {
      repoInfo[index].viewLink = linkMatch[0];
    } else {
      repoInfo[index].viewLink = null;
    }
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

    //Add Heading and Description to the page...
    projectItem.appendChild(projectHeading);
    projectItem.appendChild(projectDesc);

    if (data[index].viewLink != null) {
      viewLink = document.createElement("a");
      viewLink.setAttribute("class", "btn-light top");
      viewLink.setAttribute("href", data[index].viewLink);

      viewIcon = document.createElement("i");
      viewIcon.setAttribute("class", "fas fa-eye");
      viewLink.appendChild(viewIcon);
      viewButtonText = document.createElement("p");
      viewButtonText.textContent = " View Project";
      viewButtonText.setAttribute("style", "display:inline");
      viewLink.appendChild(viewButtonText);

      //Reformat GitHub button...
      projectLink.setAttribute("class", "btn-dark bottom");
      //Add View Button
      projectItem.appendChild(viewLink);
    }

    //Finally, add GitHub button
    projectButtonText = document.createElement("p");
    projectButtonText.textContent = " GitHub";
    projectButtonText.setAttribute("style", "display:inline");
    projectLink.appendChild(projectButtonText);
    projectItem.appendChild(projectLink);

    //Add the view to the page...
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
    console.log(item);
    console.log("\tRow Height - " + rowHeight + ", Gap - " + rowGap);
    console.log("\tReal Height - " + item.scrollHeight);
  }
  var value = (item.scrollHeight + rowGap + 2) / (rowHeight + rowGap);
  rowSpan = Math.ceil(value);

  if (debugMode) {
    console.log("\tRow Span - " + rowSpan);
  }
  item.style.gridRowEnd = "span " + rowSpan;
}

//TODO Extend this function and make it portable
function resizeAllGridItems() {
  allItems = document.getElementsByClassName("item");
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

//TODO Pls fix
window.addEventListener("resize", function(event) {
  if (debugMode) {
    console.log("[INFO] Window Resized!");
    console.log(
      document.body.clientWidth +
        " wide by " +
        document.body.clientHeight +
        " high"
    );
  }
  // resizeAllGridItems();
  // addRepos(repoDetails);
  // resizeAllGridItems();
});
