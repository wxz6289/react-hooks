import {useState, useCallback, Fragment} from "react";
import BookablesList from "./BookablesList";
import BookableDetails from "./BookableDetails";


export default function BookablesView () {
  const [bookable, setBookable] = useState([]);
  console.log('BookablesView');

/*   const updateBookable = useCallback((selected) => {
    if (selected) {
      selected.lastShown = Date.now();
      setBookable(selected);
    }
  }, []); */

  return (
    <Fragment>
      <BookablesList bookable={bookable} setBookable={setBookable}/>
      <BookableDetails bookable={bookable}/>
    </Fragment>
  );
}