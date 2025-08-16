import { AuthorConfirmationStatusesEnum } from '../models/author/author-confirmation/author-confirmation-statuses-enum'

export const getAuthorConfirmationStatusColor = (status: string): string => {
	switch (status) {
		case AuthorConfirmationStatusesEnum.APPROVED:
			return 'text-green-600'
		case AuthorConfirmationStatusesEnum.PENDING:
			return 'text-yellow-600'
		case AuthorConfirmationStatusesEnum.REJECTED:
			return 'text-red-600'
		default:
			return ''
	}
}
