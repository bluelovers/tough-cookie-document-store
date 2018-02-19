/**
 * Created by user on 2018/2/19/019.
 */
import * as toughCookie from 'tough-cookie';
export declare class DocumentCookieStore extends toughCookie.Store {
    document: Document;
    store: toughCookie.Store;
    cache: {
        cookies?: {
            [key: string]: string;
        };
    };
    constructor(doc?: Document, store?: toughCookie.Store);
    inspect(): string;
    getStatic<T = typeof DocumentCookieStore>(): T;
    static parseDocumentCookie(cookies: string): {
        [key: string]: string;
    };
    _updateCache(): {
        [key: string]: string;
    };
    findCookie(domain: string, path: string, key: string, cb: ICallback<toughCookie.Cookie>): void;
    _findCookie(domain: string, path: string, key: string, cb: ICallback<toughCookie.Cookie>): void;
    /**
     * @async
     * @param {string} domain
     * @param {string} path
     * @param {ICallback<Cookie[]>} cb
     */
    findCookies(domain: string, path: string, cb: ICallback<toughCookie.Cookie[]>): void;
    putCookie(cookie: toughCookie.Cookie, cb: ICallback<toughCookie.Cookie>): void;
    updateCookie(oldCookie: toughCookie.Cookie, newCookie: toughCookie.Cookie, cb: ICallback): void;
    removeCookie(domain: string, path: string, key: string, cb: ICallback): void;
    /**
     * @async
     * @param {ICallback<Cookie[]>} cb
     */
    getAllCookies(cb: ICallback<toughCookie.Cookie[]>): void;
}
/**
 * @alias DocumentCookieStore
 * @type {DocumentCookieStore}
 */
export declare const Store: typeof DocumentCookieStore;
export interface ICallback<T = any> {
    (err: Error | null, argv1?: T | null): void;
}
export default DocumentCookieStore;
