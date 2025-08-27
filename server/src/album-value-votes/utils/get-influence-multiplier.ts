export const getInfluenceMultiplier = (points: number): number => {
  const map: Record<string, number> = {
    '1': 1.12,
    '2': 1.34,
    '3': 1.5,
    '4': 1.62,
    '5': 1.72,
    '6': 1.81,
    '7': 1.88,
    '8': 1.94,
    '9': 2.0,
  };
  const key = String(points);
  if (!(key in map)) {
    throw new Error(`Передан некорректное количество баллов влияния!`);
  }
  return map[key];
};
