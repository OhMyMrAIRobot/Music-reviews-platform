/**
 * Internal DTO representing the minimal data required to create an
 * author confirmation record in the system.
 *
 * This DTO is used by services to carry the validated payload and related
 * identifiers when creating the entity in the persistence layer.
 */
export class CreateAuthorConfirmationDto {
  /** Id of the user who submits the confirmation. */
  userId: string;

  /** Id of the author being confirmed. */
  authorId: string;

  /** Textual confirmation content provided by the user. */
  confirmation: string;

  /** Initial status id for the created confirmation (e.g. 'pending'). */
  statusId: string;
}
