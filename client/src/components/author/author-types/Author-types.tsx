import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthorType } from '../../../types/author';
import { translateAuthorType } from '../../../utils';
import Tooltip from '../../tooltip/Tooltip';
import TooltipSpan from '../../tooltip/Tooltip-span';
import AuthorTypeSvg from './Author-type-svg';

interface IProps {
  types: AuthorType[];
  className: string;
}

const AuthorTypes: FC<IProps> = ({ types, className }) => {
  const { t } = useTranslation();

  return types.map((type) => (
    <TooltipSpan
      tooltip={<Tooltip>{translateAuthorType(t, type.type)}</Tooltip>}
      spanClassName="text-white relative"
      key={type.type}
      centered={true}
    >
      <AuthorTypeSvg type={type} className={className} />
    </TooltipSpan>
  ));
};

export default AuthorTypes;
