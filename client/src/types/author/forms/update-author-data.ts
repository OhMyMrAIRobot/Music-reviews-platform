import { CreateAuthorData } from "./create-author-data";

/**
 * Describes form data for updating an existing author.
 *
 * Extends the `CreateAuthorRequest` as a partial type
 * so all create fields are optional for updates.
 * Additionally allows two boolean flags to request clearing
 * the stored avatar or cover images.
 */
export type UpdateAuthorData = Partial<CreateAuthorData> & {
  /**
   * If true, the author's avatar will be cleared/removed.
   */

  clearAvatar?: boolean;
  /**
   * If true, the author's cover image will be cleared/removed.
   */
  clearCover?: boolean;
};
