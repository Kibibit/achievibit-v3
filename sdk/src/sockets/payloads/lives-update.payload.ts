/**
 * example:
 * {
 *   "currentLives": 4,
 *   "extraLives": 2,
 *   "healDelta": 1,
 *   "damageDelta": -2,
 *   "extraDelta": 0
 * }
 */
export interface ILivesUpdatePayload {
  currentLives: number;
  extraLives: number;
  healDelta?: number;
  damageDelta?: number;
  extraDelta?: number;
};
