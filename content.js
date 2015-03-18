//content script

var classarr = []
var classlist = $(".container .box:nth-child(2) tr:nth-child(2) .box ul");
debugger;
for (var i = 0; i < classlist[0].childElementCount; i++){ 
	classarr[i] = classlist[0].children[i].children[0].text;
}


var port = chrome.runtime.connect({name: "easelport"});
port.postMessage({request: "connect"});
port.onMessage.addListener(function(msg) {
  if (msg.request == "getclasses")
    port.postMessage({answer: classarr, response: "classes"});
});