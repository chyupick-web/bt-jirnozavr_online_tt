
$(function () { //shorthand document.ready function
    $("#content").addClass("loading");

    $.post("https://forums.baystation12.net/getAbout.php", {}).done(function (data) {
    	var container = $("#content");
		var header = $(document.createElement('h2'));
		header.addClass("ui header").html(data.title).appendTo(container);
		container.append(data.message_html);
		container.removeClass("loading");
    });

});
