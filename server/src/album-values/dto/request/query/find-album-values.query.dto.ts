import { Transform, Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsIn, IsInt, IsOptional } from 'class-validator';
import {
  ALBUM_VALUE_TIERS,
  AlbumValueTier,
} from 'src/album-values/types/album-values-tier.type';
import { IsSortOrder } from 'src/shared/decorators/is-sort-order.decorator';
import { SortOrder } from 'src/shared/types/sort-order.type';

const list = (arr: readonly (string | number)[]) => arr.join(', ');

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

export class FindAlbumValuesQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit должно быть целым числом' })
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'offset должно быть целым числом' })
  offset?: number;

  @IsOptional()
  @IsSortOrder()
  order?: SortOrder;

  @IsOptional()
  @Transform(({ value }) => parseTiers(value))
  @IsArray({ message: 'tiers должен быть массивом строк' })
  @ArrayUnique({ message: 'tiers не должен содержать дубликаты' })
  @IsIn(ALBUM_VALUE_TIERS, {
    each: true,
    message: `tiers может содержать только значения: ${list(ALBUM_VALUE_TIERS)}`,
  })
  tiers?: AlbumValueTier[];
}
