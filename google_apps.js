/* localizeISO8601 */ 
var google_apps_calendar = {
  description: "Add to iWare Google Calendar",
  shortDescription: "GCal (+)",
  icon: "http://www.google.com/calendar/images/favicon.ico",
  scope: {
    semantic: {
      "hCalendar" : "dtstart"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    var url;
    if (semanticObjectType == "hCalendar") {
      var hcalendar = semanticObject;
      url = "http://www.google.com/calendar/hosted/iware.co.uk/event?action=TEMPLATE";
      var date, time;
      if (hcalendar.dtstart) {
        url += "&";
        url += "dates="
        /* If the date has a Z or nothing, use it as is (remove punctation) */
        /* If it has an offset, convert to Z */
        var T = hcalendar.dtstart.indexOf("T");
        if (T > -1) {
          var tzpos = hcalendar.dtstart.lastIndexOf("+");
          if (tzpos == -1) {
            tzpos = hcalendar.dtstart.lastIndexOf("-");
          }
          if (tzpos > T) {
            var js_date = Microformats.dateFromISO8601(hcalendar.dtstart.substr(0, tzpos-1));
            var tzhours = parseInt(hcalendar.dtstart.substr(tzpos+1, 2), 10);
            var tzminutes = parseInt(hcalendar.dtstart.substr(tzpos+3, 2), 10);
            if (hcalendar.dtstart.charAt(tzpos) == "-") {
              js_date.setHours(js_date.getHours()+tzhours);
              js_date.setMinutes(js_date.getMinutes()+tzminutes);
            } else if (hcalendar.dtstart.charAt(tzpos) == "+") {
              js_date.setHours(js_date.getHours()-tzhours);
              js_date.setMinutes(js_date.getMinutes()-tzminutes);
            }
            var dtstart = Microformats.iso8601FromDate(js_date, true);
            date = dtstart.substr(0, T);
            time = dtstart.substr(T) + "Z";
          } else {
            date = hcalendar.dtstart.substr(0, T);
            time = hcalendar.dtstart.substr(T);
          }
          dtstart = date + time;
        } else {
          dtstart = hcalendar.dtstart;
        }
        /* This will need to change if Google ever supports TZ offsets */
        dtstart = dtstart.replace(/-/g,"").replace(/:/g,"");
        url += dtstart;
        url += "/";
        if (hcalendar.dtend) {
          var T = hcalendar.dtend.indexOf("T");
          if (T > -1) {
            var tzpos = hcalendar.dtend.lastIndexOf("+");
            if (tzpos == -1) {
              tzpos = hcalendar.dtend.lastIndexOf("-");
            }
            if (tzpos > T) {
              var js_date = Microformats.dateFromISO8601(hcalendar.dtend.substr(0, tzpos-1));
              var tzhours = parseInt(hcalendar.dtend.substr(tzpos+1, 2), 10);
              var tzminutes = parseInt(hcalendar.dtend.substr(tzpos+3, 2), 10);
              if (hcalendar.dtend.charAt(tzpos) == "-") {
                js_date.setHours(js_date.getHours()+tzhours);
                js_date.setMinutes(js_date.getMinutes()+tzminutes);
              } else if (hcalendar.dtend.charAt(tzpos) == "+") {
                js_date.setHours(js_date.getHours()-tzhours);
                js_date.setMinutes(js_date.getMinutes()-tzminutes);
              }
              var dtend = Microformats.iso8601FromDate(js_date, true);
              date = dtend.substr(0, T);
              time = dtend.substr(T) + "Z";
            } else {
              date = hcalendar.dtend.substr(0, T);
              time = hcalendar.dtend.substr(T);
            }
            dtend = date + time;
          } else {
            if ((!Operator.upcomingBugFixed) &&
                ((content.document.location.href.indexOf("http://upcoming.yahoo.com") == 0))) {
                dtend = hcalendar.dtend.replace(/-/g, "");
                dtend = (parseInt(dtend, 10)+1).toString();
            } else {
              dtend = hcalendar.dtend;
            }
            /* if dtstart had a time, dtend must have a time - google bug? */
            if (dtstart.indexOf("T") > -1) {
              dtend += dtstart.substr(dtstart.indexOf("T"));
            }
          }
          /* This will need to change if Google ever supports TZ offsets */
          url += dtend.replace(/-/g,"").replace(/:/g,"");
        } else {
          url += dtstart;
        }
      }
      url += "&";
      url += "text=" + encodeURIComponent(hcalendar.summary);
      if (hcalendar.location) {
        if (typeof hcalendar.location == "object") {
          var j = 0;
          url += "&";
          url += "location=";
          if (hcalendar.location.fn) {
            url += encodeURIComponent(hcalendar.location.fn);
          }
          if (hcalendar.location.adr[j]["street-address"]) {
            if (hcalendar.location.fn) {
              url += ", ";
            }
            url += encodeURIComponent(hcalendar.location.adr[j]["street-address"][0]);
          }
          if (hcalendar.location.adr[j].locality) {
            url += ", ";
            url += encodeURIComponent(hcalendar.location.adr[j].locality);
          }
          if (hcalendar.location.adr[j].region) {
            url += ", ";
            url += encodeURIComponent(hcalendar.location.adr[j].region);
          }
          if (hcalendar.location.adr[j]["postal-code"]) {
            url += " ";
            url += hcalendar.location.adr[j]["postal-code"];
          }
          if (hcalendar.location.adr[j]["country-name"]) {
            url += ",";
            url += encodeURIComponent(hcalendar.location.adr[j]["country-name"]);
          }
        } else {
          url += "&";
          url += "location=" + encodeURIComponent(hcalendar.location);
        }
      }
      if (hcalendar.description) {
        url += "&";
        var s = hcalendar.description.toHTML();
        url += "details=" + encodeURIComponent(s.substr(0,1024));
        if (s.length > 1024) {
          url += "...";
        }
      }
    }
    return url;
  }
};

SemanticActions.add("google_apps_calendar", google_apps_calendar);
