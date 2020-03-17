﻿#targetengine com.rorohiko.testhandlers

var gLogFile = Folder.desktop + "/TestHandlers" + app.version + ".log";

installAppHandlers();

function logMessage(in_message) {
	var f = File(gLogFile);
    f.encoding = "BINARY";
    if (! f.exists) {
        f.open("w");
    }
     else {
        f.open("a");
    }
	f.write(in_message + "\012");
	f.close();
}

function installDocHandlers(doc) {

	function installDocHandler(doc, eventCode, eventName) {
		
	    var docEventHandler = (function() {
	        logMessage("Handler for Document." + eventCode + " called on document " + doc.name);
	    });

	    doc.addEventListener(eventName, docEventHandler);
	}

	for (var eventCode in Document) {
        if (eventCode.substr(0,6) == "AFTER_" || eventCode.substr(0,7) == "BEFORE_") {
		    var eventName = Document[eventCode];
            logMessage("Installing handler for doc." + eventName);
		    installDocHandler(doc, eventCode, eventName);
		}
	}
	
}

function installAppHandlers() {

	function installAppHandler(eventCode, eventName) {

	    var handler = (function() {

	        try {
	        	var document = app.activeDocument;           
	            if (document.eventListeners.length == 0) {
	                installDocHandlers(document);
	            }
	        }
	        catch (err) {
	        }

	        logMessage("Handler for Application." + eventCode + " called");
	    });

	    app.addEventListener(eventName, handler);
	}

	logMessage("App version:" + app.version);
	app.eventListeners.everyItem().remove();

	for (var eventCode in Application) {
        if (eventCode.substr(0,6) == "AFTER_" || eventCode.substr(0,7) == "BEFORE_") {
  		    var eventName = Application[eventCode];           
            logMessage("Installing handler for Application." + eventCode);
            installAppHandler(eventCode, eventName);
		}
	}
	
}