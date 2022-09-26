import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { login } from "../../redux/session";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [usernameFocus, setUsernameFocus] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordFocus, setPasswordFocus] = useState(false);

  const user = useAppSelector((state) => state.session.user);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await dispatch(login({ username, password }));
  }

  if (user) {
    return <Navigate to="/dupecord" />
  }

  return (
    <div className="fade_in w-full h-full flex flex-col justify-center items-center gap-8">
      <form
        onSubmit={handleSubmit}
        className="w-[80%] max-w-[600px] flex flex-col items-center gap-4"
      >
        <label
          className={`required self-start translate-y-12 translate-x-6 transition-all ease-in-out duration-500 ${
            (usernameFocus || username.length) && "translate-y-2 -translate-x-2"
          }`}
          onMouseEnter={() => setUsernameFocus(true)}
          htmlFor="username"
        >
          Username
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onMouseEnter={() => setUsernameFocus(true)}
          onMouseLeave={() => setUsernameFocus(false)}
          type="text"
          required
          name="username"
          className="w-full p-2 border border-gray-500 rounded"
        />

        <label
          className={`required self-start translate-y-12 translate-x-6 transition-all ease-in-out duration-500 ${
            (passwordFocus || password.length) && "translate-y-2 -translate-x-2"
          }`}
          onMouseEnter={() => setPasswordFocus(true)}
          htmlFor="password"
        >
          Password
        </label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onMouseEnter={() => setPasswordFocus(true)}
          onMouseLeave={() => setPasswordFocus(false)}
          type="password"
          required
          name="password"
          className="w-full p-2 border border-gray-500 rounded"
        />
        <div className="w-full flex justify-between items-center pt-10">
          <button type="button" onClick={() => navigate('/signup')} className="text-xl self-end border-neutral-600">
            Sign Up
          </button>
          <label className="text-xl">OR</label>
          <button type="submit" className="text-xl self-end border-neutral-600">
            Log In
          </button>
        </div>
      </form>
    </div>
  );
}