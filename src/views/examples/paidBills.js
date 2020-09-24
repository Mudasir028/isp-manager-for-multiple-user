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

class PaidBills extends React.Component {
  state = { paidBills: [] };

  columns = [
    { path: "user_id", label: "User Id" },
    { path: "package_id", label: "Package Id" },
    { path: "pay_date", label: "Pay Date" },
    {
      path: "amount_paid",
      label: "Amount Paid",
    },
    { path: "created_at", label: "Created At" },
    { path: "updated_at", label: "Updated At" },
  ];

  async componentDidMount() {
    try {
      Toast.loading("loading...");
      const res = await isp.getPaidBills(admin_id);
      this.setState({ paidBills: res.bills });
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
    const { paidBills } = this.state;

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
                  <h3 className="mb-0">Paid Bills</h3>
                </CardHeader>

                <TableComponent
                  columns={this.columns}
                  data={paidBills}
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

export default PaidBills;
