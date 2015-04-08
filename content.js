//content script
var esly = {
	classmap: [],
	classAssignmentArray: [],
	addClassAssignments: function(len){
		for (var i = 0; i < len; i++){
			var classCal = document.getElementById('class-' + i)
			var cal = classCal.contentDocument.body
			esly.classAssignmentArray[i] = cal.querySelectorAll('a')
		}
	}
}

esly.classlist = $(".container .box:nth-child(2) tr:nth-child(2) .box ul");

esly.findAllClasses = function(){
	for (var i = 0; i < esly.classlist[0].childElementCount; i++){ 
		esly.classmap[i] = esly.classlist[0].children[i].children[0].text;
	}
}

esly.findAllClassAssignments = function(){
	for (var i = 0; i < esly.classmap.length; i++){
		var cls = document.createElement('iframe')
		cls.src = esly.classlist[0].children[i].children[0].href
		cls.style.display = "none"
		cls.setAttribute("id", "class-" + i)
		document.body.appendChild(cls) 
	}
	//figure out how to call this AFTER all iframes are loaded
	setTimeout(esly.addClassAssignments(esly.classmap.length), 3000);
	console.log(esly.classAssignmentArray)
}


var port = chrome.runtime.connect({name: "easelport"});
port.postMessage({request: "connect"});
port.onMessage.addListener(function(msg) {
	if (msg.request == "getclasses"){
		esly.findAllClasses()
		port.postMessage({answer: esly.classmap, response: "classes"});
	}
	else if (msg.request == "getAssignments"){
		//get the assignments
		esly.findAllClassAssignments()
		//return object
		port.postMessage({answer: esly.classAssignmentArray, response: "assignments"});
	}
});