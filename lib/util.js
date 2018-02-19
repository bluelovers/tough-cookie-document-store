"use strict";
/**
 * Created by user on 2018/2/19/019.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
exports.urlParse = url_1.parse;
const tough_cookie_1 = require("tough-cookie");
exports.canonicalDomain = tough_cookie_1.canonicalDomain;
exports.defaultPath = tough_cookie_1.defaultPath;
function getCookieContext(url) {
    if (url instanceof Object) {
        return url;
    }
    // NOTE: decodeURI will throw on malformed URIs (see GH-32).
    // Therefore, we will just skip decoding for such URIs.
    try {
        url = decodeURI(url);
    }
    catch (err) {
        // Silently swallow error
    }
    return url_1.parse(url);
}
exports.getCookieContext = getCookieContext;
function lazyCanonica(url) {
    let context = getCookieContext(url);
    let host = tough_cookie_1.canonicalDomain(context.hostname);
    let path = tough_cookie_1.defaultPath(context.pathname);
    return {
        context,
        host,
        path,
    };
}
exports.lazyCanonica = lazyCanonica;
const self = require("./util");
exports.default = self;
