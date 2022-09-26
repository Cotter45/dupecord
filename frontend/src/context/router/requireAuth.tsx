import { useLocation, Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "../../redux/hooks";

function RequireAuth() {
  const user = useAppSelector((state) => state.session.user);

  const location = useLocation();

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}

export default RequireAuth;
