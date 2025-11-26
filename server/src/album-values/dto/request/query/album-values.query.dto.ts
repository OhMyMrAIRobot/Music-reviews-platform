import { Transform, Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsIn, IsInt, IsOptional } from 'class-validator';
import {
  ALBUM_VALUE_TIERS,
  AlbumValueTier,
} from 'src/album-values/types/album-values-tier.type';
import { IsSortOrder } from 'src/shared/decorators/is-sort-order.decorator';
import { SortOrder } from 'src/shared/types/sort-order.type';

const list = (arr: readonly (string | number)[]) => arr.join(', ');

/**
 * Query DTO for listing album values.
 *
 * Used by endpoints that return paginated album value summaries. All fields
 * are optional and control filtering, sorting and pagination of results.
 */
export class AlbumValuesQueryDto {
  /** Optional sort order for numeric fields (asc/desc). */
  @IsOptional()
  @IsSortOrder()
  sortOrder?: SortOrder;

  /**
   * Optional list of tier slugs to filter results to specific tiers.
   *
   * The input accepts a single comma-separated string or repeated query
   * parameters; values are normalized to lowercase. Allowed values are
   * defined in `ALBUM_VALUE_TIERS`.
   */
  @IsOptional()
  @Transform(({ value }) => parseTiers(value))
  @IsArray({ message: 'tiers должен быть массивом строк' })
  @ArrayUnique({ message: 'tiers не должен содержать дубликаты' })
  @IsIn(ALBUM_VALUE_TIERS, {
    each: true,
    message: `tiers может содержать только значения: ${list(ALBUM_VALUE_TIERS)}`,
  })
  tiers?: AlbumValueTier[];

  /** Optional integer limit for pagination. */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit должно быть целым числом' })
  limit?: number;

  /** Optional integer offset for pagination. */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'offset должно быть целым числом' })
  offset?: number;
}

/**
 * Normalizes incoming tiers query parameter into an array of lowercase
 * tier tokens or `undefined` when absent/empty.
 */
const parseTiers = (value: unknown): string[] | undefined => {
  if (value == null || value === '') return undefined;

  let tokens: string[] = [];

  if (Array.isArray(value)) {
    for (const v of value) {
      if (typeof v === 'string') {
        tokens.push(...v.split(','));
      }
    }
  } else if (typeof value === 'string') {
    tokens = value.split(',');
  } else {
    return undefined;
  }

  const normalized = tokens.map((s) => s.trim().toLowerCase()).filter(Boolean);

  return normalized.length ? normalized : undefined;
};
