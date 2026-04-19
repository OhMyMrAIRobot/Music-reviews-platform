export type AlbumValueInfluenceRow = { title: string; text: string };

export type AlbumValueFormStrings = {
  sliderRange: string;
  rarity: {
    sectionMinMax: string;
    descriptionP1: string;
    descriptionP2: string;
    genreTitles: string[];
    genreTexts: string[];
    performanceTitles: string[];
    performanceTexts: string[];
    sliderGenreTitle: string;
    sliderPerformanceTitle: string;
  };
  integrity: {
    sectionMinMax: string;
    descriptionP1: string;
    descriptionP2: string;
    formatReleaseTexts: string[];
    genreTexts: string[];
    semanticTexts: string[];
  };
  depth: {
    sectionMinMax: string;
    description: string;
    sliderTitle: string;
    stepTexts: string[];
  };
  quality: {
    sectionMinMax: string;
    description: string;
    blockTitle: string;
    blockSubtitle: string;
  };
  influence: {
    sectionMinMax: string;
    descriptionP1: string;
    descriptionP2: string;
    authorPopularityTitles: string[];
    releaseAnticipTitles: string[];
    authorPopularityByStep: Record<string, AlbumValueInfluenceRow[]>;
    releaseAnticipByStep: Record<string, AlbumValueInfluenceRow[]>;
  };
};
