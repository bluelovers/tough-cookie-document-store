/**
 * Created by user on 2018/2/19/019.
 */
import { parse as urlParse } from 'url';
import { canonicalDomain, defaultPath } from 'tough-cookie';
export { canonicalDomain, defaultPath };
export declare function urlParse(url: string, parseQueryString?: boolean, slashesDenoteHost?: boolean): IUrlParse;
export { urlParse };
export declare function getCookieContext(url: string | Partial<IUrlParse>): IUrlParse;
export declare function lazyCanonica(url: string | Partial<IUrlParse>): {
    context: self.IUrlParse;
    host: string;
    path: string;
};
export interface IUrlParse {
    protocol: string;
    slashes: string;
    auth: string;
    host: string;
    port: string;
    hostname: string;
    hash: string;
    search: string;
    query: any;
    pathname: string;
    path: string;
    href: string;
}
import * as self from './util';
export default self;
