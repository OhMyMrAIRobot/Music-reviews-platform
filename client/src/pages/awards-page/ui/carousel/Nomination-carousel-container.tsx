import { observer } from 'mobx-react-lite'
import { FC, useRef, useState } from 'react'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import { INominationMonthWinners } from '../../../../models/nomination/nomination-winner/nomination-month-winners'
import { CarouselRef } from '../../../../types/carousel-ref'
import { MonthEnum, MonthEnumType } from '../../../../types/month-enum-type'
import NominationCarousel from './Nomination-carousel'

interface IProps {
	item?: INominationMonthWinners
	isLoading: boolean
	idx: number
}

const NominationCarouselContainer: FC<IProps> = observer(
	({ item, isLoading, idx }) => {
		const carouselRef = useRef<CarouselRef>(null)

		const [canScrollPrev, setCanScrollPrev] = useState(false)
		const [canScrollNext, setCanScrollNext] = useState(false)

		return (
			<CarouselContainer
				title={MonthEnum[(item?.month ?? idx + 1) as MonthEnumType]}
				buttonTitle={'#'}
				showButton={false}
				href={'#'}
				handlePrev={() => carouselRef.current?.scrollPrev()}
				handleNext={() => carouselRef.current?.scrollNext()}
				canScrollNext={canScrollNext}
				canScrollPrev={canScrollPrev}
				carousel={
					<NominationCarousel
						items={item?.results}
						onCanScrollPrevChange={setCanScrollPrev}
						onCanScrollNextChange={setCanScrollNext}
						ref={carouselRef}
						isLoading={isLoading}
					/>
				}
			/>
		)
	}
)

export default NominationCarouselContainer
