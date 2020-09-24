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

// import userPic from "assets/img/theme/team-4-800x800.jpg";

import isp from "../../services/ispService";
import Toast from "light-toast";
import auth from "../../services/authService";

const admin_id = auth.getTokenId();

class UpdateUser extends form {
  state = {
    data: {
      name: "",
      cnic: "",
      number: "",
      address: "",
      franchise: "",
      gender: "",
    },
    errors: {},
    allFranchises: [],
  };

  schema = {
    name: Joi.string().required().label("Name"),
    cnic: Joi.string().required().label("CNIC"),
    number: Joi.number().required().label("Number"),
    address: Joi.string().required().label("Address"),
    franchise: Joi.number().required().label("Franchise"),
    gender: Joi.string().required().label("Gender"),
  };

  async componentDidMount() {
    try {
      const id = this.props.match.params.user_id;
      const getuser = isp.getUserDetails(id);
      const Franchises = isp.getAllFranchises(admin_id);
      const [user, allFranchises] = await Promise.all([getuser, Franchises]);
      const userDetails = user.user[0];
      const { data } = this.state;
      data.name = userDetails.name;
      data.cnic = userDetails.cnic;
      data.number = userDetails.cell_num;
      data.address = userDetails.address;
      data.gender = userDetails.gender;
      data.franchise = allFranchises.franchises[0].id;

      this.setState({
        data,
        allFranchises: allFranchises.franchises,
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
      const {
        name,
        cnic,
        number: cell_num,
        address,
        franchise: franchise_id,
        gender,
      } = this.state.data;

      const res = await isp.updateUser({
        name,
        cnic,
        cell_num,
        address,
        franchise_id,
        gender,
        id,
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
    const { allFranchises } = this.state;

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
                      <h3 className="mb-0">Update User</h3>
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

export default UpdateUser;
