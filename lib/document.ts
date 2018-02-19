/**
 * Created by user on 2018/2/19/019.
 */

import * as toughCookie from 'tough-cookie';

export class DocumentCookieStore extends toughCookie.Store
{
	document: Document;
	store: toughCookie.Store;
	cache: {
		cookies?: {
			[key: string]: string,
		},
	};

	constructor(doc = document, store?: toughCookie.Store)
	{
		super();

		this.document = doc;

		if (!this.document || !('cookie' in this.document))
		{
			throw new TypeError(`document must have document.cookie`);
		}

		this.store = store || new toughCookie.MemoryCookieStore();

		this.cache = {
			cookies: {},
		};
	}

	inspect()
	{
		let str = this.document.cookie.toString();

		return `DocumentCookieStore(${str})`;
	}

	getStatic<T = typeof DocumentCookieStore>(): T
	{
		// @ts-ignore
		return this.__proto__.constructor;
	}

	static parseDocumentCookie(cookies: string): { [key: string]: string }
	{
		return cookies
			.split(';')
			.reduce(function (a, b)
			{
				let cookie = toughCookie.Cookie.parse(b);
				a[cookie.key] = cookie.value;

				return a;
			}, {})
			;
	}

	_updateCache()
	{
		return this.cache.cookies = this.getStatic().parseDocumentCookie(this.document.cookie);
	}

	findCookie(domain: string, path: string, key: string, cb: ICallback<toughCookie.Cookie>)
	{
		let self = this;
		let data = this._updateCache();

		self._findCookie(domain, path, key, function (err, cookie)
		{
			cb(err, cookie);
		});
	}

	_findCookie(domain: string, path: string, key: string, cb: ICallback<toughCookie.Cookie>)
	{
		let self = this;
		let data = this.cache.cookies || {};

		self.store.findCookie(domain, path, key, function (err, cookie)
		{
			if (!cookie && data.hasOwnProperty(key))
			{
				cookie = new toughCookie.Cookie({
					key,
					value: data[key],
				});
			}

			if (cookie)
			{
				cookie.value = data[key];
			}

			cb(err, cookie);
		});
	}

	findCookies(domain: string, path: string, cb: ICallback<toughCookie.Cookie[]>)
	{
		let self = this;
		let data = this._updateCache();

		let arr = [] as toughCookie.Cookie[];

		let parr = Object.keys(data)
			.map(function (key, index)
			{
				return new Promise(function (resolve, reject)
				{
					self._findCookie(domain, path, key, function (err, cookie)
					{
						arr[index] = cookie;
						resolve(cookie);
					});
				});
			})
		;

		Promise.all(parr)
			.then(function ()
			{
				arr = arr.filter(function (v)
				{
					return v !== null;
				});

				cb(null, arr);
			})
			.catch(function (err)
			{
				cb(err);
			})
		;
	}

	putCookie(cookie: toughCookie.Cookie, cb: ICallback<toughCookie.Cookie>)
	{
		try
		{
			this.document.cookie = cookie.toString();
			this.store.putCookie(cookie, function (err)
			{
				cb(err, cookie);
			});
		}
		catch (err)
		{
			cb(err);
		}
	}

	updateCookie(oldCookie: toughCookie.Cookie, newCookie: toughCookie.Cookie, cb: ICallback)
	{
		try
		{
			this.document.cookie = newCookie.toString();

			[
				'domain',
				'path',
				'secure',
				'httpOnly',
			].forEach(function (key)
			{
				newCookie[key] = newCookie[key] || oldCookie[key] || newCookie[key];
			});

			this.store.updateCookie(oldCookie, newCookie, cb);
		}
		catch (err)
		{
			cb(err);
		}
	}

	removeCookie(domain: string, path: string, key: string, cb: ICallback)
	{
		try
		{
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
		catch (err)
		{
			cb(err);
		}
	}

	getAllCookies(cb: ICallback<toughCookie.Cookie[]>)
	{
		let self = this;
		let data = this._updateCache();

		new Promise(function (resolve, reject)
		{
			self.store.getAllCookies(function (err, cookies: toughCookie.Cookie[])
			{
				resolve(cookies);
			})
		})
			.then(function (cookies: toughCookie.Cookie[])
			{
				let c = cookies
					.reduce(function (a, b)
					{
						a[b.key] = b;

						return a;
					}, {})
				;

				return Object.keys(data)
					.reduce(function (a, key)
					{
						let cookie = c[key] || new toughCookie.Cookie({
							key,
							value: data[key],
						});

						cookie.value = data[key];

						a.push(cookie);

						return a;
					}, [] as toughCookie.Cookie[])
					;
			})
			.then(function (arr)
			{
				cb(null, arr)
			})
			.catch(function (err)
			{
				cb(err);
			})
		;
	}
}

/**
 * @alias DocumentCookieStore
 * @type {DocumentCookieStore}
 */
export const Store = DocumentCookieStore;

export interface ICallback<T = any>
{
	(err: Error | null, argv1?: T | null): void,
}

export default DocumentCookieStore;
