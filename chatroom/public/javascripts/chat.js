/**
 * Created by HuFolder on 1/18/18.
 */
window.onload = function() {
    // instantiate a ChatRoom app
    var socket = io.connect();
    var sendButton = document.getElementById("sendBtn");
    var messageInput = document.getElementById("messageInput");

    socket.on('connect', function () {
        var currentUser = document.getElementById('currentUser').textContent;
        if (typeof currentUser != "undefined") {
            socket.emit('loginSuccess', currentUser);
        }
    });

    socket.on('update', function(userCount) {
        document.getElementById('status').textContent = userCount + (userCount > 1 ? ' users' : ' user') + ' online';
    });

    socket.on('system', function(nickName, userCount, type) {
        var msg = nickName + (type == 'logout' ? ' left' : ' join');
        _displayNewMsg('system ', msg, new Date().toTimeString().substr(0, 8), 'blue');
        //document.getElementById('status').textContent = userCount + (userCount > 1 ? ' users' : ' user') + ' online';
    });

    // show other user's new message in default color
    socket.on('newMsg', function(user, msg, date) {
        _displayNewMsg(user, msg, date);
    });

    // show user's own message in color green
    socket.on('myMsg', function(user, msg, date) {
        _displayNewMsg(user, msg, date, 'green');
    });

    // show history message in color grey
    socket.on('histMsg', function(user, msg, date) {
        _displayNewMsg(user, msg, date, 'grey');
    });

    sendButton.addEventListener('click', function() {
        var currentUser = document.getElementById('currentUser').textContent;
        var msg = messageInput.value;
        messageInput.value = '';
        messageInput.focus();
        if (msg.trim().length != 0) {
            socket.emit('sendMsg', msg, currentUser);
        }
    }, false);

    function _displayNewMsg(user, msg, date, color) {
        var container = document.getElementById('historyMsg'),
            msgToDisplay = document.createElement('p');
        msgToDisplay.style.color = color || '#000';
        msgToDisplay.innerHTML = user + ' ' + '<span class="timespan">(' + date + '): </span> ' + msg;
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    }
};