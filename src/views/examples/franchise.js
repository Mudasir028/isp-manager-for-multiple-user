import React from "react";
import { Link } from "react-router-dom";

// reactstrap components
import {
  Card,
  CardHeader,
  Form,
  FormGroup,
  Input,
  Col,
  CardFooter,
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
import Toast from "light-toast";
import Pagination from "../../components/common/pagination";
import { paginate } from "../../utils/paginate";
import auth from "../../services/authService";

const admin_id = auth.getTokenId();

class Franchise extends React.Component {
  state = {
    allFranchises: [],
    searchQuery: "",
    currentPage: 1,
    pageSize: 20,
    confirmationModal: false,
    id: "",
  };

  columns = [
    { path: "name", label: "Name" },
    { path: "area", label: "Area" },
    { path: "details", label: "Details" },
    {
      path: "View",
      label: "View Detail",
      content: (f) => (
        <Link
          className="btn btn-info btn-sm"
          to={`/isp/view-franchise/${f.id}`}
        >
          Veiw
        </Link>
      ),
    },
    {
      path: "delete",
      label: "Action",
      content: (f) => (
        <Button
          onClick={() => this.deleteSelectedFranchise(f.id)}
          color="danger"
          type="button"
          className="btn-sm"
          outline
        >
          Delete
        </Button>
      ),
    },
  ];

  async componentDidMount() {
    this.getAllFranchise();
  }

  getAllFranchise = async () => {
    try {
      Toast.loading("Loading...");
      const allFranchises = await isp.getAllFranchises(admin_id);
      this.setState({ allFranchises: allFranchises.franchises });
      Toast.hide();
      if (allFranchises.msg[0].code === "400") {
        // window.location = process.env.REACT_APP_BASENAME + "/isp/logout";
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }
  };

  deleteSelectedFranchise = async (id) => {
    if (this.state.confirmationModal === false) {
      this.setState({ id: id, confirmationModal: true });
      return;
    } else {
      try {
        Toast.loading("Loading...");
        const res = await isp.deleteFranchise({ admin_id, id });
        this.getAllFranchise();
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

  filterFranchises = () => {
    const { allFranchises, searchQuery, pageSize, currentPage } = this.state;

    let filtered = allFranchises.filter(
      (c) =>
        searchQuery === "" ||
        c.name.toUpperCase().startsWith(searchQuery.toUpperCase())
    );
    const filteredCurrencies = paginate(filtered, currentPage, pageSize);
    return { totalCount: filtered.length, data: filteredCurrencies };
  };

  render() {
    const {
      searchQuery,
      pageSize,
      currentPage,
      confirmationModal,
      id,
    } = this.state;

    const { totalCount, data } = this.filterFranchises();
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
                      <h3 className="mb-0">All Franchises</h3>
                    </Col>

                    <Col className="text-right" xs="4">
                      <Form>
                        <FormGroup className="mb-0">
                          <Input
                            type="text"
                            name="searchQuery"
                            id=""
                            placeholder="Search by Franchise Name..."
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
                  <Pagination
                    itemsCount={totalCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={this.handlePageChange}
                  />
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
                      this.deleteSelectedFranchise(id);
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

export default Franchise;
