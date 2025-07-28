import { useState, useEffect, useRef } from "react";
import { FaArrowRight } from "react-icons/fa";
import { getUniqueValues } from "../util/util";
import fetchBookables from "@/api/fetchBookables";
import Spinner from "@/UI/Spinner"; // Adjust the import path as necessary

export default function BookableList({ bookable, setBookable }) {
  console.log("BookableList", bookable);
  const [bookables, setBookables] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const nextButtonRef = useRef();
  const group = bookable?.group;
  useEffect(() => {
    setIsLoading(true);
    fetchBookables("http://localhost:3000/bookables")
      .then((bookables) => {
        setBookables(bookables);
        setBookable(bookables[0]);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, [setBookable]);

  const bookablesInGroup = bookables.filter((b) => b.group == group);
  const groups = getUniqueValues(bookables, "group");

  const changeBookable = (selectedBookable) => {
    setBookable(selectedBookable);
    nextButtonRef.current.focus();
  };

  const nextBookable = () => {
    const count = bookablesInGroup.length;
    const currentIndex = bookablesInGroup.indexOf(bookable);
    const nextIndex = (currentIndex + 1) % count;
    const nextBookable = bookables[nextIndex];
    setBookable(nextBookable);
  };

  const changeGroup = ({ target: { value } }) => {
    const selectedGroup = bookables.find((b) => b.group === value);
    setBookable(selectedGroup);
  };

  if (isLoading) {
    return <Spinner>Loading...</Spinner>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <div>
        <select value={group} onChange={changeGroup}>
          {groups.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <ul className="bookables items-list-nav">
          {bookablesInGroup.map((b) => {
            return (
              <li key={b.id} className={b.id == bookable.id ? "selected" : ""}>
                <button className="btn" onClick={() => changeBookable(b)}>
                  {b.title}
                </button>
              </li>
            );
          })}
        </ul>
        <p>
          <button className="btn" ref={nextButtonRef} onClick={nextBookable} autoFocus>
            <FaArrowRight />
            <span>Next</span>
          </button>
        </p>
      </div>
    </>
  );
}
