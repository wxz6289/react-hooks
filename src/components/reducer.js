export const ACTION_TYPE = {
  SET_GROUP: 'SET_GROUP',
  SET_BOOKABLE: 'SET_BOOKABLE',
  TOGGLE_HAS_DETAILS: 'TOGGLE_HAS_DETAILS',
  NEXT_BOOKABLE: 'NEXT_BOOKABLE'
}

export default function reducer(state, action) {
  const count = state.bookables.filter(b => b.group == state.group).length;
  switch (action.type) {
    case ACTION_TYPE.SET_GROUP:
      return {
        ...state,
        group: action.payload,
        bookableIndex: 0
      };
    case ACTION_TYPE.SET_BOOKABLE:
      return {
        ...state,
        bookableIndex: action.payload
      }
    case ACTION_TYPE.TOGGLE_HAS_DETAILS:
      return {
        ...state,
        hasDetails: !state.hasDetails
      }
    case ACTION_TYPE.NEXT_BOOKABLE:
      return {
        ...state,
        bookableIndex: (state.bookableIndex + 1)%count
      }
    default:
      return state;
  }
}

