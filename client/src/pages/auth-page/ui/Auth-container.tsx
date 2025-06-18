import { FC, ReactNode } from 'react'

interface IProps {
	children: ReactNode
}

const AuthContainer: FC<IProps> = ({ children }) => {
	return (
		<div className='border border-white/15 rounded-[0.5rem] grid lg:grid-cols-2 min-h-[700px]'>
			<div className='flex items-center justify-center h-full'>{children}</div>
			<div className='relative hidden lg:block h-full border-l border-white/15 overflow-hidden'>
				<img
					loading='lazy'
					alt='authImage'
					decoding='async'
					sizes='100vm'
					src={`${
						import.meta.env.VITE_SERVER_URL
					}/public/assets/auth-cover.png`}
					className='absolute h-full w-full left-0 top-0 right-0 bottom-0 object-center object-cover'
				/>
			</div>
		</div>
	)
}

export default AuthContainer
