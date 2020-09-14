import React from "react";
import { Link } from "react-router-dom";

// reactstrap components
import { Button, Card, CardBody, Form, Row, Col } from "reactstrap";
import Joi from "joi-browser";
import Toast from "light-toast";
import auth from "../../services/authService";
import form from "../../components/common/form";

class Register extends form {
  state = {
    data: {
      name: "",
      username: "",
      password: "",
    },
    errors: {},
  };

  schema = {
    name: Joi.string().required().label("Name"),
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };

  handleReset = () => {
    const data = { ...this.state.data };
    data.name = "";
    data.username = "";
    data.password = "";
    this.setState({ data });
  };

  doSubmit = async () => {
    try {
      Toast.loading("Loading...");
      const { data } = this.state;
      const res = await auth.register(data.name, data.username, data.password);
      this.handleReset();
      Toast.hide();
      Toast.success(res.user[0].msg, 3000);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        window.location = process.env.REACT_APP_BASENAME + "/isp/logout";
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <>
        <Col lg="6" md="8">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <small>Sign up with credentials</small>
              </div>
              <Form onSubmit={this.handleSubmit}>
                {this.renderLoginInput("name", "text", "Name", "ni ni-hat-3")}
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

                {/* <div className="custom-control custom-control-alternative custom-checkbox">
                  <input
                    className="custom-control-input"
                    id=" customCheckLogin"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor=" customCheckLogin"
                  >
                    <span className="text-muted">Remember me</span>
                  </label>
                </div> */}
                <div className="text-center">
                  <Button className="my-4" color="primary" type="submit">
                    Sign in
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Row className="mt-3">
            <Col className="text-right" xs="12">
              <Link to="auth/login" className="text-light">
                <small>Already register</small>
              </Link>
            </Col>
          </Row>
        </Col>
      </>
    );
  }
}

export default Register;
