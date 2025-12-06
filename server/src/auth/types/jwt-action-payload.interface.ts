import { JwtActionEnum } from './jwt-action.enum';

/**
 * Payload shape used for action-specific JWTs (activation / reset).
 *
 * These tokens embed the target `id` and `email` together with a
 * `type` indicating the specific action the token represents.
 */
export interface IJwtActionPayload {
  /** Target user id the action applies to */
  id: string;

  /** Target user email */
  email: string;

  /** Action type carried by the token */
  type: JwtActionEnum;
}
