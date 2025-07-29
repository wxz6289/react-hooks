export default function fetchData(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Fetch error:', error);
      throw error;
    });
}

import { shortISO } from '@util/date-wrangler';

export function getBookings(bookableId, startDate, endDate) {

  const start = shortISO(startDate);
  const end = shortISO(endDate);

  const urlRoot = "http://localhost:3000/bookings";

  const query = `bookableId=${bookableId}` +
    `&date_gte=${start}&date_lte=${end}`;

  return fetchData(`${urlRoot}?${query}`);
}