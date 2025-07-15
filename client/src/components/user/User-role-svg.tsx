import { FC } from 'react'
import { IRole } from '../../models/role/role'
import { RolesEnum } from '../../models/role/roles-enum'
import UserLockSvg from '../svg/User-lock-svg'
import UserShieldSvg from '../svg/User-shield-svg'
import UserSvg from '../svg/User-svg'
import UserTickSvg from '../svg/User-tick-svg'

interface IProps {
	role: IRole
	className: string
}

const UserRoleSvg: FC<IProps> = ({ role, className }) => {
	switch (role.role) {
		case RolesEnum.USER:
			return <UserSvg className={className} />
		case RolesEnum.SUPER_USER:
			return <UserTickSvg className={className} />
		case RolesEnum.ADMIN:
			return <UserShieldSvg className={className} />
		case RolesEnum.ROOT_ADMIN:
			return <UserLockSvg className={className} />
		default:
			return null
	}
}

export default UserRoleSvg
