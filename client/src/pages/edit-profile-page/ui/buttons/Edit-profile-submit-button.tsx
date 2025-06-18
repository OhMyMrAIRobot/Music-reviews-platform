import { FC } from 'react'
import FormButton from '../../../../components/form-elements/Form-button'

interface IProps {
	handleClick: () => void
	disabled: boolean
	isLoading: boolean
}

const EditProfileSubmitButton: FC<IProps> = ({
	handleClick,
	disabled,
	isLoading,
}) => {
	return (
		<div className='pt-6 border-t border-white/5 w-full'>
			<div className='w-38'>
				<FormButton
					title={isLoading ? 'Сохранение...' : 'Сохранить'}
					isInvert={true}
					onClick={handleClick}
					disabled={disabled}
				/>
			</div>
		</div>
	)
}

export default EditProfileSubmitButton
