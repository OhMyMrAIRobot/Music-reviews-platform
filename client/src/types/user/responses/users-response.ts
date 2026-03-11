import { UserDetails } from '../entities';

/**
 * Response wrapper for the users listing endpoint.
 *
 * Contains a `meta` object with pagination/count information and an
 * array of `items` serialized with `UserDetails`.
 */
export type UsersResponse = {
  meta: MetaInfo;
  items: UserDetails[];
};

/**
 * Meta information returned alongside list responses.
 */
type MetaInfo = {
  count: number;
};
