export function getUniqueValues(array, property) {
  const propValues = array.map((item) => item[property]);
  return Array.from(new Set(propValues));
}
