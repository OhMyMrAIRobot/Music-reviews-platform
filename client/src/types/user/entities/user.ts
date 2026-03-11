import { Role } from '.';

/**
 * Represents an `User` entity
 */
export type User = {
  /** Unique user identifier */
  id: string;

  /** User's email address */
  email: string;

  /** User's nickname */
  nickname: string;

  /** Indicates if user's account is active */
  isActive: boolean;

  /** ISO timestamp of user creation */
  createdAt: string;

  /** User's role */
  role: Role;

  /** List of authors the user is registered with */
  registeredAuthor: RegisteredAuthor[];
};

/**
 * Registered author relation
 *
 * Represents a link between a user and a registered author entity.
 */
type RegisteredAuthor = {
  id: string;
  userId: string;
  authorId: string;
};
