import { IJwtAuthPayload } from './jwt-auth-payload.interface';

export interface IAuthenticatedRequest extends Request {
  user: IJwtAuthPayload;
}
