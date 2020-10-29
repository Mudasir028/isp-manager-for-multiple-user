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

const admin_id = auth.getTokenId();

class UserBills extends React.Component {
  state = {
    allUserBills: [],
    filterValue: "1",
    searchName: "",
    searchCnic: "",
    searchPhoneNo: "",
    cell_nums: [],
    input_cell_value: "",
    isChecked: false,
    checkedItems: new Map(),
    massageReceiver: [],
    massage:
      "  (it is testing message) You did not pay your internet bill. Kindly pay your this month dues. Your last paid date is ",
    lastPaid: [],
    dueAmount: [],
    currentPage: 1,
    pageSize: 20,
  };

  columns = [
    { path: "name", label: "Name" },
    { path: "user_id", label: "User Id" },
    { path: "nic", label: "CNIC" },
    // { path: "cell_num", label: "Number" },
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
          color="success"
          type="button"
          className="btn-sm"
          outline
          onClick={() => this.handleBills(u.user_id)}
        >
          Pay Bill
        </Button>
      ),
    },
    {
      path: "cell_num",
      label: "Send Massage",
      content: (u) => (
        <FormGroup check inline>
          <input
            type="checkbox"
            // checked={this.state.isChecked}
            value={this.state.input_cell_value}
            onChange={(e) => this.handleMassage(e, u)}
            name={u.name}
            checked={this.state.checkedItems.get(u.name)}
            // onChange={this.handleChange}
          />
        </FormGroup>
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

      const recevier = originalAllUserBills.filter(
        (u) => u.user_id === user_id
      );
      if (res.msg[0].message === "Bill is already paid") {
        let formData = new FormData();

        formData.append("key", "39f879b62d572459792cf28b83f5134f");
        formData.append("number", recevier[0].cell_num);

        formData.append(
          "message",
          recevier[0].name +
            " You have paid your this month dues. Your paid amount is " +
            recevier[0].amount +
            "."
        );

        try {
          const fetchResponse = await fetch(
            "https://cors-anywhere.herokuapp.com/http://zitasms.com/services/send.php?key=39f879b62d572459792cf28b83f5134f&number[]=%2B923114100064&number[]=%2B923344964952&message=.&devices=839",
            {
              method: "POST",
              // headers: {'Content-Type':'application/json'},
              body: formData,
            }
          );
          const data = await fetchResponse.json();
          console.log(data);
        } catch (e) {
          return e;
        }
      }

      if (res.msg[0].code === "400") {
        window.location = process.env.REACT_APP_BASENAME + "/isp/logout";
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }
  };

  handleMassage = (event, { cell_num, name, last_paid: last_pay, amount }) => {
    const item = event.target.name;
    const isChecked = event.target.checked;
    this.setState((prevState) => ({
      checkedItems: prevState.checkedItems.set(item, isChecked),
    }));
    // current array of options
    const cell_nums = this.state.cell_nums;
    const massageReceiver = this.state.massageReceiver;
    const lastPaid = this.state.lastPaid;
    const dueAmount = this.state.dueAmount;
    let index;
    // check if the check box is checked or unchecked
    if (event.target.checked) {
      // add the numerical value of the checkbox to cell_nums array
      cell_nums.push(cell_num.replace("0", "+92"));
      massageReceiver.push(name);
      lastPaid.push(last_pay);
      dueAmount.push(amount);
      this.setState({
        cell_nums: cell_nums,
        massageReceiver: massageReceiver,
        lastPaid: lastPaid,
        dueAmount: dueAmount,
      });
      // massageReceiver.push(name);
    } else {
      // or remove the value from the unchecked checkbox from the array
      const cell_nums1 = cell_nums.filter(
        (c) => c !== cell_num.replace("0", "+92")
      );
      const receiver = massageReceiver.filter((m) => m !== name);
      const last = lastPaid.filter((l) => l !== last_pay);
      const due = dueAmount.filter((d) => d !== amount);
      this.setState({
        cell_nums: cell_nums1,
        massageReceiver: receiver,
        lastPaid: last,
        dueAmount: due,
      });
      // index = cell_nums.indexOf(u.cell_nums);
      // cell_nums.splice(index, 1);
      // index = cell_nums.indexOf(u.name);
      // console.log(index);
      // massageReceiver.splice(index, 1);
    }
    // update the state with the new array of options
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
        (searchCnic === "" || p.nic.startsWith(searchCnic)) &&
        (searchPhoneNo === "" ||
          p.cell_num.toUpperCase().startsWith(searchPhoneNo.toUpperCase()))
    );
    const filteredCurrencies = paginate(filtered, currentPage, pageSize);
    return { totalCount: filtered.length, data: filteredCurrencies };
  };

  sendMessage = async () => {
    try {
      const {
        cell_nums,
        massageReceiver,
        massage,
        lastPaid,
        dueAmount,
      } = this.state;
      const mass = massageReceiver.map((m) => m + massage);
      let formData = new FormData(); // Currently empty
      for (let i = 0; i < cell_nums.length; i++) {
        const element = cell_nums[i];
        console.log(element, mass[i]);
        //   // You could add a key/value pair to this using FormData.append:
        formData.append("key", "39f879b62d572459792cf28b83f5134f");
        formData.append("number", cell_nums[i]);
        formData.append(
          "message",
          mass[i] +
            lastPaid[i] +
            ", And your due amount is " +
            dueAmount[i] +
            "."
        );
        try {
          Toast.loading("Loading...");
          const fetchResponse = await fetch(
            "https://cors-anywhere.herokuapp.com/http://zitasms.com/services/send.php?key=39f879b62d572459792cf28b83f5134f&number[]=%2B923114100064&number[]=%2B923344964952&message=.&devices=839",
            {
              method: "POST",
              // headers: {'Content-Type':'application/json'},
              body: formData,
            }
          );
          const data = await fetchResponse.json();
          console.log();
          Toast.hide();
          Toast.success("Massage send succesfully", 3000);
        } catch (e) {
          return e;
        }

        formData.delete("number", cell_nums[i]);
        formData.delete(
          "message",
          mass[i] +
            lastPaid[i] +
            ", And your due amount is " +
            dueAmount[i] +
            "."
        );
        formData.delete("key", "39f879b62d572459792cf28b83f5134f");
      }
      // return;
      // Toast.loading("Loading...");
      // Toast.hide();
      // this.handleFormReset();
      //   if (res.msg[0].code === "503") {
      //     Toast.success(res.msg[0].message.cnic.toString(), 3000);
      //   } else {
      //     Toast.success(res.msg[0].message, 3000);
      //   }
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
                  <Row>
                    <Col className="" xs="8">
                      <nav aria-label="...">
                        <Pagination
                          itemsCount={totalCount}
                          pageSize={pageSize}
                          currentPage={currentPage}
                          onPageChange={this.handlePageChange}
                        />
                      </nav>
                    </Col>

                    <Col className="text-right" xs="4">
                      <Button
                        color="primary"
                        size="lg"
                        onClick={this.sendMessage}
                      >
                        Send
                      </Button>
                    </Col>
                  </Row>
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
