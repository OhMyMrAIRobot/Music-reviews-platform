import { FC } from "react";
import {
  FeedbackStatusesEnum,
  FeedbackStatusesFilterEnum,
} from "../../types/feedback";
import MessageChatSvg from "./svg/Message-chat-svg";
import MessageCircleSvg from "./svg/Message-circle-svg";
import MessageTickSvg from "./svg/Message-tick-svg";

interface IProps {
  status: FeedbackStatusesEnum | FeedbackStatusesFilterEnum;
  className: string;
}

const FeedbackStatusIcon: FC<IProps> = ({ status, className }) => {
  switch (status) {
    case FeedbackStatusesEnum.NEW:
      return <MessageCircleSvg className={className} />;
    case FeedbackStatusesEnum.READ:
      return <MessageTickSvg className={className} />;
    case FeedbackStatusesEnum.ANSWERED:
      return <MessageChatSvg className={className} />;
  }
};

export default FeedbackStatusIcon;
