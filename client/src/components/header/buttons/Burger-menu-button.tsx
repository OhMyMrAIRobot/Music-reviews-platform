import { FC } from 'react'
import BurgerMenuSvg from '../svg/Burger-menu-svg'

interface IProps {
	onClick: () => void
}

const BurgerMenuButton: FC<IProps> = ({ onClick }) => {
	return (
		<button onClick={onClick} className='p-3'>
			<BurgerMenuSvg className={'size-8'} />
		</button>
	)
}

export default BurgerMenuButton
