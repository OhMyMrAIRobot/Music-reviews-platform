import { FC } from 'react'
import ArrowBottomSvg from '../../../../components/layout/header/svg/Arrow-bottom-svg'
import { SortOrdersEnum } from '../../../../models/sort/sort-orders-enum'
import { SortOrder } from '../../../../types/sort-order-type'

interface IProps {
	title: string
	order: SortOrder
	toggleOrder: () => void
}

const AdminToggleSortOrderButton: FC<IProps> = ({
	title,
	order,
	toggleOrder,
}) => {
	return (
		<div className='xl:hidden font-medium mt-2 md:mt-4 text-white/80 border-b border-white/10'>
			<button
				onClick={toggleOrder}
				className='cursor-pointer text-sm px-2 pb-1 hover:text-white flex items-center gap-x-1.5'
			>
				<span className='pr-1'>Сортировать по: </span>
				<span>{title}</span>
				<ArrowBottomSvg
					className={`size-3 ${
						order === SortOrdersEnum.ASC ? 'rotate-180' : ''
					}`}
				/>
			</button>
		</div>
	)
}

export default AdminToggleSortOrderButton
