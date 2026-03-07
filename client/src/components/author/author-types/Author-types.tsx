import { FC } from "react";
import { AuthorType } from "../../../types/author";
import Tooltip from "../../tooltip/Tooltip";
import TooltipSpan from "../../tooltip/Tooltip-span";
import AuthorTypeSvg from "./Author-type-svg";

interface IProps {
  types: AuthorType[];
  className: string;
}

const AuthorTypes: FC<IProps> = ({ types, className }) => {
  return types.map((type) => (
    <TooltipSpan
      tooltip={<Tooltip>{type.type}</Tooltip>}
      spanClassName="text-white relative"
      key={type.type}
      centered={true}
    >
      <AuthorTypeSvg type={type} className={className} />
    </TooltipSpan>
  ));
};

export default AuthorTypes;
