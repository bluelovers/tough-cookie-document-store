"use strict";
/**
 * Created by user on 2018/2/19/019.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const toughCookie = require("tough-cookie");
class DocumentCookieStore extends toughCookie.Store {
    constructor(doc = document, store) {
        super();
        this.document = doc;
        if (!this.document || 'cookie' in this.document) {
            throw new TypeError(`document must have document.cookie`);
        }
        this.store = store || new toughCookie.MemoryCookieStore();
        this.cache = {
            cookies: {},
        };
    }
    inspect() {
        let str = this.document.cookie.toString();
        return `DocumentCookieStore(${str})`;
    }
    getStatic() {
        // @ts-ignore
        return this.__proto__.constructor;
    }
    static parseDocumentCookie(cookies) {
        return cookies
            .split(';')
            .reduce(function (a, b) {
            let cookie = toughCookie.Cookie.parse(b);
            a[cookie.key] = cookie.value;
            return a;
        }, {});
    }
    _updateCache() {
        return this.cache.cookies = this.getStatic().parseDocumentCookie(this.document.cookie);
    }
    findCookie(domain, path, key, cb) {
        let self = this;
        let data = this._updateCache();
        self._findCookie(domain, path, key, function (err, cookie) {
            cb(err, cookie);
        });
    }
    _findCookie(domain, path, key, cb) {
        let self = this;
        let data = this.cache.cookies || {};
        self.store.findCookie(domain, path, key, function (err, cookie) {
            if (!cookie && data.hasOwnProperty(key)) {
                cookie = new toughCookie.Cookie({
                    key,
                    value: data[key],
                });
            }
            if (cookie) {
                cookie.value = data[key];
            }
            cb(err, cookie);
        });
    }
    findCookies(domain, path, cb) {
        let self = this;
        let data = this._updateCache();
        let arr = [];
        let parr = Object.keys(data)
            .map(function (key, index) {
            return new Promise(function (resolve, reject) {
                self._findCookie(domain, path, key, function (err, cookie) {
                    arr[index] = cookie;
                    resolve(cookie);
                });
            });
        });
        Promise.all(parr)
            .then(function () {
            arr = arr.filter(function (v) {
                return v !== null;
            });
            cb(null, arr);
        })
            .catch(function (err) {
            cb(err);
        });
    }
    putCookie(cookie, cb) {
        try {
            this.document.cookie = cookie.toString();
            this.store.putCookie(cookie, cb);
        }
        catch (err) {
            cb(err);
        }
    }
    updateCookie(oldCookie, newCookie, cb) {
        try {
            this.document.cookie = newCookie.toString();
            [
                'domain',
                'path',
                'secure',
                'httpOnly',
            ].forEach(function (key) {
                newCookie[key] = newCookie[key] || oldCookie[key] || newCookie[key];
            });
            this.store.updateCookie(oldCookie, newCookie, cb);
        }
        catch (err) {
            cb(err);
        }
    }
    removeCookie(domain, path, key, cb) {
        try {
            let expires = new Date();
            expires.setTime(expires.getTime() + (-360 * 24 * 60 * 60 * 1000));
            let cookie = new toughCookie.Cookie({
                key,
                domain,
                path,
                expires,
            });
            this.document.cookie = cookie.toString();
            this.store.removeCookie(domain, path, key, cb);
        }
        catch (err) {
            cb(err);
        }
    }
    getAllCookies(cb) {
        let self = this;
        let data = this._updateCache();
        new Promise(function (resolve, reject) {
            self.store.getAllCookies(function (err, cookies) {
                resolve(cookies);
            });
        })
            .then(function (cookies) {
            let c = cookies
                .reduce(function (a, b) {
                a[b.key] = b;
                return a;
            }, {});
            return Object.keys(data)
                .reduce(function (a, key) {
                let cookie = c[key] || new toughCookie.Cookie({
                    key,
                    value: data[key],
                });
                cookie.value = data[key];
                a.push(cookie);
                return a;
            }, []);
        })
            .then(function (arr) {
            cb(null, arr);
        })
            .catch(function (err) {
            cb(err);
        });
    }
}
exports.DocumentCookieStore = DocumentCookieStore;
/**
 * @alias DocumentCookieStore
 * @type {DocumentCookieStore}
 */
exports.Store = DocumentCookieStore;
exports.default = DocumentCookieStore;
