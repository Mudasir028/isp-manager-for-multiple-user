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

import userPic from "assets/img/theme/team-4-800x800.jpg";

import isp from "../../services/ispService";
import Toast from "light-toast";

class UpdateSubscribedPackage extends form {
  state = {
    data: {
      date: "",
      package1: "",
    },
    errors: {},
    allPackages: [],
  };

  schema = {
    date: Joi.date().allow("").label("Joining Date"),
    package1: Joi.string().required().label("Package"),
  };

  async componentDidMount() {
    try {
      const id = this.props.match.params.user_id;
      const allPackages = await isp.getAllPackages();

      const { data } = this.state;

      data.package1 = allPackages.packages[0].id.toString();
      data.date = allPackages.packages[0].created_at;

      this.setState({
        data,
        allPackages: allPackages.packages,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }
  }

  doSubmit = async () => {
    try {
      Toast.loading("Loading...");
      const id = this.props.match.params.user_id;
      const { date, package1 } = this.state.data;

      const res = await isp.createSubscription({
        user_id: id,
        package_id: package1,
        last_paid: date,
      });
      Toast.hide();
      Toast.success(res.msg[0].message, 3000);
    } catch (ex) {
      console.log(ex);
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.name = ex.response.data;
        this.setState({ errors });

        Toast.fail(ex.response.data, 3000);
      }
    }
  };

  render() {
    const { allFranchises, allPackages } = this.state;

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
                      <h3 className="mb-0">Update Subscribed Package</h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={this.handleSubmit}>
                    <h6 className="heading-small text-muted mb-4">
                      Subscribed package information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          {this.renderInput(
                            "date",
                            "Joining Date",
                            "date",
                            "date placeholder"
                          )}
                        </Col>

                        <Col lg="6">
                          {this.renderSelect(
                            "package1",
                            "Package",
                            allPackages
                          )}
                        </Col>
                      </Row>
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

export default UpdateSubscribedPackage;
