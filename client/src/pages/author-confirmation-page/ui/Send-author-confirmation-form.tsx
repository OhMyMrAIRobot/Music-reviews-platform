/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { useAuth } from '../../../hooks/use-auth'
import { useStore } from '../../../hooks/use-store'
import { authorConfirmationsKeys } from '../../../query-keys/author-confirmation-keys'
import { authorsKeys } from '../../../query-keys/authors-keys'

interface IProps {
	show: boolean
}

const SendAuthorConfirmationForm: FC<IProps> = ({ show }) => {
	const { notificationStore } = useStore()
	const { checkAuth } = useAuth()
	const queryClient = useQueryClient()

	const [confirmation, setConfirmation] = useState<string>('')
	const [checked, setChecked] = useState<boolean>(false)
	const [authors, setAuthors] = useState<IMultiSelectValue[]>([])

	const loadAuthors = async (
		search: string,
		limit: number | null
	): Promise<IMultiSelectValue[]> => {
		const query = search.trim() !== '' ? search.trim() : null
		const data = await queryClient.fetchQuery({
			queryKey: authorsKeys.search({
				query,
				limit: limit ?? null,
				offset: 0,
			}),
			queryFn: () => AuthorAPI.adminFetchAuthors(null, query, limit ?? null, 0),
			staleTime: 1000 * 60 * 5,
		})
		const list = data?.authors ?? []
		return list.map((a: { id: string; name: string }) => ({
			id: a.id,
			name: a.name,
		}))
	}

	const { mutateAsync: createConfirmation, isPending: isCreating } =
		useMutation({
			mutationFn: (payload: { confirmation: string; authorIds: string[] }) =>
				AuthorConfirmationAPI.create(payload.confirmation, payload.authorIds),
			onSuccess: async () => {
				notificationStore.addSuccessNotification(
					'Вы успешно оставили заявку на подтверждение!'
				)
				setChecked(false)
				setAuthors([])
				setConfirmation('')
				await queryClient.invalidateQueries({
					queryKey: authorConfirmationsKeys.byCurrentUser(),
				})
			},
			onError: (e: any) => {
				const messages = Array.isArray(e?.response?.data?.message)
					? e.response.data.message
					: [e?.response?.data?.message || 'Не удалось отправить заявку']
				messages.forEach((m: string) =>
					notificationStore.addErrorNotification(m)
				)
			},
		})

	const postAuthorConfirmation = async () => {
		if (!checkAuth() || isCreating || !isFormValid) return
		const authorIds = authors.map(a => a.id)
		await createConfirmation({ confirmation, authorIds })
	}

	const isFormValid = useMemo(() => {
		return confirmation.trim().length > 5 && authors.length > 0 && checked
	}, [authors.length, checked, confirmation])

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
				onClick={postAuthorConfirmation}
				isInvert={true}
				disabled={!isFormValid || isCreating}
				isLoading={isCreating}
			/>
		</div>
	)
}

export default SendAuthorConfirmationForm
