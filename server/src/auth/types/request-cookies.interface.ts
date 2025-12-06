import { Request } from 'express';

/**
 * Express Request extension that exposes parsed cookies.
 *
 * Some authentication helpers rely on reading tokens from cookies; this
 * interface documents the shape expected by those handlers.
 */
export interface IRequestWithCookies extends Request {
  /** Map of cookie names to their string values (parsed by cookie-parser) */
  cookies: { [key: string]: string };
}
