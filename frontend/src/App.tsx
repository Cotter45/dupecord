import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Nav from './components/nav'
import Router from './context/router'
import { getLikedMesssages } from './redux/api'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { restore } from './redux/session'

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();

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
      {!location.pathname.includes("dupecord") && <Nav />}
      {/* <Nav /> */}
      <main className="w-full h-[calc(100vh)] overflow-y-auto flex flex-col gap-12 items-center overflow-x-hidden">
        <Router />
      </main>
    </div>
  );
}

export default App
