import type { UpdateProfileData } from "../types/profile/forms/update-profile-data";

export interface IProfileFormValues extends UpdateProfileData {
  avatar?: File | null;
  cover?: File | null;
}

/**
 * Build FormData for profile update endpoint.
 * Appends only provided fields so caller can pass partial updates.
 */
export function buildProfileFormData(values: IProfileFormValues): FormData {
  const formData = new FormData();

  if (values.bio) {
    formData.append("bio", values.bio);
  }

  if (values.avatar) {
    formData.append("avatarImg", values.avatar);
  }

  if (values.cover) {
    formData.append("coverImg", values.cover);
  }

  if (values.clearAvatar && !values.avatar) {
    formData.append("clearAvatar", JSON.stringify(true));
  }

  if (values.clearCover && !values.cover) {
    formData.append("clearCover", JSON.stringify(true));
  }

  if (values.socials) {
    formData.append("socials", JSON.stringify(values.socials));
  }

  return formData;
}

export default buildProfileFormData;
