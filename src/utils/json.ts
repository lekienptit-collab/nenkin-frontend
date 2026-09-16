export const parseJson = <T>(t: string | null | undefined): T | undefined => {
  if (!t) return undefined;
  try {
    return JSON.parse(t) as T;
  } catch (e) {
    return undefined;
  }
};
