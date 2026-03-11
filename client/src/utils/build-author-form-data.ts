import { IMultiSelectValue } from '../components/form-elements/Form-multi-select';
import { Author } from '../types/author';
import { arraysEqual } from './arrays-equal';

export interface IAuthorFormValues {
  name?: string;
  selectedTypes?: IMultiSelectValue[];
  avatar?: File | null;
  cover?: File | null;
  deleteAvatar?: boolean;
  deleteCover?: boolean;
}

/**
 * Build FormData for create/update author endpoints.
 * If `existing` is provided, only changed fields will be appended.
 */
export function buildAuthorFormData(
  values: IAuthorFormValues,
  existing?: Author | null
): FormData {
  const formData = new FormData();

  if (
    !existing ||
    (values.name !== undefined && existing.name !== values.name)
  ) {
    if (values.name !== undefined) formData.append('name', values.name);
  }

  const mapTypes = () => {
    const selected = values.selectedTypes ?? [];
    if (!existing) {
      selected.forEach((s) => formData.append('types[]', s.id));
      return;
    }

    const existingNames = (existing.authorTypes || [])
      .map((t) => t.type)
      .sort();
    const selectedNames = selected.map((s) => s.name).sort();
    if (!arraysEqual(existingNames, selectedNames)) {
      selected.forEach((s) => formData.append('types[]', s.id));
    }
  };

  if (values.selectedTypes !== undefined) {
    mapTypes();
  }

  if (values.avatar) {
    formData.append('avatarImg', values.avatar);
  }

  if (values.cover) {
    formData.append('coverImg', values.cover);
  }

  if (values.deleteAvatar && !values.avatar) {
    formData.append('clearAvatar', JSON.stringify(true));
  }

  if (values.deleteCover && !values.cover) {
    formData.append('clearCover', JSON.stringify(true));
  }

  return formData;
}

export default buildAuthorFormData;
