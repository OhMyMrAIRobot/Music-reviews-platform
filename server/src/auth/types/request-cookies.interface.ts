import { Request } from 'express';

export interface IRequestWithCookies extends Request {
  cookies: { [key: string]: string };
}
