import { FC } from 'react'
import NominationIconSvg from '../../../components/nomination/Nomination-icon-svg'
import Tooltip from '../../../components/tooltip/Tooltip'
import TooltipSpan from '../../../components/tooltip/Tooltip-span'

interface IProps {
	nominations: string[]
}

const ReleaseDetailsNominations: FC<IProps> = ({ nominations }) => {
	return (
		nominations.length > 0 && (
			<div className='flex lg:flex-col w-fit lg:items-end max-lg:bg-zinc-900 max-lg:py-1.5 max-lg:px-4 items-center gap-x-3 max-lg:rounded-2xl max-lg:border max-lg:border-white/10'>
				<span className='text-xs lg:text-sm lg:bg-zinc-800 lg:mb-2.5 lg:py-1 lg:px-3 rounded-md font-semibold'>
					Номинации
				</span>
				<div className='flex lg:justify-end gap-1.5'>
					{nominations.map((nomination, idx) => (
						<TooltipSpan
							tooltip={<Tooltip>{nomination}</Tooltip>}
							spanClassName='text-white relative'
							centered={idx !== nominations.length - 1}
							key={nomination}
						>
							<div className='size-7 lg:size-10 flex items-center justify-center bg-zinc-950 border border-white/10 rounded-full'>
								<NominationIconSvg
									nomination={nomination}
									className='w-3.5 lg:w-5'
								/>
							</div>
						</TooltipSpan>
					))}
				</div>
			</div>
		)
	)
}

export default ReleaseDetailsNominations
