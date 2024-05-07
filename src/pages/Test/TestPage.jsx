import {useState, useEffect } from 'react'
const greetings = ['Hello', 'Hi', 'Hola'];
const getSize = () => {
  const { innerWidth, innerHeight } = window;
  return {
    width: innerWidth,
    height: innerHeight
  }
}

export default function TestPage() {
  const [index, setIndex] = useState(0);
  const [{ width, height }, setSize] = useState(getSize());
  useEffect(() => {
    document.title = greetings[index];
  });

  useEffect(() => {
    function handleResize() {
      setSize(getSize());
    }
    // handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  },[])

  const updateIndex = () => {
    const generateIndex = Math.floor(Math.random() * greetings.length);
    setIndex(generateIndex);
  }

  return (
    <>
      <div className="test btn" onClick={updateIndex}>Test</div>
      <div>Width: {width}, Height: {height }</div>
    </>
  )
}