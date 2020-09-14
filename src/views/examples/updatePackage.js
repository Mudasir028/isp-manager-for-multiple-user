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
import { types } from "../../services/fakeData";

import Toast from "light-toast";
import isp from "../../services/ispService";
import auth from "../../services/authService";

const admin_id = auth.getCurrentUserId();

class UpdatePackage extends form {
  state = {
    data: {
      name: "",
      type: "Monthly",
      duration: 30,
      charges: "",
      franchise: "",
      data: "",
      picUrl: "",
      date: "",
      description: "",
    },
    errors: {},
    allFranchises: [],
  };

  schema = {
    name: Joi.string().required().label("Name"),
    type: Joi.string().required().label("Type"),
    duration: Joi.number().required().label("Duration"),
    charges: Joi.number().required().label("Charges"),
    franchise: Joi.string().required().label("Franchise"),
    data: Joi.string().required().label("Data Limit"),
    picUrl: Joi.any()
      .meta({ swaggerType: "file" })
      // .optional()
      // .allow("")
      .required()
      .description("image file"),
    date: Joi.date().required().label("Joining Date"),
    description: Joi.string().required().label("Description"),
  };

  async componentDidMount() {
    try {
      const id = this.props.match.params.package_id;
      const getPackage = isp.getPackageDetails(id);
      const Franchises = isp.getAllFranchises(admin_id);
      const [package1, allFranchises] = await Promise.all([
        getPackage,
        Franchises,
      ]);

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

      this.setState({
        data,
        allFranchises: allFranchises.franchises,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log("Find Error");
        console.log(ex.response.data);
      }
    }
  }

  doSubmit = async () => {
    try {
      Toast.loading("Loading...");
      const id = this.props.match.params.package_id;
      const {
        name,
        type,
        duration,
        charges,
        franchise: franchise_id,
        data: data_limit,
        description,
      } = this.state.data;

      const res = await isp.updatePackage({
        name,
        type,
        duration,
        charges,
        franchise_id,
        data_limit,
        description,
        id,
        admin_id,
      });
      Toast.hide();
      Toast.success(res.msg[0].message, 3000);
      const picUrl = document.querySelector("#picUrl");
      await isp.updatePackagePic(admin_id, picUrl.files[0], id);
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

  handleDuration = () => {
    const data = { ...this.state.data };

    if (data.type === "Monthly") {
      data.duration = 30;
    }
    if (data.type === "Weekly") {
      data.duration = 7;
    }
    if (data.type === "Daily") {
      data.duration = 1;
    }

    this.setState({ data });
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
                      <h3 className="mb-0">Update Package</h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={this.handleSubmit}>
                    <h6 className="heading-small text-muted mb-4">
                      Package information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          {this.renderInput(
                            "name",
                            "Name",
                            "text",
                            "Package 1"
                          )}
                        </Col>

                        <Col lg="6">
                          {this.renderSelect(
                            "type",
                            "Type",
                            types,
                            this.handleDuration
                          )}
                        </Col>

                        <Col lg="6">
                          {this.renderInput(
                            "duration",
                            "Duration",
                            "text",
                            "30",
                            true
                          )}
                        </Col>

                        <Col lg="6">
                          {this.renderInput("data", "Data", "text", "4Mb")}
                        </Col>

                        <Col lg="6">
                          {this.renderInput(
                            "charges",
                            "Charges",
                            "text",
                            "2000"
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
                          {this.renderInput(
                            "date",
                            "Joining Date",
                            "date",
                            "date placeholder"
                          )}
                        </Col>

                        <Col lg="6">
                          {this.renderImageInput(
                            "picUrl",
                            "Pic (optional)",
                            "file",
                            "Yo, pick a Image!"
                          )}
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    {/* Details */}
                    <h6 className="heading-small text-muted mb-4">
                      Description Area
                    </h6>
                    <div className="pl-lg-4">
                      {this.renderInput(
                        "description",
                        "Description",
                        "textarea",
                        "A few words about Package ..."
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

export default UpdatePackage;
