var notificationsEnabled = false;

$(function () { //shorthand document.ready function
    var justNotified = false;

    updateData();
    setInterval(updateData, 1000 * 60); // update every minute

    function updateData() {
        $.get("https://info.baystation12.net/status", function (data) {
            if (!data) data = {};
            var roundDuration = data.roundduration ? decodeURIComponent(data.roundduration) : null;
            $("#player").html(data.players || '--');
            $("#mode").html(data.mode || '--');
            $("#admin").html(roundDuration || '--:--');
            
            if (roundDuration && roundDuration !== '00:00') { // Round is on-going
                justNotified = false;
            }

            if (shouldNotify()) {
                var notification = new window.Notification('Baystation12 round ended!', {
                    body: 'Click here to go join the lobby.',
                    icon: 'https://baystation12.net/forums/logo.png',
                    image: 'https://baystation12.net/forums/logo.png'
                });
                justNotified = true;
                notification.onclick = function() {
                    var newWindow = window.open('byond://play.baystation12.net:8000');
                    setTimeout(function() {
                        if(newWindow) {
                            newWindow.close();
                        }
                    }, 500);
                }
            }

            function shouldNotify() {
                return (
                    notificationsEnabled &&
                    !justNotified && (
                        !data.players || !data.mode || !data.roundduration || // Server is down
                        (data.roundduration && decodeURIComponent(data.roundduration) == '00:00') // In lobby or just started
                    ) &&
                    window.Notification && // Notifications are supported
                    window.Notification.permission == 'granted' // Permission was granted
                );
            }
        });
    }
});

function toggleNotifications() {
    notificationsEnabled = !notificationsEnabled;

    if(notificationsEnabled) {
        if (window.Notification) {
            if (window.Notification.permission != 'granted') {
                window.Notification.requestPermission();
            }
        } else {
            $('#notificationsToggler').html('Notifications not supported in this browser.');
        }
    }
}
