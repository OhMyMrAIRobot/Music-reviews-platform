import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { getAlbumValueInfluenceMultiplier } from '../../../../../../utils/get-album-value-influence-multiplier'
import { makeStepLabeler } from '../../../../../../utils/make-step-labeler'
import ReleaseDetailsAlbumValueFormSlider from './Release-details-album-value-form-slider'
import ReleaseDetailsAlbumValueSection from './Release-details-album-value-section'

interface IProps {
	releaseAnticip: number
	setReleaseAnticip: (val: number) => void
	authorPopularity: number
	setAuthorPopularity: (val: number) => void
}

const getAuthorPopularityValueTitle = makeStepLabeler(
	[
		'Автор неизвестен',
		'Автор малоизвестен',
		'Автор достаточно известный',
		'Автор очень известный',
		'Автор — один из самых известных',
	],
	0.5,
	1
)

const getReleaseAnticipValueTitle = makeStepLabeler(
	[
		'Альбом не ждут',
		'Ожидания незначительные',
		'Ожидания умеренные',
		'Огромные ожидания',
		'Альбом-событие',
	],
	0.5,
	1
)

const AUTHOR_POPULARITY_DATA: Record<
	string,
	{ title: string; text: string }[]
> = {
	'0.5': [
		{ title: 'Концерты', text: 'Нет или редкие разогревы' },
		{ title: 'Медийность', text: 'Не упоминается' },
		{ title: 'Стриминг и аудитория', text: '< 5K слушателей в месяц' },
		{ title: 'Соцсети (Telegram, VK)', text: '< 500 подписчиков' },
		{ title: 'Коллаборации', text: 'Отсутствуют' },
		{ title: 'Клипы / видео', text: '< 5K просмотров' },
	],
	'1.5': [
		{ title: 'Концерты', text: 'Единичные клубные выступления' },
		{ title: 'Медийность', text: 'Упоминается в малых пабликах' },
		{ title: 'Стриминг и аудитория', text: '5K – 100K' },
		{ title: 'Соцсети (Telegram, VK)', text: '500 – 5K' },
		{ title: 'Коллаборации', text: 'С такими же артистами' },
		{ title: 'Клипы / видео', text: '5K – 50K' },
	],
	'2.5': [
		{ title: 'Концерты', text: 'Клубные выступления / фестивали' },
		{ title: 'Медийность', text: 'Присутствует в подборках, медиа' },
		{ title: 'Стриминг и аудитория', text: '100K – 1M' },
		{ title: 'Соцсети (Telegram, VK)', text: '5K – 30K' },
		{ title: 'Коллаборации', text: 'С нишевыми / растущими' },
		{ title: 'Клипы / видео', text: '50K – 300K' },
	],
	'3.5': [
		{ title: 'Концерты', text: 'Туровая активность' },
		{ title: 'Медийность', text: 'Часто упоминается, свои инфоповоды' },
		{ title: 'Стриминг и аудитория', text: '1M – 5M' },
		{ title: 'Соцсети (Telegram, VK)', text: '30K – 100K' },
		{ title: 'Коллаборации', text: 'С мейнстримом' },
		{ title: 'Клипы / видео', text: '300K – 1M' },
	],
	'4.5': [
		{ title: 'Концерты', text: 'Стадионы, хедлайнер фестов' },
		{ title: 'Медийность', text: 'Массовая медийность' },
		{ title: 'Стриминг и аудитория', text: '> 5M' },
		{ title: 'Соцсети (Telegram, VK)', text: '> 100K' },
		{ title: 'Коллаборации', text: 'С топ-артистами' },
		{ title: 'Клипы / видео', text: '> 1M' },
	],
}

const RELEASE_ANTICIP_DATA: Record<string, { title: string; text: string }[]> =
	{
		'0.5': [
			{ title: 'Анонсирование', text: 'Нет анонсов, вышел внезапно' },
			{ title: 'Цитируемость', text: 'Релиз не обсуждается (Нет резонанса)' },
			{ title: 'Промокампания', text: 'Отсутствует полностью' },
			{ title: 'Прослушивания', text: 'Низкие в первые сутки и неделю' },
			{
				title: 'Чарты и плейлисты',
				text: 'Цифры индивидуальны. Суть: насколько релиз «забрал пятницу» — чарты в Яндекс Музыке, Apple Music, плейлисты VK/Spotify',
			},
		],
		'1.5': [
			{ title: 'Анонсирование', text: 'Анонс есть, но охват минимальный' },
			{
				title: 'Цитируемость',
				text: 'Редкие упоминания (ожидается только преданными фанатами)',
			},
			{ title: 'Промокампания', text: '1–2 поста или сторис' },
			{ title: 'Прослушивания', text: 'Слабые, но чуть выше минимального' },
			{
				title: 'Чарты и плейлисты',
				text: 'Цифры индивидуальны. Суть: насколько релиз «забрал пятницу» — чарты в Яндекс Музыке, Apple Music, плейлисты VK/Spotify',
			},
		],
		'2.5': [
			{
				title: 'Анонсирование',
				text: 'Анонс с трейлером / постами, охват средний. Или «фоновые» ожидания релиза от крупного артиста («Автор очень известный»), который давно не выпускал материал и «должен скоро выпустить»',
			},
			{
				title: 'Цитируемость',
				text: 'Фанатские обсуждения, локальные ожидания',
			},
			{ title: 'Промокампания', text: 'Клип / афиша / посты' },
			{ title: 'Прослушивания', text: 'Умеренные в первые сутки и неделю' },
			{
				title: 'Чарты и плейлисты',
				text: 'Цифры индивидуальны. Суть: насколько релиз «забрал пятницу» — чарты в Яндекс Музыке, Apple Music, плейлисты VK/Spotify',
			},
		],
		'3.5': [
			{
				title: 'Анонсирование',
				text: 'Масштабный анонс, хайп в соцсетях. Или «фоновые» ожидания релиза от очень крупного артиста («Автор — один из самых известных»), который давно не выпускал материал и «должен скоро выпустить»',
			},
			{
				title: 'Цитируемость',
				text: 'Активные обсуждения в соцсетях и пабликах, массовое ожидание',
			},
			{
				title: 'Промокампания',
				text: 'Несколько медиа-материалов, интервью, плейлисты',
			},
			{ title: 'Прослушивания', text: 'Высокие в первые сутки и неделю' },
			{
				title: 'Чарты и плейлисты',
				text: 'Цифры индивидуальны. Суть: насколько релиз «забрал пятницу» — чарты в Яндекс Музыке, Apple Music, плейлисты VK/Spotify',
			},
		],
		'4.5': [
			{
				title: 'Анонсирование',
				text: 'Долгие тизеры, дата известна заранее, медиа подогревают интерес',
			},
			{
				title: 'Цитируемость',
				text: 'Ожидание в массах, мемы, форумы, обсуждение как культурного явления',
			},
			{
				title: 'Промокампания',
				text: 'Полномасштабное промо: офлайн-активации, баннеры, акции',
			},
			{ title: 'Прослушивания', text: 'Очень высокие в первые сутки и неделю' },
			{
				title: 'Чарты и плейлисты',
				text: 'Цифры индивидуальны. Суть: насколько релиз «забрал пятницу» — чарты в Яндекс Музыке, Apple Music, плейлисты VK/Spotify',
			},
		],
	}

const ReleaseDetailsAlbumValueFormInfluence: FC<IProps> = observer(
	({
		releaseAnticip,
		setReleaseAnticip,
		authorPopularity,
		setAuthorPopularity,
	}) => {
		return (
			<ReleaseDetailsAlbumValueSection
				pos={5}
				title={'Влияние'}
				minMaxText={'(от 1.12 до 2.00)'}
				description={
					<>
						<p>Потенциальная значимость релиза для музыкальной индустрии</p>
						<p>
							Множитель рассчитывается как совокупность подкритериев
							«Известность автора» и «Ожидание релиза»
						</p>
					</>
				}
				value={`${getAlbumValueInfluenceMultiplier(
					releaseAnticip + authorPopularity
				)}`}
				maxValue={'2.00'}
			>
				<div className='grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-2 xl:gap-y-4 xl:pl-10 mt-3'>
					<ReleaseDetailsAlbumValueFormSlider
						value={authorPopularity}
						setValue={setAuthorPopularity}
						title='Известность автора'
						min={0.5}
						max={4.5}
						step={1}
						valueTitle={getAuthorPopularityValueTitle(authorPopularity)}
						valueDescription={
							AUTHOR_POPULARITY_DATA[authorPopularity.toFixed(1)] || []
						}
					/>
					<ReleaseDetailsAlbumValueFormSlider
						value={releaseAnticip}
						setValue={setReleaseAnticip}
						title='Ожидание релиза'
						min={0.5}
						max={4.5}
						step={1}
						valueTitle={getReleaseAnticipValueTitle(releaseAnticip)}
						valueDescription={
							RELEASE_ANTICIP_DATA[releaseAnticip.toFixed(1)] || []
						}
					/>
				</div>
			</ReleaseDetailsAlbumValueSection>
		)
	}
)

export default ReleaseDetailsAlbumValueFormInfluence
