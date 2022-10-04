import { useEffect, useState } from 'react'
import Nav from './components/nav'
import Router from './context/router'
import { getLikedMesssages } from './redux/api'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { restore } from './redux/session'

function App() {
  const dispatch = useAppDispatch();

  const [loaded, setLoaded] = useState(false);
  const user = useAppSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(restore());
  }, [])
  
  useEffect(() => {
    if (!user || loaded) return;
    dispatch(getLikedMesssages(user.id));
    setLoaded(true);
  }, [user, loaded, dispatch])

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
