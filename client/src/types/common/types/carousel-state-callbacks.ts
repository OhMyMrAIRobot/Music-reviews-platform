/**
 * Type representing callbacks for carousel state changes, allowing components to react to scrollability changes.
 */
export type CarouselStateCallbacks = {
	/**
	 * Callback invoked when the ability to scroll to the previous item changes.
	 * @param canScroll - True if scrolling to the previous item is possible, false otherwise.
	 */
	onCanScrollPrevChange: (canScroll: boolean) => void
	/**
	 * Callback invoked when the ability to scroll to the next item changes.
	 * @param canScroll - True if scrolling to the next item is possible, false otherwise.
	 */
	onCanScrollNextChange: (canScroll: boolean) => void
}
