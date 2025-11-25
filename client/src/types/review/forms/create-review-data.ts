/**
 * CreateReviewRequestDto
 *
 * Request body for creating a review.
 */
export type CreateReviewData = {
	/** Optional title for the review (string, 10..100 chars) */
	title?: string

	/** Optional review text (string, 300..8500 chars) */
	text?: string

	/** Score for rhymes / imagery (1..10) */
	rhymes: number

	/** Score for structure / rhythm (1..10) */
	structure: number

	/** Score for style realization (1..10) */
	realization: number

	/** Score for individuality / charisma (1..10) */
	individuality: number

	/** Score for atmosphere / vibe (1..10) */
	atmosphere: number

	/** Target release id for the review */
	releaseId: string
}
