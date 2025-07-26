import { useCounter } from '@util/reducer';

function Counter() {
  const { count, increment, incrementBy, decrement, decrementBy, reset } = useCounter(0);
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <p className='m-4 text-2xl'>Current Count: {count}</p>
      <div className='flex items-center'>
        <button className='ml-2' onClick={increment}>Increment</button>
        <button className='ml-2' onClick={decrement}>Decrement</button>
        <button className='ml-2' onClick={() => incrementBy(5)}>Increment by 5</button>
        <button className='ml-2' onClick={() => decrementBy(12)}>Decrement by 12</button>
        <button className='ml-2' onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

export default Counter;