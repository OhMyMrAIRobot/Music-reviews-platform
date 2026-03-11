import { ROUTES } from '../routes/routes-enum';
import { SearchTypesEnum } from '../types/common/enums/search-types-enum';

/**
 * Custom hook providing navigation path generators for the application.
 * This hook returns an object with functions that generate URL paths for various routes
 * in the application, using predefined route constants.
 *
 * @returns An object containing navigation path generator functions.
 */
const useNavigationPath = () => {
  /**
   * Generates the path to the main page.
   * @returns The path to the main page.
   */
  const navigateToMain = `${ROUTES.MAIN}`;

  /**
   * Generates the path to the login page.
   * @returns The path to the login page.
   */
  const navigateToLogin = `/${ROUTES.AUTH.PREFIX}/${ROUTES.AUTH.LOGIN}`;

  /**
   * Generates the path to the registration page.
   * @returns The path to the registration page.
   */
  const navigateToRegistration = `/${ROUTES.AUTH.PREFIX}/${ROUTES.AUTH.REGISTER}`;

  /**
   * Generates the path to the password reset request page.
   * @returns The path to the password reset request page.
   */
  const navigateToRequestReset = `/${ROUTES.AUTH.PREFIX}/${ROUTES.AUTH.REQUEST_RESET}`;

  /**
   * Generates the path to the account activation page.
   * @returns The path to the account activation page.
   */
  const navigateToActivation = `/${ROUTES.AUTH.PREFIX}/${ROUTES.AUTH.ACTIVATE}`;

  /**
   * Generates the path to the feedback page.
   * @returns The path to the feedback page.
   */
  const navigateToFeedback = `/${ROUTES.FEEDBACK}`;

  /**
   * Generates the path to the releases page.
   * @returns The path to the releases page.
   */
  const navigateToReleases = `/${ROUTES.RELEASES}`;

  /**
   * Generates the path to the authors page.
   * @returns The path to the authors page.
   */
  const navigateToAuthors = `/${ROUTES.AUTHORS}`;

  /**
   * Generates the path to the registered authors page.
   * @returns The path to the registered authors page.
   */
  const navigateToRegisteredAuthors = `/${ROUTES.REGISTERED_AUTHORS}`;

  /**
   * Generates the path to the reviews page.
   * @returns The path to the reviews page.
   */
  const navigateToReviews = `/${ROUTES.REVIEWS}`;

  /**
   * Generates the path to the media reviews page.
   * @returns The path to the media reviews page.
   */
  const navigateToMediaReviews = `/${ROUTES.MEDIA_REVIEWS}`;

  /**
   * Generates the path to the author comments page.
   * @returns The path to the author comments page.
   */
  const navigateToAuthorComments = `/${ROUTES.AUTHOR_COMMENTS}`;

  /**
   * Generates the path to the author likes page.
   * @returns The path to the author likes page.
   */
  const navigateToAuthorLikes = `/${ROUTES.AUTHOR_LIKES}`;

  /**
   * Generates the path to the leaderboard page.
   * @returns The path to the leaderboard page.
   */
  const navigateToLeaderboard = `/${ROUTES.LEADERBOARD}`;

  /**
   * Generates the path to the ratings page.
   * @returns The path to the ratings page.
   */
  const navigateToRatings = `/${ROUTES.RATINGS}`;

  /**
   * Generates the path to the edit profile page.
   * @returns The path to the edit profile page.
   */
  const navigateToEditProfile = `/${ROUTES.EDIT_PROFILE}`;

  /**
   * Generates the path to the author confirmation page.
   * @returns The path to the author confirmation page.
   */
  const navigateToAuthorConfirmation = `/${ROUTES.AUTHOR_CONFIRMATION}`;

  /**
   * Generates the path to the awards page.
   * @returns The path to the awards page.
   */
  const navigateToAwards = `/${ROUTES.AWARDS}`;

  /**
   * Generates the path to the nomination votes page.
   * @returns The path to the nomination votes page.
   */
  const navigateToVotes = `/${ROUTES.NOMINATION_VOTES}`;

  /**
   * Generates the path to the album values page.
   * @returns The path to the album values page.
   */
  const navigateToAlbumValues = `/${ROUTES.ALBUM_VALUES}`;

  /**
   * Generates the path to the admin users page.
   * @returns The path to the admin users page.
   */
  const navigateToAdminUsers = `/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.USERS}`;

  /**
   * Generates the path to the admin authors page.
   * @returns The path to the admin authors page.
   */
  const navigateToAdminAuthors = `/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.AUTHORS}`;

  /**
   * Generates the path to the admin releases page.
   * @returns The path to the admin releases page.
   */
  const navigateToAdminReleases = `/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.RELEASES}`;

  /**
   * Generates the path to the admin reviews page.
   * @returns The path to the admin reviews page.
   */
  const navigateToAdminReviews = `/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.REVIEWS}`;

  /**
   * Generates the path to the admin feedback page.
   * @returns The path to the admin feedback page.
   */
  const navigateToAdminFeedback = `/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.FEEDBACK}`;

  /**
   * Generates the path to the admin media page.
   * @returns The path to the admin media page.
   */
  const navigateToAdminMedia = `/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.MEDIA}`;

  /**
   * Generates the path to the admin author comments page.
   * @returns The path to the admin author comments page.
   */
  const navigateToAdminAuthorComments = `/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.AUTHOR_COMMENTS}`;

  /**
   * Generates the path to the admin author confirmation page.
   * @returns The path to the admin author confirmation page.
   */
  const navigateToAdminAuthorConfirmation = `/${ROUTES.ADMIN.PREFIX}/${ROUTES.ADMIN.AUTHOR_CONFIRMATION}`;

  /**
   * Generates the path to the release details page for a specific release ID.
   * @param id - The ID of the release.
   * @returns The path to the release details page.
   */
  const navigateToReleaseDetails = (id: string) =>
    `/${ROUTES.RELEASE_DETAILS_PREFIX}/${id}`;

  /**
   * Generates the path to the author details page for a specific author ID.
   * @param id - The ID of the author.
   * @returns The path to the author details page.
   */
  const navigateToAuthorDetails = (id: string) =>
    `/${ROUTES.AUTHOR_DETAILS_PREFIX}/${id}`;

  /**
   * Generates the path to the search page with specified type and query.
   * @param type - The type of search (e.g., authors or releases).
   * @param query - The search query string.
   * @returns The path to the search page with encoded query.
   */
  const navigateToSearch = (type: SearchTypesEnum, query: string) =>
    `/${ROUTES.SEARCH_PREFIX}/${type}?query=${encodeURIComponent(query)}`;

  /**
   * Generates the path to the profile page for a specific user ID.
   * @param id - The ID of the user.
   * @returns The path to the profile page.
   */
  const navigatoToProfile = (id: string) => `/${ROUTES.PROFILE_PREFIX}/${id}`;

  return {
    navigateToLogin,
    navigateToRegistration,
    navigateToRequestReset,
    navigateToMain,
    navigateToFeedback,
    navigateToReleaseDetails,
    navigateToAuthors,
    navigateToReviews,
    navigateToReleases,
    navigateToAuthorDetails,
    navigateToLeaderboard,
    navigateToRatings,
    navigateToSearch,
    navigatoToProfile,
    navigateToEditProfile,
    navigateToActivation,
    navigateToAdminUsers,
    navigateToAdminAuthors,
    navigateToAdminReleases,
    navigateToAdminReviews,
    navigateToAdminFeedback,
    navigateToAdminMedia,
    navigateToMediaReviews,
    navigateToAuthorComments,
    navigateToRegisteredAuthors,
    navigateToAdminAuthorComments,
    navigateToAuthorConfirmation,
    navigateToAuthorLikes,
    navigateToAdminAuthorConfirmation,
    navigateToAwards,
    navigateToVotes,
    navigateToAlbumValues,
  };
};

export default useNavigationPath;
