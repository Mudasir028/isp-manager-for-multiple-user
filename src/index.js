import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import "./index.css";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import auth from "./services/authService";

const admin_id = auth.getTokenId();

const hist = createBrowserHistory({ basename: process.env.REACT_APP_BASENAME });

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      {admin_id > 0 ? (
        <Route path="/isp" render={(props) => <AdminLayout {...props} />} />
      ) : (
        <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
      )}
      {admin_id > 0 ? (
        <>
          <Redirect to="/" />
          <Redirect from="/" to="/isp/index" />
        </>
      ) : (
        <>
          <Redirect from="/" to="/auth/login" />
        </>
      )}
    </Switch>
  </Router>,
  document.getElementById("root")
);
