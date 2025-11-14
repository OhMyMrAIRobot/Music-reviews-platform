import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FC, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ProfileAPI } from '../../../../../../api/user/profile-api.ts'
import { UserAPI } from '../../../../../../api/user/user-api.ts'
import ComboBox from '../../../../../../components/buttons/Combo-box.tsx'
import FormButton from '../../../../../../components/form-elements/Form-button.tsx'
import FormDelimiter from '../../../../../../components/form-elements/Form-delimiter.tsx'
import FormInput from '../../../../../../components/form-elements/Form-input.tsx'
import FormLabel from '../../../../../../components/form-elements/Form-label.tsx'
import FormTextboxWithConfirmation from '../../../../../../components/form-elements/Form-textbox-with-confirmation.tsx'
import ModalOverlay from '../../../../../../components/modals/Modal-overlay.tsx'
import MoveToSvg from '../../../../../../components/svg/Move-to-svg.tsx'
import TrashSvg from '../../../../../../components/svg/Trash-svg.tsx'
import SkeletonLoader from '../../../../../../components/utils/Skeleton-loader.tsx'
import useNavigationPath from '../../../../../../hooks/use-navigation-path.ts'
import { useRoleMeta } from '../../../../../../hooks/use-role-meta.ts'
import { useStore } from '../../../../../../hooks/use-store.ts'
import { IUpdateProfileData } from '../../../../../../models/profile/update-profile-data.ts'
import {
	AdminAvailableRolesEnum,
	RolesEnum,
	RootAdminAvalaibleRolesEnum,
} from '../../../../../../models/role/roles-enum.ts'
import { IUpdateUserData } from '../../../../../../models/user/update-user-data.ts'
import { UserStatusesEnum } from '../../../../../../models/user/user-statuses-enum.ts'
import { usersKeys } from '../../../../../../query-keys/users-keys.ts'
import { getRoleColor } from '../../../../../../utils/get-role-color.ts'
import EditUserModalButton from './Edit-user-modal-button.tsx'
import EditUserModalInputs from './Edit-user-social-inputs.tsx'

interface IProps {
	userId: string
	isOpen: boolean
	onClose: () => void
}

const AdminDashboardEditUserModal: FC<IProps> = ({
	userId,
	isOpen,
	onClose,
}) => {
	const { authStore, notificationStore } = useStore()

	const { navigatoToProfile } = useNavigationPath()

	const { roles, isLoading: isRolesLoading } = useRoleMeta()

	const [nickname, setNickname] = useState<string>('')
	const [email, setEmail] = useState<string>('')
	const [role, setRole] = useState<string>('')
	const [availableRoles, setAvailableRoles] = useState<Record<string, string>>(
		AdminAvailableRolesEnum
	)
	const [status, setStatus] = useState<string>('')

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
			const axiosError = error as AxiosError<{ message: string | string[] }>
			const errors = Array.isArray(axiosError.response?.data?.message)
				? axiosError.response?.data?.message
				: [axiosError.response?.data?.message]
			errors
				.filter((err): err is string => typeof err === 'string')
				.forEach((err: string) => notificationStore.addErrorNotification(err))
		},
	})

	const updateProfileMutation = useMutation({
		mutationFn: (data: { id: string; updateData: IUpdateProfileData }) =>
			ProfileAPI.adminUpdateProfile(data.id, data.updateData),
		onSuccess: () => {
			notificationStore.addSuccessNotification(
				'Вы успешно обновили описание профиля!'
			)
			queryClient.invalidateQueries({ queryKey: usersKeys.all })
			queryClient.invalidateQueries({ queryKey: usersKeys.id(userId) })
		},
		onError: (error: unknown) => {
			const axiosError = error as AxiosError<{ message: string | string[] }>
			const errors = Array.isArray(axiosError.response?.data?.message)
				? axiosError.response?.data?.message
				: [axiosError.response?.data?.message]
			errors
				.filter((err): err is string => typeof err === 'string')
				.forEach((err: string) => notificationStore.addErrorNotification(err))
		},
	})

	const deleteAvatarMutation = useMutation({
		mutationFn: () =>
			ProfileAPI.adminUpdateProfile(userId, { clearAvatar: true }),
		onSuccess: () => {
			notificationStore.addSuccessNotification(
				'Вы успешно удалили аватар профиля!'
			)
			queryClient.invalidateQueries({ queryKey: usersKeys.all })
			queryClient.invalidateQueries({ queryKey: usersKeys.id(userId) })
		},
		onError: (error: unknown) => {
			const axiosError = error as AxiosError<{ message: string | string[] }>
			const errors = Array.isArray(axiosError.response?.data?.message)
				? axiosError.response?.data?.message
				: [axiosError.response?.data?.message]
			errors
				.filter((err): err is string => typeof err === 'string')
				.forEach((err: string) => notificationStore.addErrorNotification(err))
		},
	})

	const deleteCoverMutation = useMutation({
		mutationFn: () =>
			ProfileAPI.adminUpdateProfile(userId, { clearCover: true }),
		onSuccess: () => {
			notificationStore.addSuccessNotification(
				'Вы успешно удалили обложку профиля!'
			)
			queryClient.invalidateQueries({ queryKey: usersKeys.all })
			queryClient.invalidateQueries({ queryKey: usersKeys.id(userId) })
		},
		onError: (error: unknown) => {
			const axiosError = error as AxiosError<{ message: string | string[] }>
			const errors = Array.isArray(axiosError.response?.data?.message)
				? axiosError.response?.data?.message
				: [axiosError.response?.data?.message]
			errors
				.filter((err): err is string => typeof err === 'string')
				.forEach((err: string) => notificationStore.addErrorNotification(err))
		},
	})

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
	}, [isOpen, user, authStore.user?.role.role])

	const update = () => {
		const isActive = status === UserStatusesEnum.ACTIVE ? true : false
		const roleObj = roles.find(el => el.role === role)
		updateUserMutation.mutate({
			id: userId,
			updateData: {
				nickname:
					nickname.trim() === user?.nickname ? undefined : nickname.trim(),
				email: email.trim() === user?.email ? undefined : email.trim(),
				roleId: roleObj?.id,
				isActive: status.length > 0 ? isActive : undefined,
			},
		})
	}

	const handleDeleteCover = () => {
		if (!user) return
		deleteCoverMutation.mutate()
	}

	const handleDeleteAvatar = () => {
		if (!user) return
		deleteAvatarMutation.mutate()
	}

	if (!isOpen) return null
	return (
		<ModalOverlay
			isOpen={isOpen}
			onCancel={onClose}
			isLoading={
				updateUserMutation.isPending ||
				deleteAvatarMutation.isPending ||
				deleteCoverMutation.isPending
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
											deleteAvatarMutation.isPending
										}
										title={'Удалить аватар'}
										onClick={handleDeleteAvatar}
										svg={<TrashSvg className={'size-4'} />}
										isLoading={deleteAvatarMutation.isPending}
									/>
								</div>

								<div className='md:w-45'>
									<EditUserModalButton
										disabled={
											user.profile?.coverImage === '' ||
											deleteCoverMutation.isPending
										}
										title={'Удалить обложку'}
										onClick={handleDeleteCover}
										svg={<TrashSvg className={'size-4'} />}
										isLoading={deleteCoverMutation.isPending}
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
									<FormTextboxWithConfirmation
										label={'Описание'}
										initialValue={user.profile?.bio ?? ''}
										onClick={val => {
											updateProfileMutation.mutate({
												id: user.id,
												updateData: { bio: val },
											})
										}}
										isLoading={updateProfileMutation.isPending}
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

							<EditUserModalInputs user={user} />

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
														!user.isActive)))
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

export default AdminDashboardEditUserModal
