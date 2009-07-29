var isbn_amazon = {
  description: "Show with Amazon",
  icon: "http://www.lespetitescases.net/images/livre.png",	
  scope: {
    semantic: {
      "RDF" :  {
        property : "http://purl.org/dc/elements/1.1/identifier",
        defaultNS : "http://purl.org/dc/elements/1.1/",
      }
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObjectType == "RDF") {
      var dc = semanticObject;
      var urn = String(dc["identifier"]);
      var test = urn.match(/(\urn:isbn:*)/);
	if (test != null) {	
      var isbn = urn.substr(9);
      return "http://amazon.fr/dp/" + isbn + "/";
	}
    }
  }
};
var isbn_librarything = {
  description: "Show with Library thing",	
  icon: "http://www.lespetitescases.net/images/livre.png",	
  scope: {
    semantic: {
      "RDF" :  {
        property : "http://purl.org/dc/elements/1.1/identifier",
        defaultNS : "http://purl.org/dc/elements/1.1/"
      }
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObjectType == "RDF") {
      var dc = semanticObject;
      var urn = String(dc["identifier"]);
      var test = urn.match(/(\urn:isbn:*)/);
	if (test != null) {	
      var isbn = urn.substr(9);
      return "http://www.librarything.com/isbn/" + isbn;
	}
    }
  }
};

SemanticActions.add("isbn_amazon", isbn_amazon);
SemanticActions.add("isbn_librarything", isbn_librarything);
