/**
 * ReleasesSortFieldsEnum — enumeration of fields that can be used * * to sortthe releases list.
 */
export enum ReleasesSortFieldsEnum {
	/** Sort by publication date */
	PUBLISHED = 'published',
	/** Number of reviews without text */
	WITHOUT_TEXT_COUNT = 'withoutTextCount',
	/** Number of reviews with text */
	TEXT_COUNT = 'withTextCount',
	/** Rating by media reviews */
	MEDIA_RATING = 'mediaRating',
	/** Total count (withText + withoutText) */
	TOTAL_COUNT = 'totalCount',
	/** Rating without text */
	WITHOUT_TEXT_RATING = 'withoutTextRating',
	/** Rating with text */
	WITH_TEXT_RATING = 'withTextRating',
	/** Aggregate rating (all types combined) */
	ALL_RATING = 'allRating',
}
