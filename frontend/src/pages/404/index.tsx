import { useNavigate } from "react-router-dom";

export default function FourOhFour() {
  const navigate = useNavigate();
  return (
    <main className="fade_in w-screen h-full flex flex-col justify-center items-center gap-8">
      <h1 className="text-4xl">404</h1>
      <h2 className="text-2xl">Page not found</h2>
      <button type="submit" className="border-neutral-600" onClick={() => navigate('/')}>
          Go home
      </button>
    </main>
  )
}