/**
 * Data transfer object for creating a `ReleaseMedia` record.
 *
 * This DTO represents the payload used internally when creating a
 * release media entry. Fields correspond to the database columns and
 * related entities.
 */
export class CreateReleaseMediaDto {
  /** Human-readable title of the media item. */
  title: string;

  /** Publicly accessible URL of the media. */
  url: string;

  /** Identifier of the release this media belongs to. */
  releaseId: string;

  /** Optional id of the user who uploaded/submitted the media. */
  userId?: string;

  /** Foreign key referencing `ReleaseMediaType`. */
  releaseMediaTypeId: string;

  /** Foreign key referencing `ReleaseMediaStatus`. */
  releaseMediaStatusId: string;
}
