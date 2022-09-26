import { useEffect, useState } from 'react'
import Nav from './components/nav'
import Router from './context/router'
import { useAppDispatch } from './redux/hooks'
import { restore } from './redux/session'
import { authFetch } from './util/authFetch'

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restore());
  }, [])

  return (
    <div className="w-screen min-h-screen h-full bg-neutral-800">
      <Nav />
      <main className="w-full h-[calc(100vh-80px)] overflow-y-auto flex flex-col gap-12 items-center">
        <Router />
      </main>
    </div>
  );
}

export default App
