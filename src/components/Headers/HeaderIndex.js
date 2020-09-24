import React from "react";

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import isp from "../../services/ispService";
import Toast from "light-toast";
import auth from "../../services/authService";
const admin_id = auth.getTokenId();

class Header extends React.Component {
  state = {
    ispDashboardInfo: {},
  };
  async componentDidMount() {
    try {
      Toast.loading("Loading...");
      const ispDashboardInfo = await isp.dashboarInfo(admin_id);
      this.setState({ ispDashboardInfo: ispDashboardInfo.dashboard[0] });
      Toast.hide();
      if (ispDashboardInfo.msg[0].code === "400") {
        window.location = process.env.REACT_APP_BASENAME + "/isp/logout";
      }
    } catch (ex) {
      if (ex.response && ex.response.status === "400") {
        console.log(ex);
        console.log(ex.response.data);
      }
    }
  }
  render() {
    const { ispDashboardInfo } = this.state;

    return (
      <>
        <div className="header bg-gradient-info pb-8 pt-3 pt-md-8">
          <Container fluid>
            <div className="header-body">
              {/* Card stats */}
              <Row>
                <Col lg="6" xl="4">
                  <Card className="card-stats my-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Total Users
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {ispDashboardInfo.total_users}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                            {/* <i className="fas fa-chart-bar" /> */}
                            <i className="fas fa-users" />
                          </div>
                        </Col>
                      </Row>
                      {/* <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-success mr-2">
                          <i className="fa fa-arrow-up" /> 3.48%
                        </span>{" "}
                        <span className="text-nowrap">Since start</span>
                      </p> */}
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="4">
                  <Card className="card-stats my-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Today Users
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {ispDashboardInfo.today}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                            {/* <i className="fas fa-chart-pie" /> */}
                            <i className="fas fa-users" />
                          </div>
                        </Col>
                      </Row>
                      {/* <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-danger mr-2">
                          <i className="fas fa-arrow-down" /> 3.48%
                        </span>{" "}
                        <span className="text-nowrap">Since last week</span>
                      </p> */}
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="4">
                  <Card className="card-stats my-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Active Users
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {ispDashboardInfo.active}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                            <i className="fas fa-users" />
                          </div>
                        </Col>
                      </Row>
                      {/* <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-warning mr-2">
                          <i className="fas fa-arrow-down" /> 1.10%
                        </span>{" "}
                        <span className="text-nowrap">Since last Month</span>
                      </p> */}
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="4">
                  <Card className="card-stats my-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Inactive Users
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {" "}
                            {ispDashboardInfo.inactive}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                            <i className="fas fa-users" />
                          </div>
                        </Col>
                      </Row>
                      {/* <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-success mr-2">
                          <i className="fas fa-arrow-up" /> 12%
                        </span>{" "}
                        <span className="text-nowrap">Since last month</span>
                      </p> */}
                    </CardBody>
                  </Card>
                </Col>

                <Col lg="6" xl="4">
                  <Card className="card-stats my-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Total Packages
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {ispDashboardInfo.packages}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                            <i className="ni ni-bag-17"></i>
                          </div>
                        </Col>
                      </Row>
                      {/* <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-success mr-2">
                          <i className="fa fa-arrow-up" /> 3.48%
                        </span>{" "}
                        <span className="text-nowrap">Since start</span>
                      </p> */}
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="4">
                  <Card className="card-stats my-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Total Franchises
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {ispDashboardInfo.franchises}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                            <i className="ni ni-building"></i>
                          </div>
                        </Col>
                      </Row>
                      {/* <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-danger mr-2">
                          <i className="fas fa-arrow-down" /> 3.48%
                        </span>{" "}
                        <span className="text-nowrap">Since last week</span>
                      </p> */}
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      </>
    );
  }
}

export default Header;
