


  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));


// https://stackoverflow.com/questions/43990584/how-do-we-get-the-parent-tab-url-of-the-current-chrome-tab

//   chrome.tabs.onActivated.addListener(function (activeInfo) {
//     chrome.tabs.get(activeInfo.tabId, function (active_tab) {
//       chrome.tabs.get(active_tab.openerTabId, function (parent_tab) {
//         alert(parent_tab.url);
//       });
//     });
//   });
