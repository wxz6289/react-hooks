import { days, sessions } from '@data/static.json';
import { useReducer, useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa'
import { getUniqueValues } from '../util/util'
import fetchBookables from '@/api/fetchBookables';
import Spinner from '@/UI/Spinner';// Adjust the import path as necessary
import reducer, { ACTION_TYPE } from './reducer'


export default function BookableList({ state, dispatch }) {
  console.log('BookableList');
  const { group, bookableIndex, bookables, isLoading, error } = state;
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
    </>
  )
}