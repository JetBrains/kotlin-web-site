/**
 * Created by hadihariri on 05/11/13.
 */

function notNull(obj) {
    return !(obj == null && obj == undefined);
}

function generateServerUrl(baseUrl, sessionId, type, args) {
    return baseUrl + "kotlinServer?sessionId=" + sessionId + "&type=" + type + "&args=" + args;
}

function generateRandomId(prefix) {
    var numRand = Math.floor(Math.random()*101)
    return 'replGenerated' + prefix + numRand;
}

function replaceAll(str, replaced, replacement) {
    try {
        return str.replace(new RegExp(replaced, 'g'), replacement)
    } catch (e) {
        return str;
    }
}

function unEscapeString(str) {
    str = replaceAll(str, "&amp;", "&");
    return str;
}