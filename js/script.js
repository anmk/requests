/*
 * $Id: script.js, v 1.0
 * Displaying Requests
 * @author Andrzej Kałowski
 * @link http://projects.kalowski.com/requests/
 */

(function(){

function Request(params) {
    this.params = params;
    this.type = "POST";
    this.key = 1;
    this.items = "";
    this.output = "";
    this.runLoopVal = false;
    this.timeLoop();
}

function Status(statusBox){
    this.statusBox = statusBox;
}

Request.prototype.timeLoop = function() {
    try {
        this.handleRequestStateChange();
        if ((this.key < 1801) && (this.runLoopVal == true)) {
            this.getAddress();
            this.createXmlHttpObject();
            this.runProcess();
            // document.getElementById("requestKey").innerHTML = "Numbers: "+this.key; // view current number
            this.key++; 
        } else if (this.key > 1800) {
            status.statusClassRemove();
            status.statusBox.classList.add("statusPlay");
            document.getElementById("info").innerHTML = "The end of requests";
        }
    }
    catch (e) {
        alert("Unable to run loop");
    }
    setTimeout(function(){this.executionNextLoop()}.bind(this), 2000);
}

Request.prototype.executionNextLoop = function() {
    this.timeLoop();
}

Request.prototype.getAddress = function() {
    this.url = "ServerApp/source.php?n="+this.key;   
}

Request.prototype.createXmlHttpObject = function() {
    try {
        this.xmlHttp = new XMLHttpRequest();
    }
    catch (e) {
        try {
            this.xmlHttp = new ActiveXObject("Microsoft.XMLHttp");
        }
        catch (e) {}
    }

    if (!this.xmlHttp) {
        alert("Error creating XMLHttpRequestObject");
    }
}

Request.prototype.runProcess = function() {
    try {
        if (this.xmlHttp) {
            this.xmlHttp.onreadystatechange = this.handleRequestStateChange();
            this.xmlHttp.open(this.type, this.url, true);
            this.xmlHttp.send(this.params);
            }
            if (this.xmlHttp.length == 0) {
                throw "Unable to connect to server";
            }
        }
        catch (e) {
            alert(e);
        }
    }

Request.prototype.handleRequestStateChange = function() {
    return function() {
        if (this.xmlHttp.readyState == 4 && this.xmlHttp.status == 200) {
            this.displayServerResponse();
        }           
    }.bind(this);
}

Request.prototype.displayServerResponse = function() {
    try {
        this.items = JSON.parse(this.xmlHttp.responseText);
        this.output = "<ul>";
            for (var key = this.items.length; key--;) { 
                this.output += "<li>" + "<b>Number: </b>"+(key+1)+";<b> Name: </b>" + this.items[key].name +";<b> Address: </b>" + this.items[key].address +";<b> PhoneNumber: </b>"+ this.items[key].phoneNumber + ";</li>";
            }
        this.output += "</ul>";
        document.getElementById("list").innerHTML = this.output;
    }
    catch (e) {
         alert("Error reading server response");
    }
}

Status.prototype.statusClassRemove = function() {
    if (this.statusBox.classList.contains("statusDefault")){
        this.statusBox.classList.remove("statusDefault");
    }
    if (this.statusBox.classList.contains("statusPause")){
        this.statusBox.classList.remove("statusPause");
    }
    if (this.statusBox.classList.contains("statusReset")){
        this.statusBox.classList.remove("statusReset");
    }
    if (this.statusBox.classList.contains("alreadyOn")){
        this.statusBox.classList.remove("alreadyOn");
    }
}

var request = new Request();
var status = new Status();

status.statusBox = document.querySelector("#info");

document.getElementById("start").addEventListener("click", function(){
    if (request.runLoopVal == false) {
        request.runLoopVal = true;
        status.statusClassRemove();
        status.statusBox.classList.add("statusPlay");
        document.getElementById("info").innerHTML = "Requests are running";
    } else {
        status.statusBox.classList.add("alreadyOn");
        document.getElementById("info").innerHTML = "Requests are already working!";
    }
}, false);

document.getElementById("pause").addEventListener("click", function(){
    if (request.runLoopVal == true) {
        request.runLoopVal = false;
        status.statusClassRemove();
        status.statusBox.classList.add("statusPause");
        document.getElementById("info").innerHTML = "Requests have been paused";
    } else {
        status.statusBox.classList.add("alreadyOn");
        document.getElementById("info").innerHTML = "Requests have already paused!";
    }
}, false);

document.getElementById("reset").addEventListener("click", function(){
    if ((request.runLoopVal == true) || (request.key > 1)) {
        request.runLoopVal = false;
        request.key = 1;
        status.statusClassRemove();
        status.statusBox.classList.add("statusReset");
        document.getElementById("list").innerHTML = "";
        document.getElementById("info").innerHTML = "Number has been reseted";
    } else {
        status.statusBox.classList.add("alreadyOn");
        document.getElementById("info").innerHTML = "Requests are already reseted!";
    }
}, false);

})();