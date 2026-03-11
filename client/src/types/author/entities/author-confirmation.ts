import { AuthorConfirmationStatus } from '.';

/**
 * Represents a single author confirmation entity.
 */
export type AuthorConfirmation = {
  /** Confirmation unique identifier. */
  id: string;

  /** Text of the confirmation. */
  confirmation: string;

  /** ISO timestamp when the confirmation was created. */
  createdAt: string;

  /** Nested user information for the confirmation author. */
  user: User;

  /** Nested author information being confirmed. */
  author: Author;

  /** Current status object for the confirmation. */
  status: AuthorConfirmationStatus;
};

interface User {
  id: string;
  nickname: string;
  avatar: string;
}

interface Author {
  id: string;
  name: string;
  img: string;
}
