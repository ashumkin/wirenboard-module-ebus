var ebus = require("ebus");

ebus.start({
	id: "heating_home",
	title: "Heating home (ebus)",

	parameters: {
		temperature: 	{ id: "370", name: "DisplayedRoomTemp", type: "temperature" },
		target_day: 	{ id: "370", name: "Hc1DayTemp", type: "range", max: 35 },
		target_night: { id: "370", name: "Hc1NightTemp", type: "range", max: 35 },

		boiler_t: 			{ id: "370", name: "DisplayedHwcStorageTemp", type: "temperature" },
		boiler_target: 	{ id: "370", name: "HwcTempDesired", type: "range", max: 100 },

		// boiler_error: { id: "bai", name: "currenterror", type: "text" },
	}
});
