import type { TFunction } from 'i18next';
import {
  ReleaseMediaStatusesEnum,
  ReleaseMediaTypesEnum,
  ReleaseTypesEnum,
} from '../../types/release';

export function translateReleaseType(t: TFunction, type: string): string {
  switch (type) {
    case ReleaseTypesEnum.ALBUM:
      return t('release.type.album');
    case ReleaseTypesEnum.SINGLE:
      return t('release.type.single');
    default:
      return type;
  }
}

export function translateReleaseMediaStatus(
  t: TFunction,
  status: string
): string {
  switch (status) {
    case ReleaseMediaStatusesEnum.PENDING:
      return t('release.mediaStatus.pending');
    case ReleaseMediaStatusesEnum.APPROVED:
      return t('release.mediaStatus.approved');
    case ReleaseMediaStatusesEnum.REJECTED:
      return t('release.mediaStatus.rejected');
    default:
      return status;
  }
}

export function translateReleaseMediaType(
  t: TFunction,
  mediaType: string
): string {
  switch (mediaType) {
    case ReleaseMediaTypesEnum.MUSIC_VIDEO:
      return t('release.mediaType.musicVideo');
    case ReleaseMediaTypesEnum.MEDIA_REVIEW:
      return t('release.mediaType.mediaReview');
    case ReleaseMediaTypesEnum.MEDIA_MATERIAL:
      return t('release.mediaType.mediaMaterial');
    case ReleaseMediaTypesEnum.SNIPPET:
      return t('release.mediaType.snippet');
    default:
      return mediaType;
  }
}
