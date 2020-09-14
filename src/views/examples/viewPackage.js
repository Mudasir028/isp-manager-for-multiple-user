import React from "react";
// form validation
import { Link } from "react-router-dom";

import form from "../../components/common/form";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  FormGroup,
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import userPic from "assets/img/theme/team-4-800x800.jpg";

import Toast from "light-toast";
import isp from "../../services/ispService";

class ViewPackage extends form {
  state = {
    data: {
      name: "",
      type: "Monthly",
      duration: 30,
      charges: "",
      franchise: "",
      data: "",
      picUrl: "",
      status: false,
      date: "",
      description: "",
    },
    errors: {},
    allFranchises: [],
  };

  async componentDidMount() {
    try {
      Toast.loading("Loading...");
      const id = this.props.match.params.package_id;
      const package1 = await isp.getPackageDetails(id);
      const packageDetails = package1.Packages[0];
      const data = { ...this.state.data };
      data.name = packageDetails.name;
      data.type = packageDetails.type;
      data.duration = packageDetails.duration;
      data.charges = packageDetails.charges;
      data.franchise = packageDetails.franchise_id;
      data.data = packageDetails.data_limit;
      data.picUrl = packageDetails.pic;
      data.date = packageDetails.created_at;
      data.description = packageDetails.description;
      this.setState({ data });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }
    Toast.hide();
  }

  render() {
    const {
      name,
      type,
      duration,
      charges,
      date,
      franchise,
      picUrl,
      data,
      description,
    } = this.state.data;

    return (
      <>
        <UserHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-1" xl="12">
              <Card className="bg-secondary shadow">
                <Row className="justify-content-center">
                  <Col className="order-lg-2" lg="3">
                    <div className="card-profile-image">
                      <a href="#pablo" onClick={(e) => e.preventDefault()}>
                        <img
                          alt="..."
                          className="rounded-circle"
                          src={picUrl || userPic}
                        />
                      </a>
                    </div>
                  </Col>
                </Row>
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">View Package</h3>
                    </Col>

                    <Col className="text-right" xs="4">
                      <Link
                        className="primary h5 mb-0 text-uppercase d-md"
                        // to={`/admin/update-user/${u.id}  `}
                        to={`/isp/update-package/${this.props.match.params.package_id}  `}
                      >
                        Edit
                      </Link>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <h6 className="heading-small text-muted mb-4">
                    Package information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor={name}>
                            Name
                          </label>
                          <p>{name}</p>
                        </FormGroup>
                      </Col>

                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor={name}>
                            Type
                          </label>
                          <p>{type}</p>
                        </FormGroup>
                      </Col>

                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor={name}>
                            Duration
                          </label>
                          <p>{duration}</p>
                        </FormGroup>
                      </Col>

                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor={name}>
                            Data Limit
                          </label>
                          <p>{data}</p>
                        </FormGroup>
                      </Col>

                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor={name}>
                            Charges
                          </label>
                          <p>{charges}</p>
                        </FormGroup>
                      </Col>

                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor={name}>
                            Franchise
                          </label>
                          <p>{franchise}</p>
                        </FormGroup>
                      </Col>

                      <Col lg="6">
                        <label className="form-control-label" htmlFor={name}>
                          Status
                        </label>
                        {/* <p>{status}</p> */}
                      </Col>
                      <Col lg="6">
                        <label className="form-control-label" htmlFor={name}>
                          Date
                        </label>
                        <p>{date}</p>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Details */}
                  <h6 className="heading-small text-muted mb-4">
                    Description Area
                  </h6>
                  <div className="pl-lg-4">
                    <label className="form-control-label" htmlFor={name}>
                      Description
                    </label>
                    <p>{description}</p>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default ViewPackage;
