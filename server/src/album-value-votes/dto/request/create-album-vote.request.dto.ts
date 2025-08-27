import { IsIn, IsInt, Max, Min } from 'class-validator';
import {
  INFLUENCE_LEVELS,
  INTEGRITY_GENRE_LEVELS,
  INTEGRITY_SEMANTIC_LEVELS,
  RARITY_LEVELS,
} from 'src/album-value-votes/constants/album-values.constants';
import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';

// Хелпер для красивого вывода допустимых значений в сообщениях валидации
const list = (arr: readonly (number | string)[]) => arr.join(', ');

export class CreateAlbumVoteRequestDto {
  @IsEntityId()
  releaseId: string;

  @IsIn([...RARITY_LEVELS], {
    message: `Оценка "Редкость жанра" должна быть одним из значений: ${list(RARITY_LEVELS)}`,
  })
  rarityGenre: number;

  @IsIn([...RARITY_LEVELS], {
    message: `Оценка "Редкость формата исполнения" должна быть одним из значений: ${list(RARITY_LEVELS)}`,
  })
  rarityPerformance: number;

  @IsInt({ message: 'Оценка "Формат релиза" должна быть целым числом' })
  @Min(0, { message: 'Оценка "Формат релиза" не может быть меньше 0' })
  @Max(1, { message: 'Оценка "Формат релиза" не может быть больше 1' })
  formatReleaseScore: number;

  @IsIn([...INTEGRITY_GENRE_LEVELS], {
    message: `Оценка "Жанровая целостность" должна быть одним из значений: ${list(INTEGRITY_GENRE_LEVELS)}`,
  })
  integrityGenre: number;

  @IsIn([...INTEGRITY_SEMANTIC_LEVELS], {
    message: `Оценка "Смысловая целостность" должна быть одним из значений: ${list(INTEGRITY_SEMANTIC_LEVELS)}`,
  })
  integritySemantic: number;

  @IsInt({ message: 'Оценка "Глубина" должна быть целым числом' })
  @Min(1, { message: 'Оценка "Глубина" не может быть меньше 1' })
  @Max(5, { message: 'Оценка "Глубина" не может быть больше 5' })
  depthScore: number;

  @IsInt({ message: 'Оценка "Рифмы/образы" должна быть целым числом' })
  @Min(1, { message: 'Оценка "Рифмы/образы" не может быть меньше 1' })
  @Max(10, { message: 'Оценка "Рифмы/образы" не может быть больше 10' })
  qualityRhymesImages: number;

  @IsInt({ message: 'Оценка "Структура/ритмика" должна быть целым числом' })
  @Min(1, { message: 'Оценка "Структура/ритмика" не может быть меньше 1' })
  @Max(10, { message: 'Оценка "Структура/ритмика"не может быть больше 10' })
  qualityStructureRhythm: number;

  @IsInt({ message: 'Оценка "Реализация стиля" должна быть целым числом' })
  @Min(1, { message: 'Оценка "Реализация стиля" не может быть меньше 1' })
  @Max(10, { message: 'Оценка "Реализация стиля" не может быть больше 10' })
  qualityStyleImpl: number;

  @IsInt({
    message: 'Оценка "Индивидуальность/харизма" должна быть целым числом',
  })
  @Min(1, {
    message: 'Оценка "Индивидуальность/харизма" не может быть меньше 1',
  })
  @Max(10, {
    message: 'Оценка "Индивидуальность/харизма" не может быть больше 10',
  })
  qualityIndividuality: number;

  @IsIn([...INFLUENCE_LEVELS], {
    message: `Оценка "Известность автора" должна быть одним из значений: ${list(INFLUENCE_LEVELS)}`,
  })
  influenceAuthorPopularity: number;

  @IsIn([...INFLUENCE_LEVELS], {
    message: `Оценка "Ожидание релиза" должна быть одним из значений: ${list(INFLUENCE_LEVELS)}`,
  })
  influenceReleaseAnticip: number;
}
