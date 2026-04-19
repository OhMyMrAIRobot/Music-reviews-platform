import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RolesEnum } from '../../types/user';
import { translateUserRole } from '../../utils/user/user-role-i18n';

interface IProps {
  role: string;
}

const UserRoleSpan: FC<IProps> = ({ role }) => {
  const { t } = useTranslation();

  switch (role) {
    case RolesEnum.MEDIA:
      return (
        <div className="text-xs font-normal rounded-full px-2 text-white border bg-gradient-to-br from-[#D1D3F0]/15 to-[#99B7E9]/15 border-[#D1D3F0]">
          <span>{translateUserRole(t, role)}</span>
        </div>
      );
    default:
      return null;
  }
};

export default UserRoleSpan;
