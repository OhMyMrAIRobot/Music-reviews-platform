export class ProfilePreferencesResponseDto {
  userId: string;
  artists: ProfilePreferenceItem[] | null;
  producers: ProfilePreferenceItem[] | null;
  tracks: ProfilePreferenceItem[] | null;
  albums: ProfilePreferenceItem[] | null;
}

class ProfilePreferenceItem {
  id: string;
  name: string;
  image: string;
}

export class QueryProfilePreferencesResponseDto extends Array<ProfilePreferencesResponseDto> {}
