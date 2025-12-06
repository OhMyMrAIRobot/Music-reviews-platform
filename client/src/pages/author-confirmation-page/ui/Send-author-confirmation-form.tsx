import {
	InvalidateQueryFilters,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import { FC, useMemo, useState } from 'react'
import { AuthorAPI } from '../../../api/author/author-api'
import { AuthorConfirmationAPI } from '../../../api/author/author-confirmation-api'
import FormButton from '../../../components/form-elements/Form-button'
import FormCheckbox from '../../../components/form-elements/Form-checkbox'
import FormInput from '../../../components/form-elements/Form-input'
import FormLabel from '../../../components/form-elements/Form-label'
import FormMultiSelect, {
	IMultiSelectValue,
} from '../../../components/form-elements/Form-multi-select'
import { useApiErrorHandler } from '../../../hooks/use-api-error-handler'
import { useAuth } from '../../../hooks/use-auth'
import { useStore } from '../../../hooks/use-store'
import { authorConfirmationsKeys } from '../../../query-keys/authors-confirmations-keys'
import { authorsKeys } from '../../../query-keys/authors-keys'
import {
	AuthorsQuery,
	CreateAuthorConfirmationData,
} from '../../../types/author'
import { constraints } from '../../../utils/constraints'

interface IProps {
	show: boolean
}

const SendAuthorConfirmationForm: FC<IProps> = ({ show }) => {
	/** HOOKS */
	const { notificationStore } = useStore()
	const { checkAuth } = useAuth()
	const queryClient = useQueryClient()
	const handleApiError = useApiErrorHandler()

	/** STATE */
	const [confirmation, setConfirmation] = useState<string>('')
	const [checked, setChecked] = useState<boolean>(false)
	const [authors, setAuthors] = useState<IMultiSelectValue[]>([])

	/**
	 * Function to load authors for multi-select
	 *
	 * @param {string} search - The search term
	 * @param {number | null} limit - The maximum number of authors to load
	 * @returns {Promise<IMultiSelectValue[]>} A promise that resolves to an array of multi-select values
	 */
	const loadAuthors = async (
		search: string,
		limit: number | null
	): Promise<IMultiSelectValue[]> => {
		const query: AuthorsQuery = {
			search: search.trim() || undefined,
			limit: limit || undefined,
			offset: 0,
		}

		const data = await queryClient.fetchQuery({
			queryKey: authorsKeys.list(query),
			queryFn: () => AuthorAPI.findAll(query),
			staleTime: 1000 * 60 * 5,
		})

		const list = data?.items ?? []
		return list.map((a: IMultiSelectValue) => ({
			id: a.id,
			name: a.name,
		}))
	}

	/**
	 * Function to invalidate related queries after mutations
	 */
	const invalidateRelatedQueries = () => {
		const keysToInvalidate: InvalidateQueryFilters[] = [
			{ queryKey: authorConfirmationsKeys.all },
		]

		keysToInvalidate.forEach(key => queryClient.invalidateQueries(key))
	}

	/**
	 * Create author confirmation mutation
	 */
	const { mutateAsync: createConfirmation, isPending: isCreating } =
		useMutation({
			mutationFn: (payload: CreateAuthorConfirmationData) =>
				AuthorConfirmationAPI.create(payload),
			onSuccess: async () => {
				notificationStore.addSuccessNotification(
					'Вы успешно оставили заявку на подтверждение!'
				)
				setChecked(false)
				setAuthors([])
				setConfirmation('')

				invalidateRelatedQueries()
			},
			onError: (err: unknown) => {
				handleApiError(err, 'Не удалось отправить заявку')
			},
		})

	/**
	 * Indicates if the form is valid
	 *
	 * @returns {boolean} True if the form is valid, false otherwise
	 */
	const isFormValid = useMemo(() => {
		return (
			confirmation.trim().length >=
				constraints.authorConfirmation.minConfirmationLength &&
			confirmation.trim().length <=
				constraints.authorConfirmation.maxConfirmationLength &&
			authors.length >= constraints.authorConfirmation.minArraySize &&
			authors.length <= constraints.authorConfirmation.maxArraySize &&
			checked
		)
	}, [authors.length, checked, confirmation])

	/**
	 * Handle post confirmation
	 */
	const handlePostConfirmation = async () => {
		if (!checkAuth() || isCreating || !isFormValid) return

		const authorIds = authors.map(a => a.id)
		return createConfirmation({ confirmation, authorIds })
	}

	return (
		<div
			className={`grid gap-4 ${
				show ? '' : 'opacity-0 pointer-events-none duration-200 transition-all'
			}`}
		>
			<div className='grid gap-2'>
				<FormLabel
					name={'Укажите имена авторов'}
					htmlFor={'authors-select'}
					isRequired={true}
				/>
				<FormMultiSelect
					id={'authors-select'}
					placeholder={'Введите имя автора'}
					value={authors}
					onChange={setAuthors}
					loadOptions={loadAuthors}
				/>
			</div>

			<div className='grid gap-2'>
				<FormLabel
					name={
						'Укажите адрес вашей соц.сети или электронной почты, откуда нам придет подтверждение'
					}
					htmlFor={'input-fonfirmation'}
					isRequired={true}
				/>
				<FormInput
					id={'input-fonfirmation'}
					placeholder={''}
					type={'text'}
					value={confirmation}
					setValue={setConfirmation}
				/>
			</div>

			<div className='flex items-center w-full gap-2'>
				<FormCheckbox
					id={'confirmation-checkbox'}
					checked={checked}
					setChecked={setChecked}
				/>
				<FormLabel
					name={
						'Я отправил подтверждение в соц.сети сайта со своих верифицированных соц.сетей'
					}
					htmlFor={'confirmation-checkbox'}
					isRequired={true}
				/>
			</div>

			<FormButton
				title={'Отправить'}
				onClick={handlePostConfirmation}
				isInvert={true}
				disabled={!isFormValid || isCreating}
				isLoading={isCreating}
			/>
		</div>
	)
}

export default SendAuthorConfirmationForm
