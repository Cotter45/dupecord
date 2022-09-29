import { Route, Routes } from "react-router-dom";
import FourOhFour from "../../pages/404/index";
// import ForgotPassword from "../../pages/auth/forgotPassword";
// import ValidateCode from "../../pages/auth/validateCode";
import LoginPage from "../../pages/auth/login";
import SignupPage from "../../pages/auth/signup";
import DupeCord from "../../pages/dupecord";
import Splash from "../../pages/splash";

import RequireAuth from "./requireAuth";
import ScrollToTop from "./scrollToTop";

function Router() {
  return (
    <ScrollToTop>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        {/* <Route path="/validate-code" element={<ValidateCode />} /> */}
        <Route element={<RequireAuth />}>
          <Route path="/dupecord" element={<DupeCord />}>
            <Route path="" element={<h1>Blank</h1>} />
            <Route path=":id" element={<h1>test</h1>} />
          </Route>
        </Route>
        <Route path="*" element={<FourOhFour />} />
      </Routes>
    </ScrollToTop>
  );
}

export default Router;
