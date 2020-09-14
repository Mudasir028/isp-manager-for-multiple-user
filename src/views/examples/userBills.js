import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardFooter,
  Container,
  Button,
  Row,
  Col,
  Input,
  FormGroup,
} from "reactstrap";
// core components
import TableComponent from "components/common/table";
import Header from "components/Headers/Header.js";
import isp from "../../services/ispService";
import Toast from "light-toast";
import auth from "../../services/authService";
import Pagination from "../../components/common/pagination";
import { paginate } from "../../utils/paginate";

const admin_id = auth.getCurrentUserId();

class UserBills extends React.Component {
  state = {
    allUserBills: [],
    filterValue: "1",
    searchName: "",
    searchCnic: "",
    searchPhoneNo: "",
    currentPage: 1,
    pageSize: 20,
  };

  columns = [
    { path: "name", label: "Name" },
    { path: "user_id", label: "User Id" },
    { path: "nic", label: "CNIC" },
    { path: "cell_num", label: "Number" },
    {
      path: "amount",
      label: "Amount",
    },
    { path: "pay_date", label: "Pay Date" },
    { path: "last_paid", label: "Last Paid" },
    {
      path: "updated_at",
      label: "Action",
      content: (u) => (
        <Button
          className="navbar-toggler"
          type="button"
          onClick={() => this.handleBills(u.user_id)}
        >
          Pay Bill
        </Button>
      ),
    },
  ];

  async componentDidMount() {
    try {
      Toast.loading("Loading...");
      const res = await isp.getAllUserbills(admin_id);
      this.setState({ allUserBills: res.bills });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }
    Toast.hide();
  }

  handleBills = async (user_id) => {
    try {
      Toast.loading("Loading...");
      const res = await isp.payUserbill(admin_id, user_id);
      Toast.hide();
      Toast.success(res.msg[0].message, 3000);
      const originalAllUserBills = this.state.allUserBills;
      const allUserBills = originalAllUserBills.filter(
        (u) => u.user_id !== user_id
      );
      this.setState({ allUserBills });
      if (res.msg[0].code === "400") {
        window.location = process.env.REACT_APP_BASENAME + "/isp/logout";
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }
  };

  handlefiltterInput = ({ currentTarget: input }) => {
    this.setState({ filterValue: input.value });
  };

  filters = () => {
    const { filterValue, searchName, searchCnic, searchPhoneNo } = this.state;

    if (filterValue === "1") {
      return (
        <FormGroup className="mb-0">
          <Input
            type="text"
            name="searchName"
            id="searchName"
            placeholder="Search Record by Name..."
            onChange={this.handleFilter}
            value={searchName}
            className="form-control-alternative mb-2"
          />
        </FormGroup>
      );
    }
    if (filterValue === "2") {
      return (
        <FormGroup className="mb-0">
          <Input
            type="text"
            name="searchCnic"
            id="searchCnic"
            placeholder="Search Record by CNIC..."
            onChange={this.handleFilter}
            value={searchCnic}
            className="form-control-alternative mb-2"
          />
        </FormGroup>
      );
    } else if (filterValue === "3") {
      return (
        <FormGroup className="mb-0">
          <Input
            type="text"
            name="searchPhoneNo"
            id="searchPhoneNo"
            placeholder="Search Record Phone..."
            onChange={this.handleFilter}
            value={searchPhoneNo}
            className="form-control-alternative mb-2"
          />
        </FormGroup>
      );
    }
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleFilter = ({ currentTarget: input }) => {
    this.setState({ [input.name]: input.value, currentPage: 1 });
  };

  filterUsers = () => {
    const {
      allUserBills,
      searchName,
      searchCnic,
      searchPhoneNo,
      pageSize,
      currentPage,
    } = this.state;

    let filtered = allUserBills.filter(
      (p) =>
        (searchName === "" ||
          p.name.toUpperCase().startsWith(searchName.toUpperCase())) &&
        (searchCnic === "" ||
          p.nic.toUpperCase().startsWith(searchCnic.toUpperCase())) &&
        (searchPhoneNo === "" ||
          p.cell_num.toUpperCase().startsWith(searchPhoneNo.toUpperCase()))
    );
    const filteredCurrencies = paginate(filtered, currentPage, pageSize);
    return { totalCount: filtered.length, data: filteredCurrencies };
  };

  render() {
    const {} = this.state;
    const { filterValue, pageSize, currentPage } = this.state;
    const { totalCount, data } = this.filterUsers();

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
                  <Row xs="1" sm="2" md="4" className="align-items-center">
                    <Col md="4">
                      <h3 className="mb-2">Unpaid Bills</h3>
                    </Col>

                    <Col className="text-right" md="4">
                      {this.filters()}
                    </Col>
                    <Col className="text-right" md="4">
                      <Input
                        type="select"
                        name="filterValue"
                        value={filterValue}
                        id="exampleSelect"
                        className="form-control-alternative mb-2"
                        onChange={this.handlefiltterInput}
                      >
                        <option value="1">User Name</option>
                        <option value="2">CNIC No</option>
                        <option value="3">Phone No</option>
                      </Input>
                    </Col>
                  </Row>
                </CardHeader>

                <TableComponent
                  columns={this.columns}
                  data={data}
                  classes="table align-items-center table-flush"
                  sortColumn=""
                />

                <CardFooter className="py-4">
                  <nav aria-label="...">
                    <Pagination
                      itemsCount={totalCount}
                      pageSize={pageSize}
                      currentPage={currentPage}
                      onPageChange={this.handlePageChange}
                    />
                  </nav>
                </CardFooter>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default UserBills;
