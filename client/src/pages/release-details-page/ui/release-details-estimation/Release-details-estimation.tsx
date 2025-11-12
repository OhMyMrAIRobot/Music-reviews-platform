import { FC, useState } from 'react'
import { Link } from 'react-router'
import SwitchButton from '../../../../components/buttons/Switch-button'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { useStore } from '../../../../hooks/use-store'
import { IReleaseDetails } from '../../../../models/release/release-details/release-details'
import { ReleaseTypesEnum } from '../../../../models/release/release-type/release-types-enum'
import { RolesEnum } from '../../../../models/role/roles-enum'
import { ReleaseDetailsPageSections } from '../../types/release-details-page-sections'
import ReleaseDetailsEstimationWarning from './Release-details-estimation-warning'
import ReleaseDetailsAlbumValueForm from './forms/release-details-album-value-form/Release-details-album-value-form'
import ReleaseDetailsMediaReviewForm from './forms/release-details-media-review-form/Release-details-media-review-form'
import ReleaseDetailsReviewForm from './forms/release-details-review-form/Release-details-review-form'

interface IProps {
	release: IReleaseDetails
}

const ReleaseDetailsEstimation: FC<IProps> = ({ release }) => {
	const { authStore } = useStore()

	const { navigateToLogin } = useNavigationPath()

	const [section, setSection] = useState<ReleaseDetailsPageSections>(
		ReleaseDetailsPageSections.REVIEW
	)

	if (!authStore.isAuth)
		return (
			<div className='text-center text-white/90 border font-medium border-white/15 bg-gradient-to-br from-white/10 rounded-2xl text-sm lg:text-base w-full lg:max-w-[800px] sm:max-w-[600px] px-5 py-5 mx-auto mt-7'>
				<span className='mr-1'>Для отправки рецензии вам необходимо</span>
				<Link
					to={navigateToLogin}
					className='underline underline-offset-4 cursor-pointer hover:text-white transition-colors duration-200'
				>
					войти в свой аккаунт!
				</Link>
			</div>
		)

	return (
		<div className='mt-10 mx-auto'>
			<h3 className='text-xl lg:text-2xl font-bold '>Оценить работу</h3>

			<div className='grid lg:grid-cols-8 items-start gap-5 mt-5'>
				<div className='lg:col-span-2'>
					<div className='rounded-md bg-secondary grid w-full items-stretch justify-stretch'>
						<SwitchButton
							title={ReleaseDetailsPageSections.REVIEW}
							isActive={section === ReleaseDetailsPageSections.REVIEW}
							onClick={() => setSection(ReleaseDetailsPageSections.REVIEW)}
						/>

						<SwitchButton
							title={ReleaseDetailsPageSections.MARK}
							isActive={section === ReleaseDetailsPageSections.MARK}
							onClick={() => setSection(ReleaseDetailsPageSections.MARK)}
						/>

						{authStore.user?.role.role === RolesEnum.MEDIA && (
							<SwitchButton
								title={ReleaseDetailsPageSections.MEDIAREVIEW}
								isActive={section === ReleaseDetailsPageSections.MEDIAREVIEW}
								onClick={() =>
									setSection(ReleaseDetailsPageSections.MEDIAREVIEW)
								}
							/>
						)}

						{release.releaseType === ReleaseTypesEnum.ALBUM && (
							<SwitchButton
								title={ReleaseDetailsPageSections.ALBUM_VALUE}
								isActive={section === ReleaseDetailsPageSections.ALBUM_VALUE}
								onClick={() =>
									setSection(ReleaseDetailsPageSections.ALBUM_VALUE)
								}
							/>
						)}
					</div>

					<ReleaseDetailsEstimationWarning />
				</div>

				<div className='lg:col-span-6'>
					{section === ReleaseDetailsPageSections.REVIEW && (
						<ReleaseDetailsReviewForm releaseId={release.id} isReview={true} />
					)}

					{section === ReleaseDetailsPageSections.MARK && (
						<ReleaseDetailsReviewForm releaseId={release.id} isReview={false} />
					)}

					{section === ReleaseDetailsPageSections.MEDIAREVIEW && (
						<ReleaseDetailsMediaReviewForm releaseId={release.id} />
					)}

					{section === ReleaseDetailsPageSections.ALBUM_VALUE && (
						<ReleaseDetailsAlbumValueForm release={release} />
					)}
				</div>
			</div>
		</div>
	)
}

export default ReleaseDetailsEstimation
