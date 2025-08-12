import { useState } from 'react'
import FormButton from '../../components/form-elements/Form-button'
import FormCheckbox from '../../components/form-elements/Form-checkbox'
import FormInput from '../../components/form-elements/Form-input'
import FormLabel from '../../components/form-elements/Form-label'
import FormMultiSelect, {
	IMultiSelectValue,
} from '../../components/form-elements/Form-multi-select'
import { useLoading } from '../../hooks/use-loading'
import { useStore } from '../../hooks/use-store'
import AuthLayout from '../auth-page/ui/Auth-layout'

const AuthorConfirmationPage = () => {
	const { authorConfirmationPageStore } = useStore()

	const [confirmation, setConfirmation] = useState<string>('')
	const [checked, setChecked] = useState<boolean>(false)
	const [authors, setAuthors] = useState<IMultiSelectValue[]>([])

	const { execute: fetchAuthors } = useLoading(
		authorConfirmationPageStore.fetchAuthors
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

	return (
		<AuthLayout>
			<div className='grid w-full lg:w-90 gap-4'>
				<h1 className='text-3xl font-bold mb-4'>Подтверждение автора</h1>

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
				<div className='mt-4'>
					<FormButton
						title={'Отправить'}
						isInvert={true}
						disabled={true}
						isLoading={false}
					/>
				</div>
			</div>
		</AuthLayout>
	)
}

export default AuthorConfirmationPage
