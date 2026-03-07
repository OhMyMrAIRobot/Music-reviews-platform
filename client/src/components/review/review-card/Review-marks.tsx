import { FC } from "react";
import { ReviewValues } from "../../../types/review";
import TooltipSpan from "../../tooltip/Tooltip-span";
import ReviewToolTip from "./Review-tooltip";

interface IProps {
  values: ReviewValues;
}

const ReviewMarks: FC<IProps> = ({ values }) => {
  return (
    <div className="flex flex-col h-full text-right justify-center">
      <span className="text-[20px] lg:text-[24px] font-bold ">
        {values.total}
      </span>
      <div className="flex gap-x-1.5 font-bold text-sx lg:text-sm">
        <TooltipSpan
          tooltip={<ReviewToolTip text="Рифмы / Образы" />}
          spanClassName="text-[rgba(35,101,199)] relative inline-block"
        >
          {values.rhymes}
        </TooltipSpan>
        <TooltipSpan
          tooltip={<ReviewToolTip text="Структура / Ритмика" />}
          spanClassName="text-[rgba(35,101,199)] relative inline-block"
        >
          {values.structure}
        </TooltipSpan>
        <TooltipSpan
          tooltip={<ReviewToolTip text="Реализация стиля" />}
          spanClassName="text-[rgba(35,101,199)] relative inline-block"
        >
          {values.realization}
        </TooltipSpan>
        <TooltipSpan
          tooltip={<ReviewToolTip text="Индивидуальность / Харизма" />}
          spanClassName="text-[rgba(35,101,199)] relative inline-block"
        >
          {values.individuality}
        </TooltipSpan>
        <TooltipSpan
          tooltip={<ReviewToolTip text="Атмосфера / Вайб" />}
          spanClassName="text-[rgba(160,80,222)] relative inline-block"
        >
          {values.atmosphere}
        </TooltipSpan>
      </div>
    </div>
  );
};

export default ReviewMarks;
