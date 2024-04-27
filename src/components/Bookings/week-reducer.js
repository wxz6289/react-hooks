import { getWeek } from '@util/util';

export const ACTION_TYPE = {
  NEXT_WEEK: 'NEXT_WEEK',
  PREV_WEEK: 'PREV_WEEK',
  TODAY: 'TODAY',
  SET_DATE: 'SET_DATE'
}

export default function reducer(state, action) {
  switch (action.type) {
    case ACTION_TYPE.NEXT_WEEK:
      return getWeek(state.date, 7);
    case ACTION_TYPE.PREV_WEEK:
      return getWeek(state.date, -7);
    case ACTION_TYPE.TODAY:
      return getWeek(new Date());
    case ACTION_TYPE.SET_DATE:
      return getWeek(new Date(action.payload));
    default:
      return state;
  }
}