import React from "react";

import { Link } from "react-router-dom";

// reactstrap components
import {
  Card,
  CardHeader,
  CardFooter,
  Container,
  Row,
  Col,
  Input,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";

// core components
import TableComponent from "components/common/table";
import Header from "components/Headers/Header.js";
import isp from "../../services/ispService";
import userPic from "assets/img/theme/team-4-800x800.jpg";
import Toast from "light-toast";
import auth from "../../services/authService";
import Pagination from "../../components/common/pagination";
import { paginate } from "../../utils/paginate";
const admin_id = auth.getCurrentUserId();

class Tables extends React.Component {
  state = {
    allUsers: [],
    filterValue: "1",
    searchName: "",
    searchCnic: "",
    searchPhoneNo: "",
    currentPage: 1,
    pageSize: 20,
    confirmationModal: false,
    id: "",
  };

  columns = [
    { path: "name", label: "Name" },
    {
      path: "cnic",
      label: "CNIC",
    },
    {
      path: "cell_num",
      label: "Number",
    },
    { path: "address", label: "Address" },
    { path: "franchise_id", label: "Franchise" },
    { path: "gender", label: "Gender" },
    { path: "created_at", label: "Created At" },
    {
      path: "status",
      label: "Status",
      content: (u) => (u.status === "1" ? "Active" : "Unactive"),
    },
    { path: "package_id", label: "Package" },
    { path: "updated_at", label: "Updated At" },
    {
      path: "nic_front",
      label: "NIC Front",
      content: (u) => (
        <div className="avatar-group">
          <a className="avatar avatar-sm" id="tooltip742438047">
            <img
              alt="..."
              className="rounded-square"
              src={u.nic_front || userPic}
            />
          </a>
        </div>
      ),
    },
    {
      path: "nic_back",
      label: "NIC Back",
      content: (u) => (
        <div className="avatar-group">
          <a className="avatar avatar-sm" id="tooltip">
            <img
              alt="..."
              className="rounded-square"
              src={u.nic_back || userPic}
            />
          </a>
        </div>
      ),
    },
    {
      path: "Bills",
      label: "Bills",
      content: (u) => (
        <Link
          className="btn btn-info btn-sm"
          to={`/isp/single-user-bills/${u.id}  `}
        >
          User Bills
        </Link>
      ),
    },
    {
      path: "View",
      label: "View Detail",
      content: (u) => (
        <Link className="btn btn-info btn-sm" to={`/isp/view-user/${u.id}  `}>
          Veiw
        </Link>
      ),
    },
    {
      path: "delete",
      label: "Action",
      content: (u) => (
        <Button
          onClick={() => this.deleteSelectedUser(u.id)}
          color="danger"
          type="button"
          className="btn-sm"
        >
          Delete
        </Button>
      ),
    },
  ];

  async componentDidMount() {
    this.getUsers();
  }

  getUsers = async () => {
    try {
      Toast.loading("Loading...");
      const allUsers = await isp.getAllUsers(admin_id);
      this.setState({ allUsers: allUsers.users });
      if (allUsers.msg[0].code === "400") {
        // window.location = process.env.REACT_APP_BASENAME + "/isp/logout";
      }
    } catch (ex) {
      if (ex.response && ex.response.status === "400") {
        console.log(ex);
        console.log(ex.response.data);
      }
    }
    Toast.hide();
  };

  deleteSelectedUser = async (id) => {
    if (this.state.confirmationModal === false) {
      this.setState({ id: id, confirmationModal: true });
      return;
    } else {
      try {
        Toast.loading("Loading...");
        const res = await isp.deleteUser({ admin_id, id });
        this.getUsers();
        Toast.hide();
        Toast.success(res.msg[0].message, 3000);
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          console.log(ex.response.data);
        }
      }
    }
  };

  conformationToggle = () => {
    this.setState({
      confirmationModal: !this.state.confirmationModal,
    });
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
      allUsers,
      searchName,
      searchCnic,
      searchPhoneNo,
      pageSize,
      currentPage,
    } = this.state;

    let filtered = allUsers.filter(
      (p) =>
        (searchName === "" ||
          p.name.toUpperCase().startsWith(searchName.toUpperCase())) &&
        (searchCnic === "" ||
          p.cnic.toUpperCase().startsWith(searchCnic.toUpperCase())) &&
        (searchPhoneNo === "" ||
          p.cell_num.toUpperCase().startsWith(searchPhoneNo.toUpperCase()))
    );
    const filteredCurrencies = paginate(filtered, currentPage, pageSize);
    return { totalCount: filtered.length, data: filteredCurrencies };
  };

  render() {
    const {
      filterValue,
      pageSize,
      currentPage,
      confirmationModal,
      id,
    } = this.state;
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
                      <h3 className="mb-2">All Users</h3>
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
              <Modal
                isOpen={confirmationModal}
                toggle={this.conformationToggle}
                className={this.props.className}
              >
                <ModalHeader toggle={this.conformationToggle}>
                  Confarmation
                </ModalHeader>
                <ModalBody>
                  <h3>Are you sure?</h3>
                </ModalBody>
                <ModalFooter>
                  <Button
                    onClick={() => {
                      this.deleteSelectedUser(id);
                      this.conformationToggle();
                    }}
                    color="danger"
                    type="button"
                    style={{ padding: "10px 15px" }}
                  >
                    Yes
                  </Button>

                  <Button
                    onClick={() => {
                      this.conformationToggle();
                    }}
                    style={{ padding: "10px 15px" }}
                    color="default"
                    type="button"
                  >
                    No
                  </Button>
                </ModalFooter>
              </Modal>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default Tables;
