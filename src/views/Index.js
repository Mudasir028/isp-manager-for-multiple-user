import React from "react";
// node.js library that concatenates classes (strings)
// import classnames from "classnames";
// javascipt plugin for creating charts
// import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  // NavItem,
  // NavLink,
  // Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import {
  // setUserGraphData,
  lineChart,
  barChart,
  // chartOptions,
  // parseOptions,
  // chartExample1,
  // chartExample2,
  // chartExample3,
} from "variables/charts.js";

import HeaderIndex from "components/Headers/HeaderIndex";
import isp from "../services/ispService";
import auth from "../services/authService";
const admin_id = auth.getTokenId();

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeNav: 1,
      bigChartData: "data1",
      usersgraphData: {},
      billDategraphData: {},
    };
    // if (window.Chart) {
    //   parseOptions(Chart, chartOptions());
    // }
  }

  // setBgChartData = (name) => {
  //   this.setState({
  //     bigChartData: name,
  //   });
  // };

  async componentDidMount() {
    try {
      const users = isp.getUserGraph(admin_id);
      const billDate = isp.getBillDates(admin_id);
      const [usersgraphData, billDategraphData] = await Promise.all([
        users,
        billDate,
      ]);

      this.setState({ usersgraphData, billDategraphData });
    } catch (err) {
      console.log(err);
    }
  }

  // toggleNavs = (e, index) => {
  //   e.preventDefault();
  //   this.setState({
  //     activeNav: index,
  //     chartExample1Data:
  //       this.state.chartExample1Data === "data1" ? "data2" : "data1",
  //   });
  // };

  render() {
    return (
      <>
        <HeaderIndex />

        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col xl="6">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Earnings
                      </h6>
                      <h2 className="mb-0">Bill Dates</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    <Bar
                      data={barChart.data(this.state.billDategraphData)}
                      options={barChart.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl="6">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Overview
                      </h6>

                      <h2 className=" mb-0">Users</h2>
                    </div>
                    {/* <div className="col">
                      <Nav className="justify-content-end" pills>
                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: this.state.activeNav === 1,
                            })}
                            href="#pablo"
                            onClick={(e) => this.toggleNavs(e, 1)}
                          >
                            <span className="d-none d-md-block">Month</span>
                            <span className="d-md-none">M</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: this.state.activeNav === 2,
                            })}
                            data-toggle="tab"
                            href="#pablo"
                            onClick={(e) => this.toggleNavs(e, 2)}
                          >
                            <span className="d-none d-md-block">Week</span>
                            <span className="d-md-none">W</span>
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div> */}
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    {/* <Line
                      data={chartExample1[this.state.chartExample1Data]}
                      options={chartExample1.options}
                      getDatasetAtEvent={(e) => console.log(e)}
                    /> */}
                    <Line
                      data={lineChart[this.state.bigChartData](
                        this.state.usersgraphData
                      )}
                      options={lineChart.options}
                    />
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

export default Index;
