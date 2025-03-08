import { JwtPayload } from './JwtPayload';

export interface IAuthenticatedRequest extends Request {
  user: JwtPayload;
}
