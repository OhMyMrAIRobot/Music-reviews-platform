import { AuthorConfirmationDto } from './author-confirmation.dto';

/**
 * Paginated response envelope for author confirmations listing endpoints.
 *
 * `items` contains the current page of `AuthorConfirmationDto` entries while
 * `meta` provides collection-level metadata such as the total count.
 */
export class AuthorConfirmationsResponseDto {
  meta: MetaInfo;
  items: AuthorConfirmationDto[];
}

/** Basic pagination metadata shape. */
type MetaInfo = {
  /** Total number of confirmations matching the query. */
  count: number;
};
