import React from "react";

import { Link } from "react-router-dom";

// reactstrap components
import {
  Card,
  CardHeader,
  CardFooter,
  Form,
  FormGroup,
  Input,
  Col,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
// core components
import TableComponent from "components/common/table";
import Header from "components/Headers/Header.js";

import isp from "../../services/ispService";
import userPic from "assets/img/theme/team-4-800x800.jpg";
import Toast from "light-toast";
import Pagination from "../../components/common/pagination";
import { paginate } from "../../utils/paginate";
import auth from "../../services/authService";
const admin_id = auth.getCurrentUserId();

class Packages extends React.Component {
  state = {
    allPackages: [],
    searchQuery: "",
    currentPage: 1,
    pageSize: 20,
    confirmationModal: false,
    id: "",
  };

  columns = [
    { path: "name", label: "Name" },
    {
      path: "type",
      label: "Type",
    },
    {
      path: "duration",
      label: "Duration",
    },
    { path: "charges", label: "Charges" },
    { path: "franchise_id", label: "Franchise" },
    { path: "data_limit", label: "Data Limit" },
    {
      path: "status",
      label: "Status",
      content: (p) => (p.status === "1" ? "Active" : "Unactive"),
    },
    { path: "description", label: "Description" },
    {
      path: "pic",
      label: "Pic (optional)",
      content: (p) => (
        <div className="avatar-group">
          <a
            className="avatar avatar-sm"
            href="#pablo"
            id="tooltip742438047"
            onClick={(e) => e.preventDefault()}
          >
            <img alt="..." className="rounded-circle" src={p.pic || userPic} />
          </a>
        </div>
      ),
    },
    { path: "created_at", label: "Created At" },
    { path: "updated_at", label: "Updated At" },
    {
      path: "View",
      label: "View Detail",
      content: (p) => (
        <Link className="btn btn-info btn-sm" to={`/isp/view-package/${p.id}`}>
          Veiw
        </Link>
      ),
    },
    {
      path: "delete",
      label: "Action",
      content: (p) => (
        <Button
          onClick={() => this.deleteSelectedPackage(p.id)}
          color="danger"
          type="button"
          className="btn-sm"
        >
          Delete
        </Button>
      ),
    },
  ];

  componentDidMount() {
    this.getAllPackage();
  }

  getAllPackage = async () => {
    try {
      Toast.loading("Loading...");
      const allPackages = await isp.getAllPackages(admin_id);
      this.setState({ allPackages: allPackages.packages });
      if (allPackages.msg[0].code === "400") {
        window.location = process.env.REACT_APP_BASENAME + "/isp/logout";
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }
    Toast.hide();
  };

  deleteSelectedPackage = async (id) => {
    if (this.state.confirmationModal === false) {
      this.setState({ id: id, confirmationModal: true });
      return;
    } else {
      try {
        Toast.loading("Loading...");
        const res = await isp.deletePackage({ admin_id, id });
        this.getAllPackage();
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

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleFilter = ({ currentTarget: input }) => {
    this.setState({ [input.name]: input.value, currentPage: 1 });
  };

  filterCurrencies = () => {
    const { allPackages, searchQuery, pageSize, currentPage } = this.state;

    let filtered = allPackages.filter(
      (c) =>
        searchQuery === "" ||
        c.name.toUpperCase().startsWith(searchQuery.toUpperCase())
    );
    const filteredCurrencies = paginate(filtered, currentPage, pageSize);
    return { totalCount: filtered.length, data: filteredCurrencies };
  };

  render() {
    const {
      pageSize,
      currentPage,
      searchQuery,
      confirmationModal,
      id,
    } = this.state;

    const { totalCount, data } = this.filterCurrencies();

    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">All Packages</h3>
                    </Col>

                    <Col className="text-right" xs="4">
                      <Form>
                        <FormGroup className="mb-0">
                          <Input
                            type="text"
                            name="searchQuery"
                            id=""
                            placeholder="Search by Package Name..."
                            onChange={this.handleFilter}
                            value={searchQuery}
                            className="form-control-alternative"
                          />
                        </FormGroup>
                      </Form>
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
                      this.deleteSelectedPackage(id);
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

export default Packages;
