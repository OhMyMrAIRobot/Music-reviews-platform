import { Expose, Type } from 'class-transformer';
import { UserDetailsDto } from './user.dto';

/**
 * Response wrapper for the users listing endpoint.
 *
 * Contains a `meta` object with pagination/count information and an
 * array of `items` serialized with `UserDetailsDto`.
 */
export class UsersResponseDto {
  @Expose()
  meta: MetaInfo;

  @Expose()
  @Type(() => UserDetailsDto)
  items: UserDetailsDto[];
}

/**
 * Meta information returned alongside list responses.
 */
class MetaInfo {
  @Expose()
  count: number;
}
