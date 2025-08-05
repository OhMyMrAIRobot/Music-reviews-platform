/* eslint-disable no-useless-escape */
export const parseYoutubeId = (url: string) => {
	const [a, , b] = url
		.replace(/(>|<)/gi, '')
		.split(
			/^.*(?:(?:youtu\.?be(\.com)?\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/
		)
	if (b !== undefined) {
		return b.split(/[^0-9a-z_-]/i)[0]
	} else {
		return a
	}
}
