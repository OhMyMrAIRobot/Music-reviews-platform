import { FC } from 'react'
import { RolesEnum } from '../../models/role/roles-enum'

interface IProps {
	role: string
}

const UserRoleSpan: FC<IProps> = ({ role }) => {
	switch (role) {
		case RolesEnum.SUPER_USER:
			return (
				<div className='text-xs font-normal rounded-full px-2 text-white border bg-gradient-to-br from-[#D1D3F0]/15 to-[#99B7E9]/15 border-[#D1D3F0]'>
					<span>Медиа</span>
				</div>
			)
		default:
			return null
	}
}

export default UserRoleSpan
