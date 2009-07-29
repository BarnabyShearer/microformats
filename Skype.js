var skype = {
	description: "Call with Skype",
	shortDescription: "Skype",
	icon: "http://skype.com/favicon.ico",
	scope: {
		semantic: {
			"hCard": "tel"
		}
	},
	doAction: function(semanticObject, semanticObjectType, propertyIndex) {
		if (!propertyIndex) {
			propertyIndex = 0;
		}
		return "skype:" + encodeURIComponent(semanticObject['tel'][propertyIndex]['value']);
	},
	getActionName: function(semanticObject, semanticObjectType, propertyIndex) {
		if (!propertyIndex) {
			propertyIndex = 0;
		}
		var out = "Call with Skype";
		if ((semanticObject['tel'][propertyIndex]['type'] != undefined) || (semanticObject['tel'][propertyIndex]['value'] != undefined)) {
			out = "";
			if (semanticObject['tel'][propertyIndex]['type'] != undefined)
			{
				out += semanticObject['tel'][propertyIndex]['type'][0] + ": "
			}
			if (semanticObject['tel'][propertyIndex]['value'] != undefined)
			{
				out += semanticObject['tel'][propertyIndex]['value'];
			}
		}
		return out;
	}
};
SemanticActions.add("skype", skype);