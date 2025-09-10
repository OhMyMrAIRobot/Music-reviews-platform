import WarningSvg from '../../../../components/svg/Warning-svg'

const ReleaseDetailsEstimationWarning = () => {
	return (
		<div className='rounded-lg w-full border p-4 border-red-500/50 text-white bg-white/5 mt-5 flex gap-x-2.5'>
			<WarningSvg className='h-5 w-5 fill-red-600 mt-0.5' />

			<div className='flex flex-col'>
				<h5 className='text-sm lg:text-base font-bold'>
					Ознакомьтесь с критериями.
				</h5>

				<span className='mt-1'>Будут удалены рецензии:</span>
				<ul className='list-disc list-inside marker:text-red-500'>
					<li>с матом</li>
					<li>с оскорблениями</li>
					<li>с рекламой и ссылками</li>
					<li>малосодержательные</li>
				</ul>

				<button className='items-center justify-center whitespace-nowrap text-sm font-medium h-9 rounded-md px-3 mt-2 bg-white/5 cursor-pointer select-none transition-all duration-200 hover:bg-white/10'>
					Критерии оценки
				</button>
			</div>
		</div>
	)
}

export default ReleaseDetailsEstimationWarning
