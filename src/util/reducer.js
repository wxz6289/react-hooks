import { useReducer } from 'react';

function reducer(state, action) {
  const handlers = {
    increment: (state) => ({ count: state.count + 1 }),
    incrementBy: (state, action) => ({ count: state.count + action.payload }),
    decrement: (state) => ({ count: state.count - 1 }),
    decrementBy: (state, action) => ({ count: state.count - action.payload }),
    reset: () => ({ count: 0 })
  };
  if (!handlers[action.type]) {
    throw new Error(`Unknown action type: ${action.type}`);
  }
  return handlers[action.type](state, action);
}

export function useCounter(initialCount = 0) {
  const [state, dispatch] = useReducer(reducer, { count: initialCount });

  const increment = () => dispatch({ type: 'increment' });
  const decrement = () => dispatch({ type: 'decrement' });
  const incrementBy = (value) => dispatch({ type: 'incrementBy', payload: value });
  const decrementBy = (value) => dispatch({ type: 'decrementBy', payload: value });
  const reset = () => dispatch({ type: 'reset' });

  return {
    count: state.count,
    increment,
    decrement,
    incrementBy,
    decrementBy,
    reset,
  };
}

/*
let count = reducer({ count: 0 }, { type: 'increment' }).count;
console.log(count); // 1
count = reducer({ count: 1 }, { type: 'decrement' }).count;
console.log(count); // 0
count = reducer({ count: 5 }, { type: 'decrement' }).count;
console.log(count); // 4
count = reducer({ count: 10 }, { type: 'incrementBy', payload: 5 }).count;
console.log(count); // 15
count = reducer({ count: 15 }, { type: 'decrementBy', payload: 12 }).count;
console.log(count); // 3
*/