function getParameterByName(string,name){
    var regexS = "[\\?&]"+name+"=([^&#]*)", 
  regex = new RegExp(regexS),
  results = regex.exec(string);
  if( results == null ){
    return "";
  } else{
    return decodeURIComponent(results[1].replace(/\+/g, " "));
  }
}

function getAvatars(users) {
    for(var i = 0; i < users.length;i++) {
        $.post("https://forums.baystation12.net/api.php", {action:'getAvatar',value:users[i]}).done(function (data) {
            console.log(getParameterByName(this.data,"value"));
            $("[id="+getParameterByName(this.data,"value").replace(' ','')+"]").prop("src",data.avatar.replace("http://baystation12.net/","https://forums.baystation12.net/"));
        });

    };
};

$(function () { //shorthand document.ready function
    $("#content").addClass("loading");


    $.get( "https://forums.baystation12.net/getNews.php",{} )
        .done(function(data) {
            var content = $("#content");
            content.removeClass("loading");
            moment.locale();
            var users = [];
            for(var i = 0; i < data.count;i++) {
                var thread = data.threads[i];
                var container = $(document.createElement('div'));
                container.addClass("ui clearing segment raised red");
                if(users.indexOf(thread.username) === -1) {
                    users.push(thread.username);
                };
                var header = $(document.createElement('h2'));
                header.addClass("ui header").appendTo(container);
                var img = $(document.createElement("img"));
                img.addClass("ui circular image");
                img.prop("src","https://forums.baystation12.net/data/avatars/m/0/1.jpg?1436818309");
                img.prop("id",thread.username.replace(' ',''));
                img.appendTo(header);
                header.append("<div class='content'>"+thread.title);
                var subheader = $(document.createElement("div"));
               // subheader.addClass("ui sub header right floated").html("By <a href='https://baystation12.net/forums/members/"+thread.user_id+"'>"+thread.username+"</a>").appendTo(header);

                subheader = $(document.createElement("div"));
                subheader.addClass("ui sub header right floated").html(moment(thread.post_date,"X").fromNow()).appendTo(header);
                header.append("</div>");
                container.append(thread.content.content[0].message_html);

                container.append('<div class="ui divider"></div>');
                subheader = $(document.createElement("h2"));
                subheader.addClass("ui ui sub header left floated").html(moment(thread.post_date,"X").format('LLLL')+"</br>"+"Posted by <a href='https://forums.baystation12.net/members/"+thread.user_id+"'>"+thread.username+"</a>").appendTo(container)



                var menu = $(document.createElement("div"));
                menu.addClass("ui right floated small labeled button").appendTo(container);
                var buttonLeft = $(document.createElement("a"));
                buttonLeft.addClass("ui small red button").html("<i class='comment icon'></i> Comment").appendTo(menu);
                var buttonRight = $(document.createElement("a"));
                buttonRight.addClass("ui basic red left pointing label").html(thread.reply_count).appendTo(menu);
                buttonRight.prop("href",thread.absolute_url);
                buttonLeft.prop("href",thread.absolute_url);
                container.appendTo(content);
            }
            getAvatars(users);
    })
        .fail(function(data,status) {
            console.log(data);
    });

});

