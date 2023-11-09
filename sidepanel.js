// https://stackoverflow.com/questions/43990584/how-do-we-get-the-parent-tab-url-of-the-current-chrome-tab

// chrome.tabs.onActivated.addListener(function (activeInfo) {
//   chrome.tabs.get(activeInfo.tabId, function (active_tab) {
//     if (active_tab.openerTabId) {
//       chrome.tabs.get(active_tab.openerTabId, function (parent_tab) {
//         alert(parent_tab.id);
//       });
//     }
//   });
// });

chrome.tabs.onCreated.addListener(function (active_tab) {
  if (active_tab.openerTabId) {
    addTab(active_tab, active_tab.openerTabId);
  }
});

const tabs = await chrome.tabs.query({});

// const collator = new Intl.Collator();
// tabs.sort((a, b) => collator.compare(a.title, b.title));

const template = document.getElementById("li_template");
const elements = new Set();

for (const tab of tabs) {
  const element = template.content.firstElementChild.cloneNode(true);

  const title = tab.title.split("-")[0].trim();
  // const pathname = new URL(tab.url).pathname.slice("/docs".length);

  element.querySelector(".title").textContent = title;
  // element.querySelector(".pathname").textContent = pathname;
  element.id = "lol" + tab.id;
  element.querySelector("a").addEventListener("click", async () => {
    // need to focus window as well as the active tab
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  });

  elements.add(element);
}
document.querySelector("ul").append(...elements);

async function toggleMuteState(tabId) {
  const tab = await chrome.tabs.get(tabId);
  const muted = !tab.mutedInfo.muted;
  await chrome.tabs.update(tabId, { muted });
  console.log(`Tab ${tab.id} is ${muted ? "muted" : "unmuted"}`);
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  const element = document.querySelector("#lol" + tabId);
  element.querySelector(".title").textContent = tab.title;
});

async function addTab(tabss, parentId) {
  const tab = await chrome.tabs.get(tabss.id);
  if (tab) {
    // const muted = !tab.mutedInfo.muted;
    // await chrome.tabs.update(tabId, { muted });
    // console.log(`Tab ${tab.id} is ${muted ? "muted" : "unmuted"}`);
    const element = template.content.firstElementChild.cloneNode(true);
    element.querySelector(".title").textContent = tab.title;
    // element.querySelector(".pathname").textContent = pathname;
    element.id = "lol" + tab.id;
    element.querySelector("a").addEventListener("click", async () => {
      // need to focus window as well as the active tab
      await chrome.tabs.update(tab.id, { active: true });
      await chrome.windows.update(tab.windowId, { focused: true });
    });

    if (parentId) {
      const parentLi = document.querySelector("#lol" + parentId);
      if (parentLi) {
        parentLi.after(element);
      } else {
        document.querySelector("ul").append(element);
      }
    } else {
      document.querySelector("ul").append(element);
    }
  }
}

const addTabs = async (title, tab, parentId) => {
  // chrome.tabs.get(tab.id, function (tab) {

  const element = template.content.firstElementChild.cloneNode(true);
  element.querySelector(".title").textContent = title;
  // element.querySelector(".pathname").textContent = pathname;
  element.id = "lol" + tab.id;
  element.querySelector("a").addEventListener("click", async () => {
    // need to focus window as well as the active tab
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  });

  if (parentId) {
    const parentLi = document.querySelector("#lol" + parentId);
    if (parentLi) {
      parentLi.after(element);
    } else {
      document.querySelector("ul").append(element);
    }
  } else {
    document.querySelector("ul").append(element);
  }
  // });
};

// chrome.tabs.query({}, function (tabs) {
//   for (var i = 0; i < tabs.length; i++) {
//     // do whatever you want with the tab
//     const tabinfo = document.createElement("p");
//     document.querySelector("#tabs").appendChild(tabinfo);
//     tabinfo.innerHTML = `
//           TabId: ${tabs[i].id}
//           openerTabId: ${tabs[i].openerTabId}
//           `;
//     // chrome.tabs.sendRequest(tabs[i].id, { action: "xxx" });
//   }
// });

/*
Save tree on close
Load the tree on open
update the tree with existing tabs
      - Check if all the tabs exits
      - if parent is dead - associate child to a its parent parent



      //  LOCAL Storage

      // Save data to storage locally, in just this browser...

      chrome.storage.local.set({ "phasersTo": "awesome" }, function(){
          //  Data's been saved boys and girls, go on home
      });

      chrome.storage.local.get(["phasersTo"], function(items){
          //  items = [ { "phasersTo": "awesome" } ]
      });
*/
