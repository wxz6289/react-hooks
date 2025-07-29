import { getBookings } from "@util/api";
import { useEffect, useMemo, useState, Fragment } from "react";
import { getGrid, transformBookings } from "./grid-builder";
import Spinner from "@/UI/Spinner";

export default function BookingsGrid(props) {
  const { week, bookable, booking, setBooking } = props;
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const { grid, sessions, dates } = useMemo(() => {
    if (!bookable) return { grid: {}, sessions: [], dates: [] };
    return getGrid(bookable, week.start);
  }, [bookable, week.start]);

  useEffect(() => {
    if (bookable) {
      let doUpdate = true;

      setBookings(null);
      setError(false);
      setBooking(null);

      getBookings(bookable.id, week.start, week.end)
        .then((resp) => {
          if (doUpdate) {
            setBookings(transformBookings(resp));
          }
        })
        .catch(setError);

      return () => (doUpdate = false);
    }
  }, [week, bookable, setBooking]);

  function cell(session, date) {
    const cellData = bookings?.[session]?.[date] || grid[session][date];

    const isSelected = booking?.session === session && booking?.date === date;

    return (
      <td
        key={date}
        className={isSelected ? "selected" : null}
        onClick={bookings ? () => setBooking(cellData) : null}
      >
        {cellData.title}
      </td>
    );
  }

  if (!grid) {
    return <p>Loading...</p>;
  }

  return (
    <Fragment>
      {error && (
        <p className="bookingsError">
          {`There was a problem loading the bookings data (${error})`}
        </p>
      )}
      <table className={bookings ? "bookingsGrid active" : "bookingsGrid"}>
        <thead>
          <tr>
            <th>
              <span className="status">
                <Spinner />
              </span>
            </th>
            {dates.map((d) => (
              <th key={d}>{new Date(d).toDateString()}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sessions.map((session) => (
            <tr key={session}>
              <th>{session}</th>
              {dates.map((date) => cell(session, date))}
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
}
