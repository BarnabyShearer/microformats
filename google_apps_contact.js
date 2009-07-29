var add_google_contact_login_details = {email: false, password: false, auth_token: false};

/**
 * A helper method to send http requests to the google services.
 */
function add_google_contact_send_request(method, url, content, auth, content_type) {
    request = new XMLHttpRequest();

    request.open(method, url, false);

    if (auth) {
        request.setRequestHeader("Authorization", "GoogleLogin auth=" + auth);
    }

    if (content_type) {
        request.setRequestHeader("Content-type", content_type);
    }

        try {
                request.send(content);

                if (request.status == 200 || request.status == 201 || request.status == 409) {
                        return request.responseText;
                }
                dump(request.status);
                dump(request.responseText);
        } catch (ex) {
                dump(ex);
        }

    return null;
}

/**
 * Extracts information out from a hCard semantic object
 * and returns a google-friendly XML representation.
 */
function add_google_contact_create_xml_from_vcard(hcard) {
    var i;
    var full_address;
    var email;
    var tel;
    var url;
    var xml = "";

    xml += "<atom:entry xmlns:atom='http://www.w3.org/2005/Atom' xmlns:gd='http://schemas.google.com/g/2005'>" + "\n";
    xml += "  <atom:category scheme='http://schemas.google.com/g/2005#kind' term='http://schemas.google.com/contact/2008#contact' />" + "\n";

    //Parse name
    xml += "  <atom:title type='text'>" + hcard.fn + "</atom:title> " + "\n";

    xml += "  <atom:content type='text'>Notes</atom:content>" + "\n";

    if (hcard.email) {
        for (i = 0; i < hcard.email.length; i++) {
            email = hcard.email[i];

            type = 'home';
            if (email.type && email.type[0] == 'work') {
                type = 'work';
            }

            xml += "     <gd:email rel='http://schemas.google.com/g/2005#" + type + "' address='" + email.value + "' />" + "\n";
        }
    }


    if (hcard.tel) {
        for (i = 0; i < hcard.tel.length; i++) {
            tel = hcard.tel[i];

            type = 'home';
            if (tel.type && tel.type[0] == 'work') {
                type = 'work';
            }
            xml += "     <gd:phoneNumber rel='http://schemas.google.com/g/2005#" + type + "'>"  + tel.value + "</gd:phoneNumber>" + "\n";
        }
    }

    
    if (hcard.adr) {
        for (i = 0; i < hcard.adr.length; i++) {
            adr = hcard.adr[i];
            full_address = "";
            if (adr["street-address"]) {
                full_address += adr["street-address"] + " ";
            }

            if (adr["locality"]) {
                full_address += adr["locality"] + " ";
            }

            if (adr["region"]) {
                full_address += adr["region"] + " ";
            }

            if (adr["postal-code"]) {
                full_address += adr["postal-code"] + " ";
            }

            if (adr["country-name"]) {
                full_address += adr["country-name"] + " ";
            }

            if (full_address != "") {
                xml += "     <gd:postalAddress rel='http://schemas.google.com/g/2005#work'>" + full_address + "</gd:postalAddress>" + "\n";
            }
        }
    }


    xml += "</atom:entry>" + "\n";

    return xml;
}

/**
 * Send a create contact request for the email & auth_token provided.
 *
 * The contact is described in xml.
 *
 * @see add_google_contact_create_xml_from_vcard()
 */
function add_google_contact_create_contact(email_address, auth_token, xml) {
    url = 'http://www.google.com/m8/feeds/contacts/' + escape(email_address) + "/base";

    return add_google_contact_send_request("POST", url, xml, auth_token, "application/atom+xml");
}

/**
 * Fetch an authorisation token for a given
 * username and password
 *
 * @return An authorisation token string
 */
function add_google_contact_login(username, password) {
    var url = 'https://www.google.com/accounts/ClientLogin';
    var content = "";

    content  += "accountType=HOSTED_OR_GOOGLE";
    content  += "&Email="  + username;
    content  += "&Passwd=" + password;
    content  += "&service=cp";
    content  += "&source=NoCompany-Operator-0.1";


    response = add_google_contact_send_request("POST", url, content, null, "application/x-www-form-urlencoded");


    // Sample response
    /*
    HTTP/1.0 200 OK
    Server: GFE/1.3
    Content-Type: text/plain

    SID=DQAAAGgA...7Zg8CTN
    LSID=DQAAAGsA...lk8BBbG
    Auth=DQAAAGgA...dk3fA5N
    */
    if (response) {
        parts = response.split("\n");
        return parts[2].substring(5);
    }

    return null;
}

function add_google_contact_get_login_details() {
    return {email: 'barnaby@iware.co.uk', password: 'ldttots42', auth_token: false};
}


var add_google_contact = {
    description: "Add to Google Contacts",
    shortDescription: "Add Google Contact",
    scope: {
        semantic: {
          "hCard" : "fn"
        }
    },
    doAction: function(semanticObject, semanticObjectType, propertyIndex) {
                //Do we have login details?
                if (add_google_contact_login_details.email == false) {
                        add_google_contact_login_details = add_google_contact_get_login_details();

                        //If the user cancelled finding them...
                        if (add_google_contact_login_details.email == false) {
                                return false
                        }
                }

        if (!add_google_contact_login_details.auth_token) {
            add_google_contact_login_details.auth_token = add_google_contact_login(add_google_contact_login_details.email,
                                                                                                                                                                        add_google_contact_login_details.password);
        }

        xml = add_google_contact_create_xml_from_vcard(semanticObject);

        result = add_google_contact_create_contact(add_google_contact_login_details.email, add_google_contact_login_details.auth_token, xml);
    }
};

SemanticActions.add("add_google_contact", add_google_contact);
