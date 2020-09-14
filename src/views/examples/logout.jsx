import React from "react";
import auth from "../../services/authService";
import Toast from "light-toast";

class Logout extends React.Component {
  async componentDidMount() {
    Toast.loading("Loading...");
    const username = "ispmanager";
    await auth.logout(username);
    Toast.hide();

    window.location = process.env.REACT_APP_BASENAME + "/";
  }

  render() {
    return null;
  }
}

export default Logout;
