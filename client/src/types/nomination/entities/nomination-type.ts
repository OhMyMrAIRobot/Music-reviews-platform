import { NominationTypesEnum } from '../enums';

/**
 * Represents a nomination type entity.
 */
export type NominationType = {
  /** Nomination type id */
  id: string;

  /** Human-readable nomination type */
  type: NominationTypesEnum;
};
