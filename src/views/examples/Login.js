import React from "react";
import form from "../../components/common/form";
import { Link } from "react-router-dom";
// reactstrap components
import { Button, Card, CardBody, Form, Row, Col } from "reactstrap";

import Joi from "joi-browser";
import Toast from "light-toast";
import auth from "../../services/authService";

class Login extends form {
  state = {
    data: {
      username: "",
      password: "",
    },
    errors: {},
  };

  schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    try {
      Toast.loading("Loading...");
      const { data } = this.state;
      const res = await auth.login(data.username, data.password);

      const { state } = this.props.location;
      // window.location = state ? state.from.pathname : "/";
      Toast.hide();
      Toast.success(res.user[0].msg, 3000);

      window.location = state
        ? state.from.pathname
        : process.env.REACT_APP_BASENAME + "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        window.location = process.env.REACT_APP_BASENAME + "/isp/logout";
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
    Toast.hide();
  };

  render() {
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <small>Sign in with credentials</small>
              </div>
              <Form onSubmit={this.handleSubmit}>
                {this.renderLoginInput(
                  "username",
                  "text",
                  "Username",
                  "ni ni-email-83"
                )}
                {this.renderLoginInput(
                  "password",
                  "password",
                  "Password",
                  "ni ni-lock-circle-open"
                )}

                <div className="text-center">
                  <Button className="my-4" color="primary" type="submit">
                    Sign in
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Row className="mt-3">
            <Col xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                {/* <small>Forgot password?</small> */}
              </a>
            </Col>
            <Col className="text-right" xs="6">
              <Link to="/auth/register" className="text-light">
                <small>Create new account</small>
              </Link>
            </Col>
          </Row>
        </Col>
      </>
    );
  }
}

export default Login;
