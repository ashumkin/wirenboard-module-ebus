var ebus = require("ebus");

ebus.start({
	id: "heating_home",
	title: "Vaillant gas boiler and panel",

	parameters: {
//		temperature: 	{ id: "470", name: "DisplayedRoomTemp", type: "temperature", readonly: true },
		temperature: 	{ id: "470", name: "RoomTemp", type: "temperature", readonly: true,
			convert: "function(value) { value = value.split(';')[0]; return value - 1.7; }" },
		target_day: 	{ id: "470", name: "Hc1DayTemp", type: "range", min: 10, max: 30, step: 0.5 },
		target_night: { id: "470", name: "Hc1NightTemp", type: "range", min: 10, max: 30, step: 0.5 },
		outside_temp: { id: "470", name: "OutsideTemp", type: "temperature", readonly: true,
			convert: "function(value) { value = value.split(';')[0]; return value; }" },
		opmode: { id: "470", name: "Hc1OPMode", type: "text", readonly: true },
		sfmode: { id: "470", name: "Hc1SFMode", type: "text", readonly: true },
		curve: { id: "470", name: "Hc1HeatCurve", type: "range", min: 0, max: 2, readonly: true },

		boiler_target: 	{ id: "470", name: "HwcTempDesired", type: "range", min: 30, max: 75 },

		boiler_error: { id: "bai", name: "currenterror", type: "text", readonly: true },
	}
});
