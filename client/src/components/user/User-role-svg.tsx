import { FC } from 'react';
import { Role, RolesEnum } from '../../types/user';
import UserShieldSvg from '../svg/User-shield-svg';
import UserSvg from '../svg/User-svg';
import UserTickSvg from '../svg/User-tick-svg';

interface IProps {
  role: Role;
  className: string;
}

const UserRoleSvg: FC<IProps> = ({ role, className }) => {
  switch (role.role) {
    case RolesEnum.USER:
      return <UserSvg className={className} />;
    case RolesEnum.MEDIA:
      return <UserTickSvg className={className} />;
    case RolesEnum.ADMIN:
      return <UserShieldSvg className={className} />;
    default:
      return null;
  }
};

export default UserRoleSvg;
