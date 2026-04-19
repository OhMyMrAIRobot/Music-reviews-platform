import type { TFunction } from 'i18next';

export function assertComboBoxOptionsNonEmpty(
  t: TFunction,
  options: readonly unknown[]
): asserts options is [unknown, ...unknown[]] {
  if (options.length === 0) {
    throw new Error(t('buttons.comboBox.emptyOptionsError'));
  }
}
