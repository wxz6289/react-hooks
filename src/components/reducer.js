export const ACTION_TYPE = {
  SET_GROUP: 'SET_GROUP',
  SET_BOOKABLE: 'SET_BOOKABLE',
  TOGGLE_HAS_DETAILS: 'TOGGLE_HAS_DETAILS',
  NEXT_BOOKABLE: 'NEXT_BOOKABLE',
  FETCH_BOOKABLES_REQUEST: 'FETCH_BOOKABLES_REQUEST',
  FETCH_BOOKABLES_SUCCESS: 'FETCH_BOOKABLES_SUCCESS',
  FETCH_BOOKABLES_ERROR: 'FETCH_BOOKABLES_ERROR',
}

const ACTION_METHODS = {
  [ACTION_TYPE.SET_GROUP](state, action) {
    return { ...state, group: action.payload, bookableIndex: 0 };
  },
  [ACTION_TYPE.SET_BOOKABLE](state, action) {
    return { ...state, bookableIndex: action.payload };
  },
  [ACTION_TYPE.TOGGLE_HAS_DETAILS](state) {
    return { ...state, hasDetails: !state.hasDetails };
  },
  [ACTION_TYPE.NEXT_BOOKABLE](state) {
    const count = state.bookables.filter(b => b.group === state.group).length;
    const nextIndex = (state.bookableIndex + 1) % count;
    return { ...state, bookableIndex: nextIndex };
  },
  [ACTION_TYPE.FETCH_BOOKABLES_REQUEST](state) {
    return { ...state, isLoading: true, error: false };
  },
  [ACTION_TYPE.FETCH_BOOKABLES_SUCCESS](state, action) {
    return { ...state, isLoading: false, bookables: action.payload, error: false };
  },
  [ACTION_TYPE.FETCH_BOOKABLES_ERROR](state, action) {
    return { ...state, isLoading: false, error: action.payload };
  },
  default(state, action) {
    throw new Error(`Unknown action type: ${action.type}`);
  }
}

export default function BookableReducer(state, action) {
  const method = ACTION_METHODS[action.type] || ACTION_METHODS.default;
  return method(state, action);
}
