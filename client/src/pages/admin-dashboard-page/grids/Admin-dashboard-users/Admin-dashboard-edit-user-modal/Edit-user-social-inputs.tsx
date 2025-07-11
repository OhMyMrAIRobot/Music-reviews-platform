import { FC, useEffect } from 'react'
import FormInputWithConfirmation from '../../../../../components/form-elements/Form-input-with-confirmation'
import { useLoading } from '../../../../../hooks/use-loading'
import { useStore } from '../../../../../hooks/use-store'
import { IUserInfo } from '../../../../../models/user/user-info'
import adminDashboardUsersStore from '../../../store/admin-dashboard-users-store'

interface IProps {
	user: IUserInfo
}

const EditUserModalInputs: FC<IProps> = ({ user }) => {
	const { notificationStore, metaStore } = useStore()

	const { execute: fetchSocials, isLoading: isSocialsLoading } = useLoading(
		metaStore.fetchSocials
	)

	const { execute: toggleSocial, isLoading: isTogglingSocial } = useLoading(
		adminDashboardUsersStore.toggleSocial
	)

	useEffect(() => {
		if (metaStore.socials.length === 0) {
			fetchSocials()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<div className='grid grid-cols-2 gap-x-5 gap-y-4'>
				{isSocialsLoading
					? Array.from({ length: 4 }).map((_, idx) => (
							<div
								key={`Social-inputs-skeleton-${idx}`}
								className='bg-gray-400 w-full h-10 animate-pulse opacity-40 rounded-md'
							/>
					  ))
					: metaStore.socials.map(social => {
							const initialValue =
								user.profile?.socialMedia.find(el => el.id === social.id)
									?.url ?? ''
							return (
								<FormInputWithConfirmation
									key={social.id}
									label={social.name}
									initialValue={initialValue}
									isLoading={isTogglingSocial}
									onClick={value => {
										toggleSocial(user.id, social.id, value, initialValue).then(
											errors => {
												if (errors.length === 0) {
													notificationStore.addSuccessNotification(
														`Вы успешно обновили информацию о ${social.name}`
													)
												} else {
													errors.forEach(err => {
														notificationStore.addErrorNotification(err)
													})
												}
											}
										)
									}}
								/>
							)
					  })}
			</div>
		</>
	)
}

export default EditUserModalInputs
