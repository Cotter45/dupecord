import { FormEvent, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { signup } from "../../redux/session";

export default function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordConfirmFocused, setPasswordConfirmFocused] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const user = useAppSelector((state) => state.session.user);

  useEffect(() => {
    if (!password.length) return;
    if (!passwordConfirm.length) return;
    if (passwordConfirm.length < password.length) return;
    if (passwordConfirm !== password) {
      setErrors((errors) => ({
        ...errors,
        passwordConfirm: "Passwords do not match",
      }));
    } else {
      setErrors((errors) => ({ ...errors, passwordConfirm: "" }));
    }
  }, [password, passwordConfirm]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await dispatch(signup({ email, password, username }));
    if (res.meta.requestStatus === "rejected") {
      const message = res.payload?.message;
      if (message.includes('Username')) {
        setErrors({ username: message });
      }
      if (message.includes('Email')) {
        setErrors({ email: message });
      }
    }
    setLoading(false);
  };

  if (user) {
    return <Navigate to="/dupecord" />;
  }

  return (
    <div className="fade_in w-full h-full flex flex-col justify-center items-center gap-4">
      <form
        className="w-[80%] max-w-[600px] flex flex-col items-center gap-1"
        onSubmit={handleSubmit}
        data-testid="signup_form"
      >
        <label
          className={`required self-start translate-y-10 translate-x-6 transition-all ease-in-out duration-500 ${
            (emailFocused || email.length) && "translate-y-0 -translate-x-2"
          }`}
          onMouseEnter={() => setEmailFocused(true)}
          htmlFor="email"
        >
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onMouseEnter={() => setEmailFocused(true)}
          onMouseLeave={() => setEmailFocused(false)}
          className="w-full p-2 border border-gray-500 rounded"
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}

        <label
          className={`required self-start translate-y-10 translate-x-6 transition-all ease-in-out duration-500 ${
            (usernameFocused || username.length) &&
            "translate-y-0 -translate-x-2"
          }`}
          onMouseEnter={() => setUsernameFocused(true)}
          htmlFor="username"
        >
          Username
        </label>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onMouseEnter={() => setUsernameFocused(true)}
          onMouseLeave={() => setUsernameFocused(false)}
          className="w-full p-2 border border-gray-500 rounded"
        />
        {errors.username && <p className="text-red-500">{errors.username}</p>}

        <label
          className={`required self-start translate-y-10 translate-x-6 transition-all ease-in-out duration-500 ${
            (passwordFocused || password.length) &&
            "translate-y-0 -translate-x-2"
          }`}
          onMouseEnter={() => setPasswordFocused(true)}
          htmlFor="password"
        >
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onMouseEnter={() => setPasswordFocused(true)}
          onMouseLeave={() => setPasswordFocused(false)}
          className="w-full p-2 border border-gray-500 rounded"
        />
        {errors.password && <p className="text-red-500">{errors.password}</p>}

        <label
          className={`required self-start translate-y-10 translate-x-6 transition-all ease-in-out duration-500 ${
            (passwordConfirmFocused || passwordConfirm.length) &&
            "translate-y-0 -translate-x-2"
          }`}
          onMouseEnter={() => setPasswordConfirmFocused(true)}
          htmlFor="username"
        >
          Confirm password
        </label>
        <input
          type="password"
          required
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          onMouseEnter={() => setPasswordConfirmFocused(true)}
          onMouseLeave={() => setPasswordConfirmFocused(false)}
          className="w-full p-2 border border-gray-500 rounded"
        />
        {errors.passwordConfirm && (
          <p className="text-red-500">{errors.passwordConfirm}</p>
        )}
        <div className="w-full flex justify-between items-center pt-10">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-xl self-end border-neutral-600"
          >
            Log In
          </button>
          <label className="text-xl">OR</label>
          <button
            type="submit"
            className="text-xl self-end border-neutral-600"
            disabled={loading}
          >
            {loading ? "Loading..." : "Signup"}
          </button>
        </div>
      </form>
    </div>
  );
}
