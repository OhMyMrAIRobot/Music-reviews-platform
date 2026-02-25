import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import FormButton from '../../../../components/form-elements/Form-button'
import FormInfoField from '../../../../components/form-elements/Form-info-field'
import FormSubTitle from '../../../../components/form-elements/Form-subtitle'
import FormTitle from '../../../../components/form-elements/Form-title'
import {
	useActivateUserMutation,
	useResendActivationMutation,
} from '../../../../hooks/mutations'
import { useStore } from '../../../../hooks/use-store'

const ActivationForm = observer(() => {
	const { authStore } = useStore()
	const { token } = useParams()

	const { mutateAsync: activate, isPending: isActivating } =
		useActivateUserMutation()

	const { mutateAsync: resend, isPending: isLoading } =
		useResendActivationMutation()

	useEffect(() => {
		if (token && !isActivating) {
			activate(token)
		}
	}, [activate, isActivating, token])

	return (
		<div className='grid w-full sm:w-[350px] gap-6 text-center'>
			<div className='grid gap-2'>
				<FormTitle title={'Активация аккаунта'} />
				{!authStore.isAuth && (
					<FormSubTitle
						title={'Войдите в Ваш аккаунт для повторного запроса активации!'}
					/>
				)}
			</div>

			{authStore.user?.isActive && !token && (
				<FormInfoField text={'Ваш аккаунт уже активирован!'} isError={true} />
			)}

			{authStore.isAuth && !authStore.user?.isActive && (
				<FormButton
					title={isLoading ? 'Отправка...' : 'Отправить письмо активации'}
					isInvert={true}
					onClick={resend}
					disabled={isLoading}
					isLoading={isLoading}
				/>
			)}
		</div>
	)
})

export default ActivationForm
