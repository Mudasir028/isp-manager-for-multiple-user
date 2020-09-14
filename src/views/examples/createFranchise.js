import React from "react";

import Joi from "joi-browser";

import form from "../../components/common/form";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Form,
  Container,
  Row,
  Col,
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import Toast from "light-toast";

import isp from "../../services/ispService";
import auth from "../../services/authService";

const admin_id = auth.getCurrentUserId();

class CreateFranchise extends form {
  state = {
    data: {
      name: "",
      area: "",
      details: "",
    },
    errors: {},
    isSpinner: false,
  };

  schema = {
    name: Joi.string().required().label("Name"),
    area: Joi.string().required().label("Area"),
    details: Joi.string().required().label("Details"),
  };

  handleFormReset = () => {
    const data = { ...this.state.data };
    data.name = "";
    data.area = "";
    data.details = "";

    this.setState({ data });
  };

  doSubmit = async () => {
    // Toast.info(content, duration, onClose);
    // Toast.success(content, duration, onClose);
    // Toast.fail(content, duration, onClose);
    // Toast.loading(content, onClose);
    // Toast.hide();
    try {
      Toast.loading("Loading...");
      const { data } = this.state;
      const res = await isp.createFranchise(
        admin_id,
        data.name,
        data.area,
        data.details
      );
      Toast.hide();
      Toast.success(res.msg[0].message, 3000);
      if (res.msg[0].code === "400") {
        window.location = process.env.REACT_APP_BASENAME + "/isp/logout";
      }
      this.handleFormReset();
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.name = ex.response.data;
        this.setState({ errors });

        Toast.fail(ex.response.data, 3000);
      }
    }
  };

  render() {
    return (
      <>
        <UserHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-1" xl="12">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">Create Franchise</h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={this.handleSubmit}>
                    <h6 className="heading-small text-muted mb-4">
                      Franchise Information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          {this.renderInput(
                            "name",
                            "Name",
                            "text",
                            "Franchise Name"
                          )}
                        </Col>

                        <Col lg="6">
                          {this.renderInput(
                            "area",
                            "Area",
                            "text",
                            "Franchise Area"
                          )}
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    {/* Details */}
                    <h6 className="heading-small text-muted mb-4">About</h6>
                    <div className="pl-lg-4">
                      {this.renderInput(
                        "details",
                        "Details",
                        "textarea",
                        "A few words about Franchise ..."
                      )}
                    </div>
                    <Row>
                      <Col className="text-right" xs="12">
                        <Button color="primary" size="lg" type="submit">
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default CreateFranchise;
