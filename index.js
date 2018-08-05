$(function () { //shorthand document.ready function

    $.get("https://info.baystation12.net/status", function (data) {
        $("#player").html(data.players);
        $("#mode").html(data.mode);
        $("#admin").html(decodeURIComponent(data.roundduration));
    });


});
