$(function () { //shorthand document.ready function
    updateData();
    setInterval(updateData, 1000 * 60); // update every minute

    function updateData() {
        $.get("https://info.baystation12.net/status", function (data) {
            $("#player").html(data.players);
            $("#mode").html(data.mode);
            $("#admin").html(decodeURIComponent(data.roundduration));
        });
    }
});
