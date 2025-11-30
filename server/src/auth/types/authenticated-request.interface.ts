import { IJwtAuthPayload } from './jwt-auth-payload.interface';

/**
 * Express request augmented with authenticated user payload.
 *
 * Controllers and guards use this interface to access the decoded JWT
 * payload attached by authentication middleware.
 */
export interface IAuthenticatedRequest extends Request {
  /** Decoded JWT payload attached by authentication guard */
  user: IJwtAuthPayload;
}
