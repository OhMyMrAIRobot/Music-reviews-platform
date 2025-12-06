import { UserRoleEnum } from '../../roles/types/user-role.enum';

/**
 * JWT payload returned after successful authentication.
 *
 * This interface describes the minimal fields embedded into access
 * tokens that downstream guards and controllers rely on.
 */
export interface IJwtAuthPayload {
  /** Unique user identifier */
  id: string;

  /** User email address */
  email: string;

  /** User display nickname */
  nickname: string;

  /** User role (one of `UserRoleEnum`) */
  role: UserRoleEnum;

  /** Whether the user's account is active */
  isActive: boolean;
}
