//usage:
var userName = "vimkumar";
var opt = {
    type: "basic",
    title: "Warp Notification",
    message: "data.content",
    iconUrl: "tesla_128.png"
}

chrome
    .notifications
    .create('Warp-Notification', opt, function () {});

function getCookies(domain, name, callback) {
    chrome
        .cookies
        .get({
            "url": domain,
            "name": name
        }, function (cookie) {
            if (callback) {

                callback(cookie.value);
            }
        });
}

// chrome     .runtime     .onMessage     .addListener(function (request,
// sender, sendResponse) {         if (request.action == "show") {
// getCookies("http://localhost:3000/", "auth-token", function (id) {
// //console.log(id); userName = id;                 alert(id);
// //CreateSocketConnection.bind(this);             });         }     });

function CreateSocketConnection() {
    var socket = io.connect('http://localhost:3000');
    socket.emit('create-room', userName)
    socket.on("add-message", function (data) {
        var opt = {
            type: "basic",
            title: "Warp Notification",
            message: data.content,
            iconUrl: "tesla_128.png"
        }

        chrome
            .tabs
            .query({
                active: true,
                currentWindow: false
            }, function (tabs) {
                chrome
                    .notifications
                    .create('Warp-Notification', opt, function () {});
                // chrome.tabs.sendMessage(tabs[0].id, {action: "showWarpNotification", data:
                // opt}, function(response) {});
                chrome
                    .browserAction
                    .setBadgeText({"text": 5});
            });

        // chrome     .runtime     .sendMessage({action: "showWarpNotification", data:
        // opt});

    });
    socket.on('disconnect', function () {
        console.log('disconnected to server');
        //socket.reconnect();
        socket.open();
    });
}
chrome
    .runtime
    .onMessage
    .addListener(function onMessageHandler(request, sender, sendResponse) {
        if (request.action == "show") {

            getCookies("http://localhost:3000", "auth-token", function (id) {
                alert(id);
            });
            CreateSocketConnection();

        }
    });

function openWarningPage() {
    chrome
        .tabs
        .create({
            url: 'www.google.com'
        });
}
chrome
    .notifications
    .onClicked
    .addListener(openWarningPage);