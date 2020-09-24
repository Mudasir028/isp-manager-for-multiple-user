import React from "react";

// reactstrap components
import { Card, CardHeader, CardFooter, Container, Row } from "reactstrap";
// core components
import TableComponent from "components/common/table";
import Header from "components/Headers/Header.js";
import isp from "../../services/ispService";
import Toast from "light-toast";
import auth from "../../services/authService";

const admin_id = auth.getTokenId();

class Subscriptions extends React.Component {
  state = { subscriptions: [] };

  columns = [
    { path: "user_id", label: "User Id" },
    { path: "package_id", label: "Package Id" },
    { path: "subscription_date", label: "Subscription Date" },
    {
      path: "last_paid",
      label: "Last Paid",
    },
    { path: "next_pay_date", label: "Next Pay Date" },
    {
      path: "end_date",
      label: "End Date",
    },
    {
      path: "status",
      label: "Status",
      content: (p) => (p.status === "1" ? "Active" : "Unactive"),
    },
    { path: "created_at", label: "Created At" },
    { path: "updated_at", label: "Updated At" },
  ];

  async componentDidMount() {
    try {
      Toast.loading("Loading...");
      const res = await isp.getSubscriptions(admin_id);
      this.setState({ subscriptions: res.subscriptions });
      if (res.msg[0].code === "400") {
        window.location = process.env.REACT_APP_BASENAME + "/isp/logout";
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }
    Toast.hide();
  }

  render() {
    const { subscriptions } = this.state;

    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Subscriptions</h3>
                </CardHeader>

                <TableComponent
                  columns={this.columns}
                  data={subscriptions}
                  classes="table align-items-center table-flush"
                  sortColumn=""
                />

                <CardFooter className="py-4">
                  <nav aria-label="..."></nav>
                </CardFooter>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default Subscriptions;
