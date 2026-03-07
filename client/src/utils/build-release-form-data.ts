import { Release, ReleaseType } from "../types/release";
import { IReleaseFormValues } from "../types/release/forms/release-form-values";
import { arraysEqual } from "./arrays-equal";

/**
 * Build FormData for release create/update endpoints.
 * If `existing` is provided, fields that did not change are omitted (to keep patch payload small).
 */
export function buildReleaseFormData(
  values: IReleaseFormValues,
  types: ReleaseType[],
  existing?: Release | null,
): FormData {
  const formData = new FormData();

  if (values.cover) {
    formData.append("coverImg", values.cover);
  }

  if (values.deleteCover && !values.cover) {
    formData.append("clearCover", JSON.stringify(true));
  }

  if (!existing || existing.title !== values.title) {
    formData.append("title", values.title);
  }

  if (!existing || existing.publishDate !== values.publishDate) {
    formData.append("publishDate", values.publishDate);
  }

  const releaseType = types.find((entry) => entry.type === values.type);
  if (releaseType && (!existing || existing.releaseType.type !== values.type)) {
    formData.append("releaseTypeId", releaseType.id);
  }

  const mapOrEmpty = (
    key: string,
    selected: IReleaseFormValues["selectedArtists"],
  ) => {
    if (!existing) {
      if (selected.length === 0) {
        formData.append(key, "[]");
      } else {
        selected.forEach((s) => formData.append(key, s.id));
      }
      return;
    }

    const existingNames = (
      key === "releaseArtists[]"
        ? existing.authors.artists.map((a) => a.name)
        : key === "releaseProducers[]"
          ? existing.authors.producers.map((a) => a.name)
          : existing.authors.designers.map((a) => a.name)
    ).sort();

    const selectedNames = selected.map((s) => s.name).sort();

    if (!arraysEqual(existingNames, selectedNames)) {
      if (selected.length === 0) {
        formData.append(key, "[]");
      } else {
        selected.forEach((s) => formData.append(key, s.id));
      }
    }
  };

  mapOrEmpty("releaseArtists[]", values.selectedArtists);
  mapOrEmpty("releaseProducers[]", values.selectedProducers);
  mapOrEmpty("releaseDesigners[]", values.selectedDesigners);

  return formData;
}

export default buildReleaseFormData;
