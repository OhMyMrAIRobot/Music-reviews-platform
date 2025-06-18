import { FC, ReactNode } from 'react'

interface IProps {
	children: ReactNode
	title: string
	description?: string
}

const EditProfilePageSection: FC<IProps> = ({
	children,
	title,
	description,
}) => {
	return (
		<div className='rounded-lg border border-white/10 bg-zinc-950 shadow-sm p-5 w-200 flex flex-col gap-y-5 overflow-hidden'>
			<div className='flex flex-col gap-y-1.5'>
				<h3 className='text-2xl font-semibold leading-none tracking-tight'>
					{title}
				</h3>
				{description && (
					<p className='text-sm text-white/60 font-medium'>{description}</p>
				)}
			</div>
			{children}
		</div>
	)
}

export default EditProfilePageSection
