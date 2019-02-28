$(function () { //shorthand document.ready function
    var lastTime = 0;

    if (window.Notification) {
        window.Notification.requestPermission();
    }

    updateData();
    setInterval(updateData, 1000 * 60); // update every minute

    function updateData() {
        $.get("https://info.baystation12.net/status", function (data) {
            if (data && Object.keys(data).length > 1) {// round is on-going
                var roundDuration = decodeURIComponent(data.roundduration);
                $("#player").html(data.players);
                $("#mode").html(data.mode);
                $("#admin").html(roundDuration);

                var currentTime = parseTime(roundDuration);
                if(currentTime !== null) { // Succeeded parsing
                    if (currentTime < lastTime) { // Restart detected
                        if (window.Notification && window.Notification.permission == 'granted') {
                            var notification = new window.Notification('New Baystation12 round started!', {
                                body: 'Game mode: ' + data.mode + '.\nClick here to go directly to the round.',
                                icon: 'https://baystation12.net/forums/logo.png',
                                image: 'https://baystation12.net/forums/logo.png'
                            });
                            notification.onclick = function() {
                                var newWindow = window.open('byond://play.baystation12.net:8000');
                                setTimeout(function() {
                                    if(newWindow) {
                                        newWindow.close();
                                    }
                                }, 500);
                            }
                        }
                    }
                } else {
                    console.log('Could\'nt parse time string');
                }
            }
        });
    }

    function parseTime(timeStr) {
        if (!timeStr) return null;
        if (timeStr.indexOf(':') == -1) return null;
        const parts = timeStr.split(':');
        if (parts.length != 2) return null;
        const hours = parts[0];
        const minutes = parts[1];
        const hoursNum = Number(hours);
        const minutesNum = Number(minutes);
        return (hoursNum * 100) + minutesNum;
    }
});
