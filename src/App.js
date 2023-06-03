import { Route, Routes } from "react-router-dom";
import Home from "./container/Home/Home";
import NotFound from "./components/NotFound/NotFound";
import Registration from "./container/Registration/Registration";
import SecureCode from "./container/Registration/SecureCode/SecureCode";
import Details from "./container/Registration/Details/Details";
import SignIn from "./container/Registration/SignIn/SignIn";
import ForgotPassword from "./container/Registration/ForgotPassword/ForgotPassword";
import ForgotPasswordSecureCode from "./container/Registration/ForgotPassword/ForgotPasswordSecureCode/ForgotPasswordSecureCode";
import NewPassword from "./container/Registration/ForgotPassword/NewPassword/NewPassword";
import Payments from "./container/Payments/Payments";
import Account from "./container/Account/Account";
import Settings from "./container/Settings/Settings";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    JSON.parse(localStorage.getItem("darkTheme")) === true &&
      document.querySelector("body").setAttribute("data-theme", "dark");
  }, []);

  return (
    <div className="App">
      <div className="container">
        <Routes>
          <Route path="/accounting/" element={<Home />} />
          <Route path="/accounting/payments" element={<Payments />} />
          <Route path="/accounting/registration" element={<Registration />} />
          <Route path="/accounting/signin" element={<SignIn />} />
          <Route path="/accounting/account" element={<Account />} />
          <Route path="/accounting/settings" element={<Settings />} />
          <Route
            path="/acconting/forgot-password"
            element={<ForgotPassword />}
          />
          <Route
            path="/accounting/registration/code"
            element={<SecureCode />}
          />
          <Route
            path="/accounting/forgot-password/code"
            element={<ForgotPasswordSecureCode />}
          />
          <Route
            path="/accounting/reset-password/new-password"
            element={<NewPassword />}
          />
          <Route
            path="/accounting/registration/details"
            element={<Details />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
