import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ProfileAPI } from '../../../../../../api/user/profile-api.ts'
import { UserAPI } from '../../../../../../api/user/user-api.ts'
import ComboBox from '../../../../../../components/buttons/Combo-box.tsx'
import FormButton from '../../../../../../components/form-elements/Form-button.tsx'
import FormDelimiter from '../../../../../../components/form-elements/Form-delimiter.tsx'
import FormInput from '../../../../../../components/form-elements/Form-input.tsx'
import FormLabel from '../../../../../../components/form-elements/Form-label.tsx'
import FormTextbox from '../../../../../../components/form-elements/Form-textbox.tsx'
import ModalOverlay from '../../../../../../components/modals/Modal-overlay.tsx'
import MoveToSvg from '../../../../../../components/svg/Move-to-svg.tsx'
import TrashSvg from '../../../../../../components/svg/Trash-svg.tsx'
import SkeletonLoader from '../../../../../../components/utils/Skeleton-loader.tsx'
import { useApiErrorHandler } from '../../../../../../hooks/use-api-error-handler.ts'
import useNavigationPath from '../../../../../../hooks/use-navigation-path.ts'
import { useRoleMeta } from '../../../../../../hooks/use-role-meta.ts'
import { useSocialMeta } from '../../../../../../hooks/use-social-meta.ts'
import { useStore } from '../../../../../../hooks/use-store.ts'
import {
	AdminAvailableRolesEnum,
	RolesEnum,
	RootAdminAvalaibleRolesEnum,
} from '../../../../../../models/role/roles-enum.ts'
import { IUpdateUserData } from '../../../../../../models/user/update-user-data.ts'
import { UserStatusesEnum } from '../../../../../../models/user/user-statuses-enum.ts'
import { usersKeys } from '../../../../../../query-keys/users-keys.ts'
import { UpdateProfileData } from '../../../../../../types/profile/index.ts'
import { getRoleColor } from '../../../../../../utils/get-role-color.ts'
import EditUserModalButton from './Edit-user-modal-button.tsx'

interface IProps {
	userId: string
	isOpen: boolean
	onClose: () => void
}

const AdminDashboardEditUserModal: FC<IProps> = observer(
	({ userId, isOpen, onClose }) => {
		const { authStore, notificationStore } = useStore()

		const { navigatoToProfile } = useNavigationPath()

		const { roles, isLoading: isRolesLoading } = useRoleMeta()
		const { socials, isLoading: isSocialsLoading } = useSocialMeta()

		const handleApiError = useApiErrorHandler()

		const [nickname, setNickname] = useState<string>('')
		const [email, setEmail] = useState<string>('')
		const [role, setRole] = useState<string>('')
		const [availableRoles, setAvailableRoles] = useState<
			Record<string, string>
		>(AdminAvailableRolesEnum)
		const [status, setStatus] = useState<string>('')
		const [bio, setBio] = useState<string>(authStore.profile?.bio ?? '')

		const [socialValues, setSocialValues] = useState<Record<string, string>>({})
		const [initialSocialValues, setInitialSocialValues] = useState<
			Record<string, string>
		>({})

		const queryClient = useQueryClient()

		const { data: user, isLoading: isUserLoading } = useQuery({
			queryKey: usersKeys.id(userId),
			queryFn: () => UserAPI.fetchUserDetails(userId),
			enabled: isOpen,
		})

		const updateUserMutation = useMutation({
			mutationFn: (data: { id: string; updateData: IUpdateUserData }) =>
				UserAPI.adminUpdateUser(data.id, data.updateData),
			onSuccess: () => {
				notificationStore.addSuccessNotification(
					'Информация о пользователе успешно обновлена'
				)
				queryClient.invalidateQueries({ queryKey: usersKeys.all })
				queryClient.invalidateQueries({ queryKey: usersKeys.id(userId) })
			},
			onError: (error: unknown) => {
				handleApiError(error)
			},
		})

		const updateProfileMutation = useMutation({
			mutationFn: (data: { id: string; updateData: UpdateProfileData }) =>
				ProfileAPI.adminUpdate(data.id, data.updateData),
			onSuccess: () => {
				notificationStore.addSuccessNotification('Вы успешно обновили профиль!')
				queryClient.invalidateQueries({ queryKey: usersKeys.all })
				queryClient.invalidateQueries({ queryKey: usersKeys.id(userId) })
			},
			onError: (error: unknown) => {
				handleApiError(error)
			},
		})

		// helper to safely read user's profile social url
		const getUserSocialUrl = useCallback(
			(socialId: string) => {
				const socialsArr = user?.profile?.socialMedia ?? []

				const found = socialsArr.find(el => el.id === socialId)
				return found?.url ?? ''
			},
			[user]
		)

		useEffect(() => {
			if (isOpen && user) {
				setNickname(user.nickname ?? '')
				setEmail(user.email ?? '')
				setRole(user.role.role ?? '')
				setStatus(
					user.isActive ? UserStatusesEnum.ACTIVE : UserStatusesEnum.NON_ACTIVE
				)
				if (authStore.user?.role.role === RolesEnum.ADMIN)
					setAvailableRoles(AdminAvailableRolesEnum)
				if (authStore.user?.role.role === RolesEnum.ROOT_ADMIN)
					setAvailableRoles(RootAdminAvalaibleRolesEnum)
			}

			// initialize socials values for inputs
			if (socials && socials.length > 0) {
				const map: Record<string, string> = {}
				socials.forEach(s => {
					const initial = getUserSocialUrl(s.id)
					map[s.id] = initial
				})
				setSocialValues(map)
				setInitialSocialValues(map)
			}
		}, [isOpen, user, authStore.user?.role.role, socials, getUserSocialUrl])

		const update = () => {
			const isActive = status === UserStatusesEnum.ACTIVE ? true : false
			const roleObj = roles.find(el => el.role === role)

			// Check if user data changed
			const nicknameChanged = nickname.trim() !== user?.nickname
			const emailChanged = email.trim() !== user?.email
			const roleChanged = roleObj?.id !== user?.role.id
			const statusChanged =
				(status === UserStatusesEnum.ACTIVE && !user?.isActive) ||
				(status === UserStatusesEnum.NON_ACTIVE && user?.isActive)

			const hasUserChanges =
				nicknameChanged || emailChanged || roleChanged || statusChanged

			// Check if profile data changed
			const bioChanged = (bio ?? '') !== (user?.profile?.bio ?? '')
			const changedSocials = socials
				.map(s => {
					const url = (socialValues[s.id] ?? '').trim()
					const initial = (initialSocialValues[s.id] ?? '').trim()
					if (url === initial) return null
					if (url === '') return { socialId: s.id }
					return { socialId: s.id, url }
				})
				.filter(
					(item): item is { socialId: string; url?: string } => item !== null
				)

			const hasProfileChanges = bioChanged || changedSocials.length > 0

			// Call only necessary mutations
			if (hasUserChanges) {
				updateUserMutation.mutate({
					id: userId,
					updateData: {
						nickname: nicknameChanged ? nickname.trim() : undefined,
						email: emailChanged ? email.trim() : undefined,
						roleId: roleChanged ? roleObj?.id : undefined,
						isActive: statusChanged ? isActive : undefined,
					},
				})
			}

			if (hasProfileChanges) {
				const profilePayload: UpdateProfileData = {}
				if (bioChanged) profilePayload.bio = bio
				if (changedSocials.length > 0) profilePayload.socials = changedSocials

				updateProfileMutation.mutate({ id: userId, updateData: profilePayload })
			}
		}

		if (!isOpen) return null
		return (
			<ModalOverlay
				isOpen={isOpen}
				onCancel={onClose}
				isLoading={
					updateUserMutation.isPending || updateProfileMutation.isPending
				}
				className='max-lg:size-full'
			>
				{isUserLoading || isRolesLoading ? (
					<SkeletonLoader className='w-full lg:w-180 h-190 rounded-lg' />
				) : (
					user && (
						<div
							className={`relative rounded-xl w-full lg:w-180 border border-white/10 bg-zinc-950 transition-transform duration-300 pb-6 max-h-full overflow-y-scroll overflow-x-hidden`}
						>
							<div className='w-full h-40 overflow-hidden p-1'>
								<img
									loading='lazy'
									decoding='async'
									src={`${import.meta.env.VITE_SERVER_URL}/public/covers/${
										user.profile?.coverImage === ''
											? import.meta.env.VITE_DEFAULT_COVER
											: user.profile?.coverImage
									}`}
									className='aspect-video size-full'
								/>
							</div>

							<div className='grid px-6 gap-3 relative'>
								<div className='size-26 rounded-full overflow-hidden -mt-13 border-2 border-white/10 bg-zinc-950'>
									<img
										loading='lazy'
										decoding='async'
										src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
											user.profile?.avatar === ''
												? import.meta.env.VITE_DEFAULT_AVATAR
												: user.profile?.avatar
										}`}
										className='aspect-square object-cover'
									/>
								</div>

								<div className='lg:absolute right-3 top-3 grid lg:flex gap-3'>
									<Link to={navigatoToProfile(userId)} className='md:w-45'>
										<EditUserModalButton
											title={'Профиль'}
											svg={<MoveToSvg className={'size-4'} />}
											disabled={false}
										/>
									</Link>

									<div className='md:w-45'>
										<EditUserModalButton
											disabled={
												user.profile?.avatar === '' ||
												updateProfileMutation.isPending
											}
											title={'Удалить аватар'}
											onClick={() =>
												updateProfileMutation.mutate({
													id: user.id,
													updateData: { clearAvatar: true },
												})
											}
											svg={<TrashSvg className={'size-4'} />}
											isLoading={updateProfileMutation.isPending}
										/>
									</div>

									<div className='md:w-45'>
										<EditUserModalButton
											disabled={
												user.profile?.coverImage === '' ||
												updateProfileMutation.isPending
											}
											title={'Удалить обложку'}
											onClick={() => {
												updateProfileMutation.mutate({
													id: user.id,
													updateData: { clearCover: true },
												})
											}}
											svg={<TrashSvg className={'size-4'} />}
											isLoading={updateProfileMutation.isPending}
										/>
									</div>
								</div>

								<div className='grid gap-1'>
									<h3 className='font-bold text-lg'>{user.nickname}</h3>
									<h6 className='font-medium text-sm'>{user.email}</h6>
									<span
										className={`${getRoleColor(
											user.role.role
										)} font-medium text-sm`}
									>
										{user.role.role}
									</span>
								</div>

								<FormDelimiter />

								<div className='grid md:flex gap-y-3 gap-x-5'>
									<div className='w-full md:w-1/2 gap-y-3 h-full flex flex-col justify-between'>
										<div className={`grid gap-2 w-full`}>
											<FormLabel
												name={'Никнейм'}
												htmlFor={`admin-edit-user-nickname`}
												isRequired={true}
											/>

											<FormInput
												id={`admin-edit-user-nickname`}
												placeholder={'Никнейм...'}
												type={'text'}
												value={nickname}
												setValue={setNickname}
											/>
										</div>

										<div className={`grid gap-2 w-full`}>
											<FormLabel
												name={'Email'}
												htmlFor={`admin-edit-user-email`}
												isRequired={true}
											/>

											<FormInput
												id={`admin-edit-user-email`}
												placeholder={'Email@exaple.com'}
												type={'text'}
												value={email}
												setValue={setEmail}
											/>
										</div>
									</div>

									<div className={`w-full md:w-1/2`}>
										<FormLabel
											name={'Описание'}
											htmlFor={'admin-edit-user-bio'}
										/>
										<FormTextbox
											id={'admin-edit-user-bio'}
											placeholder='Описание...'
											value={bio}
											setValue={setBio}
										/>
									</div>
								</div>

								<FormDelimiter />

								<div className='w-full grid md:flex items-start gap-x-5 gap-y-3'>
									<div className='grid gap-2 w-full md:w-1/2'>
										<FormLabel name={'Роль'} htmlFor={''} isRequired={true} />

										<ComboBox
											options={Object.values(availableRoles)}
											value={role}
											onChange={setRole}
											className='border border-white/15'
										/>
									</div>

									<div className='grid gap-2 w-full md:w-1/2'>
										<FormLabel name={'Статус'} htmlFor={''} isRequired={true} />

										<ComboBox
											options={Object.values(UserStatusesEnum)}
											value={status}
											onChange={setStatus}
											className='border border-white/15'
										/>
									</div>
								</div>

								<FormDelimiter />

								<div className='grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3'>
									{isSocialsLoading
										? Array.from({ length: 4 }).map((_, idx) => (
												<SkeletonLoader
													key={`Social-inputs-skeleton-${idx}`}
													className='w-full h-10 rounded-md'
												/>
										  ))
										: socials.map(social => {
												return (
													<FormInput
														id={'admin-social-input-' + social.id}
														placeholder={social.name}
														type={'url'}
														value={socialValues[social.id] ?? ''}
														setValue={(value: string) =>
															setSocialValues(prev => ({
																...prev,
																[social.id]: value,
															}))
														}
													/>
												)
										  })}
								</div>

								<FormDelimiter />

								<div className='grid w-full sm:flex gap-3 sm:justify-end sm:flex-row-reverse'>
									<div className='w-full sm:w-30'>
										<FormButton
											title={'Сохранить'}
											isInvert={true}
											onClick={update}
											disabled={
												authStore.user?.id === user.id ||
												updateUserMutation.isPending ||
												isUserLoading ||
												isRolesLoading ||
												nickname.length === 0 ||
												email.length === 0 ||
												role.length === 0 ||
												status.length === 0 ||
												((nickname === user.nickname ||
													nickname.toLowerCase() ===
														user.nickname.toLowerCase()) &&
													(email === user.email ||
														email.toLowerCase() === user.email.toLowerCase()) &&
													role === user.role.role &&
													((status === UserStatusesEnum.ACTIVE &&
														user.isActive) ||
														(status === UserStatusesEnum.NON_ACTIVE &&
															!user.isActive)) &&
													bio === (user.profile?.bio || '') &&
													!socials.some(
														s =>
															(socialValues[s.id] ?? '').trim() !==
															(getUserSocialUrl(s.id) ?? '').trim()
													))
											}
											isLoading={updateUserMutation.isPending}
										/>
									</div>

									<div className='w-full sm:w-25 sm:ml-auto'>
										<FormButton
											title={'Назад'}
											isInvert={false}
											onClick={onClose}
											disabled={updateUserMutation.isPending}
										/>
									</div>
								</div>
							</div>
						</div>
					)
				)}
			</ModalOverlay>
		)
	}
)

export default AdminDashboardEditUserModal
