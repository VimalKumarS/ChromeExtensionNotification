var option =  {
    userName: "",
    warpUrl: "localhost",
    socketUrl: "http://localhost:3000",
    cookieDomain: "http://localhost:3000",
    cookieName: "auth-token",
    notificationCount:0,
    notificationRoomName:""
}

var getCookieValue = function (domain, name, callback) {
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

var verifyWarpUrl = function () {
    chrome
        .windows
        .getAll({
            "populate": true
        }, function (windows) {
            var existing_tab = null;
            for (var i in windows) {
                var tabs = windows[i].tabs;
                for (var j in tabs) {
                    var tab = tabs[j];
                    if (tab.url.toLowerCase().indexOf(option.warpUrl) > -1) {
                        existing_tab = tab;
                        break;
                    }
                }
            }
            if (existing_tab) {
                console.log(existing_tab)
                getCookieValue(option.cookieDomain, option.cookieName, processCookie)
            } else {}
        });

}

var processCookie = function (value) {
    //todo: process base 64 value check if value is empty
    console.log(value);
    option.notificationRoomName=value;
    createSocketConnection()
}

var createSocketConnection = function () {
    var socket = io.connect(option.socketUrl, {
        reconnection: true,
        reconnectionDelay: 1500,
        reconnectionAttempts: 10

    });
    //create room with user name
    socket.emit('create-room', option.notificationRoomName)
    socket.on("add-message", function (data) {
        var opt = {
            type: "basic",
            title: "Warp Notification",
            message: data.content,
            iconUrl: "tesla_128.png"
        }
        option.notificationCount= option.notificationCount +1;
        // when message received show notificaiton
        chrome
            .tabs
            .query({
                active: true,
                currentWindow: false
            }, function (tabs) {
                chrome
                    .notifications
                    .create('Warp-Notification', opt, function () {});

                chrome
                    .browserAction
                    .setBadgeText({"text": ''+ option.notificationCount});
            });

    });
    socket.on('disconnect', function () {
        console.log('disconnected to server');
        socket.reconnect();
        //socket.open();
    });

}

var openTaskEventPage = function () {
    chrome
        .tabs
        .create({"url": "http://www.google.com", "selected": true});
}

var init = function () {
    chrome.browserAction.setBadgeText({"text": ""});
    verifyWarpUrl();
    chrome
        .notifications
        .onClicked
        .addListener(openTaskEventPage);
}

//init();
chrome.browserAction.onClicked.addListener(init);