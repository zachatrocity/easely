$(document).ready(function(){

  chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "easelport");
  port.onMessage.addListener(function(msg) {
    if(msg.request == "connect"){
      console.log("connectectt");
      port.postMessage({request: "getclasses"});
    }
    else if(msg.response == "classes" && $('#classesView').css('display') == 'none'){
      console.log(msg.answer);

      var table = $('<table></table>').addClass('classtable');
      for(var i = 0; i < msg.answer.length; i++){
          var row = $('<tr></tr>').addClass('enrolledclass').text(msg.answer[i]);
          table.append(row);
      }
      $('#classesView').append(table);
      $("#genInfo").text('Select the classes you wish to add to Google Calendar');
      $("#loginForm").hide();
      $("#classesView").show();
    }
  });
});

  $("#submitButton").click(function(){
    chrome.tabs.update({
     url: "https://cs.harding.edu/easel/cgi-bin/proc_login?user=" + $("#username").val() + "&passwd=" + $("#passwd").val()
    }, function(tab){
      var cookie = getCookie("EASESID");
      if(cookie!= ""){
        //user is logged in successfully
      } else{
        $("#genInfo").text('Incorrect username/pass');
      }
    });
  });
})


function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function getClassData(){

}