import type { TFunction } from 'i18next';
import {
  ReleaseMediaStatusesEnum,
  ReleaseMediaStatusesFilterOptions,
  ReleaseMediaTypesEnum,
  ReleaseMediaTypesFilterOptions,
  ReleaseTypesEnum,
  ReleaseTypesFilterOptions,
} from '../../types/release';
import {
  translateReleaseMediaStatus,
  translateReleaseMediaType,
  translateReleaseType,
} from './release-labels-i18n';

export function translateReleaseTypesFilterOption(
  t: TFunction,
  option: string
): string {
  if (option === ReleaseTypesFilterOptions.ALL) {
    return t('adminDashboard.common.all');
  }
  if (option === ReleaseTypesFilterOptions.ALBUM) {
    return translateReleaseType(t, ReleaseTypesEnum.ALBUM);
  }
  if (option === ReleaseTypesFilterOptions.SINGLE) {
    return translateReleaseType(t, ReleaseTypesEnum.SINGLE);
  }
  return option;
}

export function translateReleaseMediaStatusFilterOption(
  t: TFunction,
  option: string
): string {
  if (option === ReleaseMediaStatusesFilterOptions.ALL) {
    return t('adminDashboard.common.all');
  }
  return translateReleaseMediaStatus(t, option as ReleaseMediaStatusesEnum);
}

export function translateReleaseMediaTypeFilterOption(
  t: TFunction,
  option: string
): string {
  if (option === ReleaseMediaTypesFilterOptions.ALL) {
    return t('adminDashboard.common.all');
  }
  return translateReleaseMediaType(t, option as ReleaseMediaTypesEnum);
}
