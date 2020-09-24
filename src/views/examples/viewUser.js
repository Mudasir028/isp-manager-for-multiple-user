import React from "react";

import { Link } from "react-router-dom";

import form from "../../components/common/form";
// reactstrap components
import {
  FormGroup,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Form,
  Button,
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import userPic from "assets/img/theme/nic.png";
import TableComponent from "components/common/table";
import Toast from "light-toast";
import isp from "../../services/ispService";
import Joi from "joi-browser";
import auth from "../../services/authService";
const admin_id = auth.getTokenId();

class ViewUser extends form {
  state = {
    data: {
      nicFront: "",
      nicBack: "",
    },
    errors: {},
    isChangeNicFront: false,
    isChangeNicBack: false,
    isShowFrontButtonNic: false,
    isShowBackButtonNic: false,
    userDetails: {},
    singleUserBills: [],
  };

  nicFrontRef = React.createRef();
  nicBackRef = React.createRef();
  schema = {
    nicFront: Joi.any()
      .meta({ swaggerType: "file" })
      // .optional()
      // .allow("")
      .required()
      .description("NiC Front Side"),
    nicBack: Joi.any()
      .meta({ swaggerType: "file" })
      .required()
      .description("NiC Back Side"),
  };

  columns = [
    { path: "user_id", label: "User Id" },
    {
      path: "package_id",
      label: "Package Id",
    },
    {
      path: "pay_date",
      label: "Pay Date",
    },
    { path: "amount_paid", label: "Amount Paid" },
    { path: "created_at", label: "Created At" },
    { path: "updated_at", label: "Updated At" },
  ];

  async componentDidMount() {
    try {
      Toast.loading("Loading...");
      const id = this.props.match.params.user_id;
      const user = await isp.getUserDetails(id);

      const res = await isp.getSingleUserBills({ admin_id, id });

      const userDetails = user.user[0];

      const data = { ...this.state.data };

      data.nicFront = userDetails.nic_front;
      data.nicBack = userDetails.nic_back;

      this.setState({
        data,
        userDetails,
        singleUserBills: res.bills,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }
    Toast.hide();
  }

  toggleNicFront = () => {
    this.setState({
      isChangeNicFront: true,
    });
  };
  toggleNicBack = () => {
    this.setState({
      isChangeNicBack: true,
    });
  };

  handlePreviewNicFront = (event) => {
    var output = this.nicFrontRef.current;
    output.src = URL.createObjectURL(event.target.files[0]);

    this.setState({ isShowFrontButtonNic: true });
  };
  handlePreviewNicBack = (event) => {
    var output = this.nicBackRef.current;
    output.src = URL.createObjectURL(event.target.files[0]);

    this.setState({ isShowBackButtonNic: true });
  };

  doSubmit = async () => {
    const { isShowFrontButtonNic, isShowBackButtonNic } = this.state;
    const id = this.props.match.params.user_id;
    if (isShowFrontButtonNic) {
      this.setState({ isChangeNicFront: false, isShowFrontButtonNic: false });

      Toast.loading("Loading...");

      const nicFront = document.querySelector("#nicFront");
      var nic_front = nicFront.files[0];

      const res = await isp.updateFrontNic({
        nic_front,
        id,
      });
      Toast.hide();
      Toast.success(res.msg[0].message, 3000);
    } else if (isShowBackButtonNic) {
      this.setState({ isChangeNicBack: false, isShowBackButtonNic: false });
      Toast.loading("Loading...");

      const nicBack = document.querySelector("#nicBack");
      var nic_back = nicBack.files[0];

      const res = await isp.updateBackNic({
        nic_back,
        id,
      });
      Toast.hide();
      Toast.success(res.msg[0].message, 3000);
    }
  };

  render() {
    const {
      name,
      cnic,
      status,
      created_at,
      franchise,
      package: package1,
      gender,
      address,
      cell_num,
    } = this.state.userDetails;
    const { nicFront, nicBack } = this.state.data;
    const { singleUserBills } = this.state;
    const {
      isChangeNicFront,
      isChangeNicBack,
      isShowFrontButtonNic,
      isShowBackButtonNic,
    } = this.state;
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
                      <h3 className="mb-0">User Details</h3>
                    </Col>

                    <Col className="text-right" xs="4">
                      <Link
                        className="btn btn-info btn-sm"
                        to={`/isp/update-user/${this.props.match.params.user_id}  `}
                      >
                        Edit
                      </Link>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <h6 className="heading-small text-muted mb-4">
                    User information
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
                            Cnic
                          </label>
                          <p>{cnic}</p>
                        </FormGroup>
                      </Col>

                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor={name}>
                            Joining Date
                          </label>
                          <p>{created_at}</p>
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
                        <FormGroup>
                          <label className="form-control-label" htmlFor={name}>
                            Package
                          </label>
                          <p>{package1}</p>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <Link
                            className="primary h5 mb-0 text-uppercase d-md"
                            to={`/isp/update-subscribed-package/${this.props.match.params.user_id}  `}
                          >
                            Update subscribed package
                          </Link>
                        </FormGroup>
                      </Col>

                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor={name}>
                            Status
                          </label>
                          <p>{status === "1" ? "Active" : "Unactive"}</p>
                        </FormGroup>
                      </Col>

                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor={name}>
                            Gender
                          </label>
                          <p>{gender}</p>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Address */}
                  <h6 className="heading-small text-muted mb-4">
                    Contact information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor={name}>
                            Address
                          </label>
                          <p>{address}</p>
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor={name}>
                            Number
                          </label>
                          <p>{cell_num}</p>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">Documents</h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="6">
                        <label className="form-control-label" htmlFor={name}>
                          NIC Front Side
                        </label>
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          <img
                            ref={this.nicFrontRef}
                            alt="..."
                            className="rounded-squir mb-4"
                            src={nicFront || userPic}
                            height="270"
                            width="450"
                          />
                        </a>
                        {!isChangeNicFront ? (
                          <Button
                            color="primary"
                            size="lg"
                            onClick={this.toggleNicFront}
                          >
                            Change Image
                          </Button>
                        ) : (
                          <Form onSubmit={this.handleSubmit}>
                            {this.renderImageInput(
                              "nicFront",
                              "Change NICFront Side",
                              "file",
                              "Pick an Image!",
                              this.handlePreviewNicFront
                            )}
                            {isShowFrontButtonNic && (
                              <Button color="primary" size="lg" type="submit">
                                Save NIC Front
                              </Button>
                            )}
                          </Form>
                        )}
                      </Col>
                      <Col md="6">
                        <label className="form-control-label" htmlFor={name}>
                          NIC Back Side
                        </label>
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          <img
                            ref={this.nicBackRef}
                            alt="..."
                            className="rounded-squir mb-4"
                            src={nicBack || userPic}
                            height="270"
                            width="450"
                          />
                        </a>
                        {!isChangeNicBack ? (
                          <Button
                            color="primary"
                            size="lg"
                            onClick={this.toggleNicBack}
                          >
                            Change Image
                          </Button>
                        ) : (
                          <Form onSubmit={this.handleSubmit}>
                            {this.renderImageInput(
                              "nicBack",
                              "Change NIC Back Side",
                              "file",
                              "Pick an Image!",
                              this.handlePreviewNicBack
                            )}
                            {isShowBackButtonNic && (
                              <Button color="primary" size="lg" type="submit">
                                Save NIC Back
                              </Button>
                            )}
                          </Form>
                        )}
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">Users Bills</h6>
                  <div className="">
                    <Row>
                      <div className="col">
                        <Card className="shadow">
                          {/* <CardHeader className="border-0"></CardHeader> */}
                          <TableComponent
                            columns={this.columns}
                            data={singleUserBills}
                            classes="table align-items-center table-flush"
                            sortColumn=""
                          />
                        </Card>
                      </div>
                    </Row>
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

export default ViewUser;
