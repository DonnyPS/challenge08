import _ from "lodash";

export function pagination(items, pageNumber, pageSize) {
  // Un = a + (n-1)b
  // Un = (n-1)b
  const startNumber = (pageNumber - 1) * pageSize;
  const movies = _(items).slice(startNumber).take(pageSize).value();
  return movies;
}
