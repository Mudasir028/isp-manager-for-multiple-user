import React from "react";
// form validation
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

// import userPic from "assets/img/theme/team-4-800x800.jpg";

import isp from "../../services/ispService";
import Toast from "light-toast";
import auth from "../../services/authService";

const admin_id = auth.getTokenId();

class CreateUser extends form {
  state = {
    data: {
      name: "",
      cnic: "",
      number: "",
      address: "",
      franchise: "",
      gender: "",
      nicFront: "",
      nicBack: "",
    },

    errors: {},
    allUsers: [],
    allFranchises: [],
  };

  schema = {
    name: Joi.string().required().label("Name"),
    cnic: Joi.string().required().label("CNIC"),
    number: Joi.string()
      .trim()
      .regex(/^[0-9]{7,11}$/)
      .required()
      .label("Number"),
    address: Joi.string().required().label("Address"),
    franchise: Joi.string().required().label("Franchise"),
    gender: Joi.string().required().label("Gender"),
    nicFront: Joi.any()
      .meta({ swaggerType: "file" })
      .required()
      .description("NiC Front Side"),
    nicBack: Joi.any()
      .meta({ swaggerType: "file" })
      .required()
      .description("NiC Back Side"),
  };

  async componentDidMount() {
    try {
      const getuser = isp.getAllUsers(admin_id);
      const franchise = isp.getAllFranchises(admin_id);
      const [allUsers, allFranchises] = await Promise.all([getuser, franchise]);

      const data = { ...this.state.data };
      data.franchise = allFranchises.franchises[0].id.toString();

      this.setState({
        data,
        allUsers: allUsers.users,
        allFranchises: allFranchises.franchises,
      });
      if (
        allFranchises.msg[0].code === "400" ||
        allUsers.msg[0].code === "400"
      ) {
        window.location = process.env.REACT_APP_BASENAME + "/isp/logout";
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }
  }

  handleFormReset = () => {
    const data = { ...this.state.data };
    data.name = "";
    data.cnic = "";
    data.number = "";
    data.address = "";

    this.setState({ data });
  };

  doSubmit = async () => {
    try {
      const {
        name,
        cnic,
        number: cell_num,
        address,
        franchise: franchise_id,
        gender,
      } = this.state.data;
      // const allUsers = this.state.allUsers;

      // const errors = { ...this.state.errors };

      // if (!allUsers.length === undefined) {
      //   console.log("ok");
      //   let allreadyUser = allUsers.filter(
      //     (user) => user.cnic === cnic || user.cell_num === cell_num
      //   );
      //   if (allreadyUser[0]) {
      //     errors.cnic = "cnic or phone number already used";
      //     this.setState({ errors });
      //   } else {
      //     Toast.loading("Loading...");
      //     const res = await isp.createUser({
      //       name,
      //       cnic,
      //       cell_num,
      //       address,
      //       franchise_id,
      //       gender,
      //     });
      //     Toast.hide();

      //     Toast.success(res.msg[0].message, 3000);
      //     this.handleFormReset();
      //   }
      // }
      Toast.loading("Loading...");
      const nicFront = document.querySelector("#nicFront");
      var nic_front = nicFront.files[0];
      const nicBack = document.querySelector("#nicBack");
      var nic_back = nicBack.files[0];
      const res = await isp.createUser({
        admin_id,
        name,
        cnic,
        cell_num,
        address,
        franchise_id,
        gender,
        nic_front,
        nic_back,
      });
      Toast.hide();
      this.handleFormReset();
      if (res.msg[0].code === "503") {
        Toast.success(res.msg[0].message.cnic.toString(), 3000);
      } else {
        Toast.success(res.msg[0].message, 3000);
      }
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
    const { allFranchises } = this.state;

    return (
      <>
        <UserHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            {/* <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
              <Card className="card-profile shadow">
                <Row className="justify-content-center">
                  <Col className="order-lg-2" lg="3">
                    <div className="card-profile-image">
                      <a href="#pablo" onClick={(e) => e.preventDefault()}>
                        <img
                          alt="..."
                          className="rounded-circle"
                          src={picUrl ? picUrl : userPic}
                        />
                      </a>
                    </div>
                  </Col>
                </Row>
                <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                  <div className="d-flex justify-content-between">
                    <Button
                      className="mr-4"
                      color="info"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      Connect
                    </Button>
                    <Button
                      className="float-right"
                      color="default"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      Message
                    </Button>
                  </div>
                </CardHeader>
                <CardBody className="pt-0 pt-md-4">
                  <div className="text-center mt-5">
                    <h3>{`Name: ${name}`}</h3>
                    <div className="h5 font-weight-300">
                      <i className="ni location_pin mr-2" />
                      {`CNIC: ${cnic}`}
                    </div>
                    <div className="h5 mt-4">
                      <i className="ni business_briefcase-24 mr-2" />
                      {`Date: ${date}`}
                    </div>
                    <p>{`Franchise: ${franchise}`}</p>
                    <hr className="my-4" />
                    <p>Status: {status === "true" ? "Active" : "Inactive"}</p>
                    <p> {`Package: ${package1}`}</p>
                    <p> {`Gender: ${gender}`}</p>
                    <hr className="my-4" />
                    <p> {`Address: ${address}`}</p>
                    <p> {`Number: ${number}`}</p>
                  </div>
                </CardBody>
              </Card>
            </Col> */}
            {/* <Col className="order-xl-1" xl="8"> */}
            <Col className="order-xl-1" xl="12">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">Create User</h3>
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
                          {this.renderInput("name", "Name", "text", "Lucky")}
                        </Col>
                        <Col lg="6">
                          {this.renderInput(
                            "cnic",
                            "CNIC",
                            "text",
                            "34502-0350539-9"
                          )}
                        </Col>

                        <Col lg="6">
                          {this.renderSelect(
                            "franchise",
                            "Franchise",
                            allFranchises
                          )}
                        </Col>

                        <Col lg="6">
                          {this.renderGenderInput("gender", "Gender", "radio", [
                            { id: "0", name: "Male" },
                            { id: "1", name: "Female" },
                          ])}
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
                        <Col md="12">
                          {this.renderInput(
                            "address",
                            "Address",
                            "text",
                            "Home Address"
                          )}
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          {this.renderInput(
                            "number",
                            "Number",
                            "number",
                            "+923032394255"
                          )}
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />

                    <h6 className="heading-small text-muted mb-4">Ducoments</h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col md="6">
                          {this.renderImageInput(
                            "nicFront",
                            "NIC Front Side",
                            "file",
                            "Pick an Image!"
                          )}
                        </Col>

                        {this.renderImageInput(
                          "nicBack",
                          "NIC Back Side",
                          "file",
                          "Pick an Image!"
                        )}
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

export default CreateUser;
