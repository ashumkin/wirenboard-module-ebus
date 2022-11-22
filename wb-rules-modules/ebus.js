var MODULE_NAME 		= "ebus";
var MODULE_VERSION  = "1.3.1";

exports.start = function(config) {
	if (!validateConfig(config)) return;

	//  device  //
	createDevice(config);

	//  topics map  //
	var topicsMap = getTopicsMap(config);

	//  proxy  //
	setProxy(config.id, getProxyTasks(topicsMap));

	//  rules  //
	Object.keys(topicsMap).forEach(function (item) {
		if (topicsMap[item].readonly) return;
		createRule_changeParameter(config.id, item, topicsMap[item].ebus);
	});

	//  get data from ebus every 30 sec  //
	ebusd_getData_interval(topicsMap, 30000);

  log(config.id + ": Started (" + MODULE_NAME + " ver. " + MODULE_VERSION + ")");
};

//  Validate config  //

var validateConfig = function(_config) {
  if (!_config) {
    log("Error: " + MODULE_NAME + ": No config");
    return false;
  }

  if (!_config.id || !_config.id.length) {
    log("Error: " + MODULE_NAME + ": Config: Bad id");
    return false;
  }

  if (!_config.title || !_config.title.length) {
    log("Error: " + MODULE_NAME + ": Config: Bad title");
    return false;
  }

	if (!_config.parameters || !Object.keys(_config.parameters).length) {
    log("Error: " + MODULE_NAME + ": Config: Bad parameters");
    return false;
  }

	Object.keys(_config.parameters).forEach(function (item) {
		var param = _config.parameters[item];

		if (!param.id || !param.id.length) {
			log("Error: " + MODULE_NAME + ": Config: Bad parameter id");
	    return false;
		}

		if (!param.name || !param.id.length) {
			log("Error: " + MODULE_NAME + ": Config: Bad parameter name");
	    return false;
		}

		if (!param.type || !param.type.length) {
			log("Error: " + MODULE_NAME + ": Config: Bad parameter type");
	    return false;
		}

		if (param.type === "range" && !param.max) {
			log("Error: " + MODULE_NAME + ": Config: No range max");
	    return false;
		}
	});

  return true;
}

//
//  Device  //
//

function createDevice(config) {
	var cells = {
		proxy_connected: 	{ type: "value", 	value: 0, forceDefault: true, readonly: false },
	}

	Object.keys(config.parameters).forEach(function (item) {
		var newControl = {};

		newControl.readonly = config.parameters[item].readonly || false;

		newControl.type = config.parameters[item].type;
		if (newControl.type === "range") {
			newControl.max = config.parameters[item].max;
		}

		newControl.value = 0;

		cells[item] = newControl;
	});

	defineVirtualDevice(config.id, {
	  title: config.title,
	  cells: cells
	});
}

//
//  Topics map  //
//

function getTopicsMap(config) {
	topicsMap = {};

	Object.keys(config.parameters).forEach(function (item) {
		var param = config.parameters[item];

		var newTopicBridge = {};
		newTopicBridge.ebus = "ebusd/" + param.id + "/" + param.name;
		newTopicBridge.wb 	= "/devices/" + config.id + "/controls/" + item;

		//  check writable  //
		if (param.type === "range" || param.type === "switch") {
			newTopicBridge.readonly = false;
		} else {
			newTopicBridge.readonly = true;
		}

		newTopicBridge.convert = param.convert
		topicsMap[item] = newTopicBridge;
	});

	return topicsMap;
}

//
//  Get values from ebus  //
//

function ebusd_getData(topicsMap) {
	Object.keys(topicsMap).forEach(function(item) {
		publish(topicsMap[item].ebus + '/get', "");
	});
}

function ebusd_getData_interval(topicsMap, period) {
	ebusd_getData(topicsMap);

	setInterval(function(){
		ebusd_getData(topicsMap);
	}, period);
}

//
//  Proxy  //
//

function getProxyTasks(topicsMap)
	var tasks = [];
	Object.keys(topicsMap).forEach(function(item) {
		tasks.push('{'
			+ '"task": "add",'
			+ '"from": "' + topicsMap[item].ebus + '",'
			+ '"to": "' + topicsMap[item].wb + '",'
			+ '"convert": ' + (topicsMap[item].convert ? JSON.stringify(item + "_convert = " + topicsMap[item].convert) : 'null')
			+ '}');
	});

	return tasks;
}

function setProxy(device_id, proxyTasks) {
	// log("Proxy tasks: ");
	// proxyTasks.forEach(function(task) {
	// 	log(task);
	// });

	setInterval(function(){
		//  wait service started  //
		if (dev["mqtt-proxy"]["connected"] !== 1) return;

		//  set topics  //
		if (dev[device_id]["proxy_connected"] !== 1) {
			dev[device_id]["proxy_connected"] = 1;
			log(device_id + ": Connected to proxy");

			proxyTasks.forEach(function(task) {
				dev["mqtt-proxy"]["config"] = task;
			});
		}
	}, 1000);
}

//
//  Rules  //
//

function createRule_changeParameter(device_id, parameter, ebus_topic) {
	defineRule({
    whenChanged: device_id + "/" + parameter,
    then: function (newValue, devName, cellName) {
			publish(ebus_topic + "/set", newValue);
			log("EBUS: " + parameter + ": " + newValue);
		}
	});
}
