/**
 * Created by user on 2018/2/19/019.
 */

import { createJSDOM } from 'jsdom-extra';
import { DocumentCookieStore } from '../';
import * as toughCookie from 'tough-cookie';

let jsdom = createJSDOM();

let document = jsdom.document;

console.log(document, typeof document.cookie);

let store = new DocumentCookieStore(document);

store.putCookie(new toughCookie.Cookie({
	key: 'test',
	value: 'v',
}), function (err, cookie)
{


	console.log('putCookie', cookie, cookie.toString());
});

console.dir(store);
console.log(store);

store.getAllCookies(function (err, cookies)
{
	console.log('getAllCookies', cookies);
});

console.log(['document.cookie', document.cookie]);
