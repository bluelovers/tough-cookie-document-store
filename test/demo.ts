/**
 * Created by user on 2018/2/19/019.
 */

import { createJSDOM } from 'jsdom-extra';
import { DocumentCookieStore } from '../';
import * as toughCookie from 'tough-cookie';

let jsdom = createJSDOM();

let document = jsdom.document;

let store: DocumentCookieStore;

if (typeof document != 'undefined' && document)
{
	// if ur document not a global, this can help
	store = new DocumentCookieStore(document);
}
else
{
	// will auto use global document
	store = new DocumentCookieStore();
}

let jar = new toughCookie.CookieJar(store);

// ... anything u wanna do
