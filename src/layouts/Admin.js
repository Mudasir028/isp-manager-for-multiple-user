import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";
import ViewUser from "views/examples/viewUser";
import UpdateUser from "views/examples/updateUser";
import UpdatePackage from "views/examples/updatePackage";
import ViewFranchise from "views/examples/viewFranchise";
import UpdateFranchise from "views/examples/updateFranchise";
import ViewPackage from "views/examples/viewPackage";
import SingleUserBills from "views/examples/singleUserBills";
import Logout from "views/examples/logout";
import UpdateSubscribedPackage from "views/examples/updateSubscribedPackage";

class Admin extends React.Component {
  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }
  getRoutes = (routes) => {
    return routes.map((prop, key) => {
      // if (prop.layout === "/admin") {
      if (prop.layout === "/isp") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "";
  };
  render() {
    return (
      <>
        <Sidebar
          {...this.props}
          routes={routes}
          logo={{
            // innerLink: "/admin/index",
            innerLink: "/isp/users",
            imgSrc: require("assets/img/brand/argon-react.png"),
            imgAlt: "...",
          }}
        />
        <div className="main-content" ref="mainContent">
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
          <Switch>
            {this.getRoutes(routes)}
            <Route path="/isp/logout" component={Logout} />
            <Route path="/isp/view-user/:user_id" component={ViewUser} />
            <Route path="/isp/update-user/:user_id" component={UpdateUser} />
            <Route
              path="/isp/update-subscribed-package/:user_id"
              component={UpdateSubscribedPackage}
            />
            <Route
              path="/isp/single-user-bills/:user_id"
              component={SingleUserBills}
            />
            <Route
              path="/isp/view-package/:package_id"
              component={ViewPackage}
            />
            <Route
              path="/isp/update-package/:package_id"
              component={UpdatePackage}
            />
            <Route
              path="/isp/view-franchise/:franchise_id"
              component={ViewFranchise}
            />
            <Route
              path="/isp/update-franchise/:franchise_id"
              component={UpdateFranchise}
            />
            {/* <Redirect from="*" to="/admin/index" /> */}
            <Redirect from="*" to="/isp/users" />
          </Switch>
          <Container fluid>
            <AdminFooter />
          </Container>
        </div>
      </>
    );
  }
}

export default Admin;
