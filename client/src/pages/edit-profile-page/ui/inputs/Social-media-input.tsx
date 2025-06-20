import { FC, useEffect, useState } from 'react'
import FormInput from '../../../../components/form-elements/Form-input'
import FormLabel from '../../../../components/form-elements/Form-label'
import TickSvg from '../../../../components/svg/Tick-svg'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import { ISocialMedia } from '../../../../models/social-media/social-media'

interface IProps {
	social: ISocialMedia
	initialValue: string
	setErrors: (val: string[]) => void
}

const SocialMediaInput: FC<IProps> = ({ social, initialValue, setErrors }) => {
	const { authStore, profileStore, notificationStore } = useStore()

	const [value, setValue] = useState<string>(initialValue)
	const [show, setShow] = useState<boolean>(false)

	const { execute: toggle, isLoading } = useLoading(profileStore.toggleSocial)

	const handleClick = () => {
		setErrors([])
		toggle(social.id, value, initialValue, authStore.user?.id ?? '').then(
			result => {
				setErrors(result)
				notificationStore.addSuccessNotification(
					`Вы успешно обновили информацию о ${social.name}`
				)
			}
		)
	}

	useEffect(() => {
		setTimeout(() => setShow(true), 300)
	}, [])

	return (
		<div className='w-full flex items-end justify-end gap-x-1'>
			<div className={`grid gap-2 w-full`}>
				<FormLabel
					name={social.name}
					htmlFor={`social-input-${social.id}`}
					isRequired={false}
				/>

				<FormInput
					id={`social-input-${social.id}`}
					placeholder={social.name}
					type={'text'}
					value={value}
					setValue={setValue}
				/>
			</div>

			<button
				disabled={isLoading}
				onClick={handleClick}
				className={`absolute flex ml-auto size-10 items-center justify-center cursor-pointer overflow-hidden p-1.5 select-none ${
					isLoading ? 'pointer-events-none' : ''
				} ${value === initialValue ? 'animate-slideOut' : 'animate-slideIn'}`}
			>
				<div
					className={`relative bg-green-500 flex items-center justify-center size-full rounded-md hover:bg-green-500/85 duration-200 ${
						isLoading ? 'opacity-50' : ''
					} ${show ? '' : 'opacity-0'}`}
				>
					<TickSvg className={'size-5'} />
				</div>
			</button>
		</div>
	)
}

export default SocialMediaInput
