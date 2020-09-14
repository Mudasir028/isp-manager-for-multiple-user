import React from "react";

import { Link } from "react-router-dom";

import form from "../../components/common/form";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Form,
  Container,
  Row,
  Col,
  FormGroup,
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";

import Toast from "light-toast";
import isp from "../../services/ispService";

class ViewFranchise extends form {
  state = {
    data: {
      name: "",
      date: "",
      area: "",
      details: "",
    },
    errors: {},
  };

  async componentDidMount() {
    try {
      Toast.loading("Loading...");
      const id = this.props.match.params.franchise_id;
      const getfranchiseDetails = await isp.getFranchiseDetails(id);
      const franchiseDetails = getfranchiseDetails.franchises[0];
      const data = { ...this.state.data };
      data.name = franchiseDetails.name;
      data.area = franchiseDetails.area;
      data.details = franchiseDetails.details;
      this.setState({ data });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }
    Toast.hide();
  }

  render() {
    const { name, date, area, details } = this.state.data;

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
                      <h3 className="mb-0">Update Franchise</h3>
                    </Col>
                    <Col className="text-right" xs="4">
                      <Link
                        className="primary h4 mb-0 text-uppercase d-md"
                        to={`/isp/update-franchise/${this.props.match.params.franchise_id}`}
                      >
                        Edit
                      </Link>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={this.handleSubmit}>
                    <h6 className="heading-small text-muted mb-4">
                      User information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor={name}
                            >
                              Name
                            </label>
                            <p>{name}</p>
                          </FormGroup>
                        </Col>

                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor={date}
                            >
                              Date
                            </label>
                            <p>{date ? date : "------------"}</p>
                          </FormGroup>
                        </Col>

                        <Col md="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor={area}
                            >
                              Area
                            </label>
                            <p>{area}</p>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    {/* Details */}
                    <h6 className="heading-small text-muted mb-4">
                      About Area
                    </h6>
                    <div className="pl-lg-4">
                      <FormGroup>
                        <label className="form-control-label" htmlFor={details}>
                          Details
                        </label>
                        <p>{details}</p>
                      </FormGroup>
                    </div>
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

export default ViewFranchise;
