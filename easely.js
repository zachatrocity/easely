var esly = {
  clientId: '693163061755-3imno95ak523h2s90vur7h9srfk5s7b4.apps.googleusercontent.com',
  scopes: 'https://www.googleapis.com/auth/calendar',

  getCookie: function(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  },
  addCalendarService: function(event){
    gapi.client.load('calendar', 'v3');
  },
  initapi: function(){;
    esly.checkAuth();
  },
  checkAuth: function() {
    gapi.auth.authorize({'client_id': esly.clientId,
                         'scope': esly.scopes, 
                         'immediate': true},
                         esly.handleAuthResult);
  },
  handleAuthResult: function(authResult) {
    if (authResult) {
      console.log("auth success")
      esly.addCalendarService();
    } else {
      // No access token could be retrieved, force the authorization flow.
      gapi.auth.authorize(
          {'client_id': esly.clientId, 'scope': esly.scopes, 'immediate': false},
          handleAuthResult);
    }
  },
  handleAuthClick: function(event) {
    gapi.auth.authorize(
        {client_id: clientId, scope: scopes, immediate: false},
        esly.handleAuthResult);
    return false;
  }
}

$(document).ready(function(){

  chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "easelport");
    port.onMessage.addListener(function(msg) {
      if(msg.request == "connect"){
        port.postMessage({request: "getclasses"});
      }
      else if(msg.response == "classes" && 
            $('#classesView').css('display') == 'none' &&
            $('.classtable').length == 0){

        esly.table = $('<table></table>').addClass('classtable');
        for(var i = 0; i < msg.answer.length; i++){
            var $row = $("<tr id='classindex-"+ i +"'></tr>").addClass('enrolledclass').text(msg.answer[i]);
            $row.prepend("<input type='radio' id='class-radio-" + i+ "'>")
            esly.table.append($row);
        }
        $('#classesView').append(esly.table);
        $('#classesView').append("<button id='addToCalButton'>Add To Calendar</button>")
        //$('#addToCalButton').click(function(){esly.askForClassAssignmentArr(msg.answer)});
        $("#genInfo").text('Select the classes you wish to add to Google Calendar');
        $("#loginForm").hide();
        $("#classesView").show();

        //ask for all class assignments
        port.postMessage({request: "getAssignments", classes: msg.answer});
      }
      else if(msg.response =="assignments"){
        console.log(msg.answer)
      }
    });
  });

  $("#submitButton").click(function(){
    chrome.tabs.update({
     url: "https://cs.harding.edu/easel/cgi-bin/proc_login?user=" + $("#username").val() + "&passwd=" + $("#passwd").val()
    }, function(tab){
      var cookie = esly.getCookie("EASESID");
      if(cookie!= ""){
        //user is logged in successfully
      } else{
        $("#genInfo").text('Incorrect username/pass');
      }
    });
  });
})
