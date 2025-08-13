import { useState } from 'react'
import AuthLayout from '../auth-page/ui/Auth-layout'
import AuthorConfirmationButton from './ui/Author-confirmation-button'
import AuthorConfirmationTickets from './ui/Author-confirmation-tickets'
import SendAuthorConfirmationForm from './ui/Send-author-confirmation-form'

const AuthorConfirmationPage = () => {
	const [formShow, setFormShow] = useState<boolean>(true)

	return (
		<AuthLayout>
			<div className='grid w-full lg:w-90 gap-4'>
				<h1 className='text-3xl font-bold'>Подтверждение автора</h1>

				<div className='h-10 grid grid-cols-2 items-center rounded-md bg-zinc-800/90 p-1 text-zinc-300 mb-4 gap-1'>
					<AuthorConfirmationButton
						onClick={() => setFormShow(true)}
						isActive={formShow}
						title={'Отправить заявку'}
					/>
					<AuthorConfirmationButton
						onClick={() => setFormShow(false)}
						isActive={!formShow}
						title={'Мои заявки'}
					/>
				</div>

				<div className='h-120 overflow-y-scroll'>
					{formShow ? (
						<SendAuthorConfirmationForm show={formShow} />
					) : (
						<AuthorConfirmationTickets show={!formShow} />
					)}
				</div>
			</div>
		</AuthLayout>
	)
}

export default AuthorConfirmationPage
