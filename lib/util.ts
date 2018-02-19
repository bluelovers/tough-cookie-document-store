/**
 * Created by user on 2018/2/19/019.
 */

import { parse as urlParse } from 'url';
import { canonicalDomain, defaultPath } from 'tough-cookie';

export { canonicalDomain, defaultPath }

export declare function urlParse(url: string, parseQueryString?: boolean, slashesDenoteHost?: boolean): IUrlParse;

export { urlParse }

export function getCookieContext(url: string | Partial<IUrlParse>): IUrlParse
{
	if (url instanceof Object)
	{
		return url as IUrlParse;
	}
	// NOTE: decodeURI will throw on malformed URIs (see GH-32).
	// Therefore, we will just skip decoding for such URIs.
	try
	{
		url = decodeURI(url);
	}
	catch (err)
	{
		// Silently swallow error
	}

	return urlParse(url);
}

export function lazyCanonica(url: string | Partial<IUrlParse>)
{
	let context = getCookieContext(url);
	let host = canonicalDomain(context.hostname);
	let path = defaultPath(context.pathname);

	return {
		context,
		host,
		path,
	}
}

export interface IUrlParse
{
	protocol: string,
	slashes: string,
	auth: string,
	host: string,
	port: string,
	hostname: string,
	hash: string,
	search: string,
	query,
	pathname: string,
	path: string,
	href: string,
}

import * as self from './util';
export default self;
