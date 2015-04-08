//content script
var esly = {
	classarr: []
}

esly.classlist = $(".container .box:nth-child(2) tr:nth-child(2) .box ul");

for (var i = 0; i < esly.classlist[0].childElementCount; i++){ 
	esly.classarr[i] = esly.classlist[0].children[i].children[0].text;
}


var port = chrome.runtime.connect({name: "easelport"});
port.postMessage({request: "connect"});
port.onMessage.addListener(function(msg) {
  if (msg.request == "getclasses"){
    port.postMessage({answer: esly.classarr, response: "classes"});
  }
  else if (msg.request == "getAssignments"){
  	//get the assignments

  	//return object
  	
  }

});