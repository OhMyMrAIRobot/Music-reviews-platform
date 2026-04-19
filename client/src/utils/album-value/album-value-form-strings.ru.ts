import type { AlbumValueFormStrings } from './album-value-form-strings.types';

export const albumValueFormStringsRu: AlbumValueFormStrings = {
  sliderRange: '({{min}} to {{max}})',
  rarity: {
    sectionMinMax: '(from 1 to 5)',
    descriptionP1:
      'How common the genre is and how common the performance format is in the industry',
    descriptionP2:
      'Calculated as the combination of “Genre rarity” and “Performance format rarity”',
    genreTitles: ['Common genre', 'Rare genre', 'Unique genre'],
    genreTexts: [
      'Widely represented in the Russian-speaking industry, often reproduced by different artists and easily recognizable',
      'Limited presence, niche, for a narrow audience. May feature heavy overload or loud intentional minimalism',
      'Almost or fully absent in the Russian-speaking field; needs special context. Art object, noise improvisation, anti-form',
    ],
    performanceTitles: [
      'Common performance format',
      'Rare performance format',
      'Unique performance format',
    ],
    performanceTexts: [
      'Classic flow or singing format. Common and/or academic implementation suitable for popular music',
      'Unusual flow or vocal pattern, unique timbre. Rare approach in sound design, a cappella',
      'Improvisation, breaking form, fragmentation, performative elements. A unique style created by the author',
    ],
    sliderGenreTitle: 'Genre rarity',
    sliderPerformanceTitle: 'Performance format rarity',
  },
  integrity: {
    sectionMinMax: '(from 1 to 5)',
    descriptionP1: 'Release format and its genre and narrative consistency',
    descriptionP2:
      'Calculated as the combination of “Release format”, “Genre consistency”, and “Narrative consistency”',
    formatReleaseTexts: [
      'EP (4–6 tracks), or a larger EP declared by the author. Deluxe (if not declared as expanding the album concept). Mixtape. Compilation. Reissue. Acoustic version. Live recording',
      'LP (7+ tracks), or a conceptual album with fewer tracks (3+) declared by the author. Deluxe (if declared as a coherent extension of the concept)',
    ],
    genreTexts: [
      'A collection of different genre ideas without a single concept',
      'Release built from two or three genre ideas',
      'All tracks share one genre idea, or a coherent sound experiment where order forms a structure and development',
    ],
    semanticTexts: [
      'The release has no overall narrative consistency',
      'All tracks form one coherent narrative',
    ],
  },
  depth: {
    sectionMinMax: '(from 1 to 5)',
    description:
      'Meaning vertical: from playing with sound and instinct to personal reflection, social thought, and timeless meaning',
    sliderTitle: 'Depth',
    stepTexts: [
      'Instrumental music or words as a repeating set of sounds (often electronic)',
      'Light entertainment with plain drama and conflict (represent tracks, disses, caricature, parody, or humor)',
      'Sensitive self-reflection on identity in modern society or personal drama',
      'Deep reasoning about public life and current social phenomena',
      'Conscious delivery of timeless or elevated meaning as the core of the release (religion, universe, life and death, historical processes)',
    ],
  },
  quality: {
    sectionMinMax: '(in percent)',
    description:
      'How fully the release realizes four base criteria (“rhymes/imagery”, “structure/rhythm”, “style execution”, “individuality/charisma”), where 1 point per criterion = 2.5%',
    blockTitle: 'Base criteria of the 90-point release scoring system',
    blockSubtitle: '(from 4 to 40)',
  },
  influence: {
    sectionMinMax: '(from 1.12 to 2.00)',
    descriptionP1:
      'Potential significance of the release for the music industry',
    descriptionP2:
      'The multiplier combines “Author recognition” and “Release anticipation”',
    authorPopularityTitles: [
      'Author is unknown',
      'Author is little known',
      'Author is fairly well known',
      'Author is very well known',
      'Author is among the most famous',
    ],
    releaseAnticipTitles: [
      'No one is waiting for the album',
      'Expectations are minor',
      'Expectations are moderate',
      'Huge expectations',
      'The album is an event',
    ],
    authorPopularityByStep: {
      '0.5': [
        { title: 'Concerts', text: 'None or rare warm-up slots' },
        { title: 'Media presence', text: 'Not mentioned' },
        { title: 'Streaming & audience', text: '< 5K monthly listeners' },
        { title: 'Social (Telegram, VK)', text: '< 500 followers' },
        { title: 'Collaborations', text: 'None' },
        { title: 'Videos', text: '< 5K views' },
      ],
      '1.5': [
        { title: 'Concerts', text: 'Occasional club shows' },
        { title: 'Media presence', text: 'Mentioned in small communities' },
        { title: 'Streaming & audience', text: '5K – 100K' },
        { title: 'Social (Telegram, VK)', text: '500 – 5K' },
        { title: 'Collaborations', text: 'With peers at similar level' },
        { title: 'Videos', text: '5K – 50K' },
      ],
      '2.5': [
        { title: 'Concerts', text: 'Club shows / festivals' },
        { title: 'Media presence', text: 'Featured in playlists, media' },
        { title: 'Streaming & audience', text: '100K – 1M' },
        { title: 'Social (Telegram, VK)', text: '5K – 30K' },
        { title: 'Collaborations', text: 'With niche / rising artists' },
        { title: 'Videos', text: '50K – 300K' },
      ],
      '3.5': [
        { title: 'Concerts', text: 'Touring activity' },
        {
          title: 'Media presence',
          text: 'Often covered, own talking points',
        },
        { title: 'Streaming & audience', text: '1M – 5M' },
        { title: 'Social (Telegram, VK)', text: '30K – 100K' },
        { title: 'Collaborations', text: 'With mainstream acts' },
        { title: 'Videos', text: '300K – 1M' },
      ],
      '4.5': [
        { title: 'Concerts', text: 'Stadiums, festival headliner' },
        { title: 'Media presence', text: 'Mass media presence' },
        { title: 'Streaming & audience', text: '> 5M' },
        { title: 'Social (Telegram, VK)', text: '> 100K' },
        { title: 'Collaborations', text: 'With top artists' },
        { title: 'Videos', text: '> 1M' },
      ],
    },
    releaseAnticipByStep: {
      '0.5': [
        { title: 'Announcements', text: 'No announcement, dropped suddenly' },
        {
          title: 'Buzz',
          text: 'Release is not discussed (no resonance)',
        },
        { title: 'Promo campaign', text: 'Absent entirely' },
        { title: 'First-day / week streams', text: 'Low' },
        {
          title: 'Charts & playlists',
          text: 'Numbers vary. Idea: did the release “own Friday” — Yandex Music, Apple Music, VK/Spotify charts and playlists',
        },
      ],
      '1.5': [
        {
          title: 'Announcements',
          text: 'Announcement exists but reach is minimal',
        },
        {
          title: 'Buzz',
          text: 'Rare mentions (expected only among core fans)',
        },
        { title: 'Promo campaign', text: '1–2 posts or stories' },
        {
          title: 'First-day / week streams',
          text: 'Weak but slightly above minimum',
        },
        {
          title: 'Charts & playlists',
          text: 'Numbers vary. Idea: did the release “own Friday” — Yandex Music, Apple Music, VK/Spotify charts and playlists',
        },
      ],
      '2.5': [
        {
          title: 'Announcements',
          text: 'Announcement with trailer / posts, medium reach. Or “background” anticipation for a major artist (“very well known”) who has not released in a long time',
        },
        {
          title: 'Buzz',
          text: 'Fan discussions, local anticipation',
        },
        { title: 'Promo campaign', text: 'Video / poster / posts' },
        {
          title: 'First-day / week streams',
          text: 'Moderate',
        },
        {
          title: 'Charts & playlists',
          text: 'Numbers vary. Idea: did the release “own Friday” — Yandex Music, Apple Music, VK/Spotify charts and playlists',
        },
      ],
      '3.5': [
        {
          title: 'Announcements',
          text: 'Large-scale announcement, hype in socials. Or “background” anticipation for a superstar (“among the most famous”) who has not released in a long time',
        },
        {
          title: 'Buzz',
          text: 'Active discussions in socials and communities, mass anticipation',
        },
        {
          title: 'Promo campaign',
          text: 'Several media pieces, interviews, playlists',
        },
        { title: 'First-day / week streams', text: 'High' },
        {
          title: 'Charts & playlists',
          text: 'Numbers vary. Idea: did the release “own Friday” — Yandex Music, Apple Music, VK/Spotify charts and playlists',
        },
      ],
      '4.5': [
        {
          title: 'Announcements',
          text: 'Long teasers, date known early, media builds interest',
        },
        {
          title: 'Buzz',
          text: 'Mass anticipation, memes, forums, discussed as a cultural moment',
        },
        {
          title: 'Promo campaign',
          text: 'Full-scale promo: offline activations, banners, campaigns',
        },
        {
          title: 'First-day / week streams',
          text: 'Very high',
        },
        {
          title: 'Charts & playlists',
          text: 'Numbers vary. Idea: did the release “own Friday” — Yandex Music, Apple Music, VK/Spotify charts and playlists',
        },
      ],
    },
  },
};
