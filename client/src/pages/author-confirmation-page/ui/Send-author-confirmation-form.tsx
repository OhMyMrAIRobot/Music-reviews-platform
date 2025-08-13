import { FC, useMemo, useState } from 'react'
import FormButton from '../../../components/form-elements/Form-button'
import FormCheckbox from '../../../components/form-elements/Form-checkbox'
import FormInput from '../../../components/form-elements/Form-input'
import FormLabel from '../../../components/form-elements/Form-label'
import FormMultiSelect, {
	IMultiSelectValue,
} from '../../../components/form-elements/Form-multi-select'
import { useAuth } from '../../../hooks/use-auth'
import { useLoading } from '../../../hooks/use-loading'
import { useStore } from '../../../hooks/use-store'

interface IProps {
	show: boolean
}

const SendAuthorConfirmationForm: FC<IProps> = ({ show }) => {
	const { authorConfirmationPageStore, notificationStore } = useStore()

	const { checkAuth } = useAuth()

	const [confirmation, setConfirmation] = useState<string>('')
	const [checked, setChecked] = useState<boolean>(false)
	const [authors, setAuthors] = useState<IMultiSelectValue[]>([])

	const { execute: fetchAuthors, isLoading: isAuthorsLoading } = useLoading(
		authorConfirmationPageStore.fetchAuthors
	)

	const { execute: create, isLoading: isCreating } = useLoading(
		authorConfirmationPageStore.postAuthorConfirmation
	)

	const loadAuthors = async (
		search: string,
		limit: number | null
	): Promise<IMultiSelectValue[]> => {
		await fetchAuthors(search.trim() !== '' ? search.trim() : null, limit)

		return authorConfirmationPageStore.authors.map(a => {
			return { name: a.name, id: a.id }
		})
	}

	const postAuthorConfirmation = async () => {
		if (!checkAuth() || isCreating || isAuthorsLoading || !isFormValid) return

		const authorIds = authors.map(a => a.id)
		const errors = await create(confirmation, authorIds)

		if (errors.length === 0) {
			notificationStore.addSuccessNotification(
				'Вы успешно оставили заявку на подтверждение!'
			)
			setChecked(false)
			setAuthors([])
			setConfirmation('')
		} else {
			errors.forEach(err => notificationStore.addErrorNotification(err))
		}
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
				disabled={!isFormValid || isAuthorsLoading || isCreating}
				isLoading={isCreating}
			/>
		</div>
	)
}

export default SendAuthorConfirmationForm
