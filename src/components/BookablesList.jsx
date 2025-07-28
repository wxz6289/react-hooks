import { days, sessions } from '@data/static.json';
import { useReducer, useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa'
import { getUniqueValues } from '../util/util'
import fetchBookables from '@/api/fetchBookables';
import Spinner from '@/UI/Spinner';// Adjust the import path as necessary
import reducer, { ACTION_TYPE } from './reducer'

const initState = {
  group: 'Rooms',
  bookableIndex: 0,
  hasDetails: false,
  bookables: [],
  isLoading: false,
  error: false,
}

export default function BookableList() {
  const [{ group, bookableIndex, hasDetails, bookables, isLoading, error }, dispatch] = useReducer(reducer, initState, (initial) => {
    console.log('initial state', initial);
    return initial;
  });
  useEffect(() => {
    dispatch({ type: ACTION_TYPE.FETCH_BOOKABLES_REQUEST });
    fetchBookables('http://localhost:3000/bookables')
      .then(data => {
        dispatch({ type: ACTION_TYPE.FETCH_BOOKABLES_SUCCESS, payload: data });
      })
      .catch(error => {
        dispatch({ type: ACTION_TYPE.FETCH_BOOKABLES_ERROR, payload: error.message });
      });
  }, []);

  const bookablesInGroup = bookables.filter((b) => b.group == group);
  const bookable = bookablesInGroup[bookableIndex];
  const groups = getUniqueValues(bookables, 'group');

  const changeBookable = (selectedIndex) => {
    dispatch({ type: ACTION_TYPE.SET_BOOKABLE, payload: selectedIndex })
  }

  const nextBookable = () => {
    dispatch({ type: ACTION_TYPE.NEXT_BOOKABLE })
  }

  const changeGroup = ({ target: { value } }) => {
    dispatch({ type: ACTION_TYPE.SET_GROUP, payload: value })
  }

  const toggleDetails = () => {
    dispatch({ type: ACTION_TYPE.TOGGLE_HAS_DETAILS })
  }

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
          {groups.map(g => <option key={g}>{g}</option>)}
        </select>
        <ul className='bookables items-list-nav'>
          {
            bookablesInGroup.map((b, i) => {
              return (
                <li key={b.id} className={i == bookableIndex ? 'selected' : ''}>
                  <button className='btn' onClick={() => changeBookable(i)}>{b.title}</button>
                </li>
              )
            })
          }
        </ul>
        <p>
          <button className='btn' onClick={nextBookable} autoFocus>
            <FaArrowRight />
            <span>Next</span>
          </button>
        </p>
      </div>
      {bookable && (
        <div className='bookable-details'>
          <div className='item'>
            <div className='item-header'>
              <h2 className='font-bold p-4'>{bookable.title}</h2>
              <span className='controls'>
                <label>
                  <input type='checkbox'
                    checked={hasDetails}
                    onChange={toggleDetails} />
                </label>
                Show Details
              </span>
            </div>
            <p>{bookableIndex.notes}</p>
            {hasDetails && (
              <div className='items-details'>
                <h3>Availability</h3>
                <div className='bookable-availability'>
                  <ul>{
                    bookable.days.sort().map(d => <li key={d}>{days[d]}</li>)
                  }</ul>
                  <ul>
                    {bookable.sessions.map(s => <li key={s}>{sessions[s]}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}