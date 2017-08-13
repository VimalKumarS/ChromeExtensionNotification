console.log("content script")

$(document).ready(function () {
    chrome
        .runtime
        .sendMessage({action: "show"});
})

chrome
    .runtime
    .onMessage
    .addListener(function showNotification(request, sender, sendResponse) {
        if (request.action == "showWarpNotification") {

            chrome
                .notifications
                .create('Warp-Notification', request.data, function () {});
            chrome
                .browserAction
                .setBadgeText({"text": 5});
        }
    });