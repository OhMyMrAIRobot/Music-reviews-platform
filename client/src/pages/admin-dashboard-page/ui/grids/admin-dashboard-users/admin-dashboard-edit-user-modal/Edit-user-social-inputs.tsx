import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { SocialMediaAPI } from '../../../../../../api/social-media-api.ts'
import FormInputWithConfirmation from '../../../../../../components/form-elements/Form-input-with-confirmation.tsx'
import SkeletonLoader from '../../../../../../components/utils/Skeleton-loader.tsx'
import { useSocialMeta } from '../../../../../../hooks/use-social-meta.ts'
import { useStore } from '../../../../../../hooks/use-store.ts'
import { IUserInfo } from '../../../../../../models/user/user-info.ts'
import { usersKeys } from '../../../../../../query-keys/users-keys.ts'

interface IProps {
	user: IUserInfo
}

const EditUserModalInputs: FC<IProps> = ({ user }) => {
	const { notificationStore } = useStore()

	const { socials, isLoading: isSocialsLoading } = useSocialMeta()

	const queryClient = useQueryClient()

	const toggleSocialMutation = useMutation({
		mutationFn: async ({
			userId,
			socialId,
			value,
			initialValue,
		}: {
			userId: string
			socialId: string
			value: string
			initialValue: string
		}) => {
			if (value.trim() === '' && initialValue.trim() !== '') {
				// delete
				return SocialMediaAPI.adminDeleteSocial(userId, socialId)
			} else if (value.trim() !== '' && initialValue.trim() === '') {
				// add
				return SocialMediaAPI.adminAddSocial(userId, socialId, value)
			} else if (value.trim() !== '' && initialValue.trim() !== '') {
				// edit
				return SocialMediaAPI.adminEditSocial(userId, socialId, value)
			}
		},
		onSuccess: () => {
			notificationStore.addSuccessNotification(
				'Вы успешно обновили информацию о социальной сети'
			)
			queryClient.invalidateQueries({ queryKey: usersKeys.all })
			queryClient.invalidateQueries({ queryKey: usersKeys.id(user.id) })
		},
		onError: () => {
			notificationStore.addErrorNotification(
				'Ошибка при обновлении социальной сети'
			)
		},
	})

	return (
		<>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3'>
				{isSocialsLoading
					? Array.from({ length: 4 }).map((_, idx) => (
							<SkeletonLoader
								key={`Social-inputs-skeleton-${idx}`}
								className='w-full h-10 rounded-md'
							/>
					  ))
					: socials.map(social => {
							const initialValue =
								user.profile?.socialMedia.find(el => el.id === social.id)
									?.url ?? ''
							return (
								<FormInputWithConfirmation
									key={social.id}
									label={social.name}
									initialValue={initialValue}
									isLoading={toggleSocialMutation.isPending}
									onClick={value => {
										toggleSocialMutation.mutate({
											userId: user.id,
											socialId: social.id,
											value,
											initialValue,
										})
									}}
								/>
							)
					  })}
			</div>
		</>
	)
}

export default EditUserModalInputs
