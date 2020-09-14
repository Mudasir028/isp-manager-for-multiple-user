import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";
import { Table } from "reactstrap";

const TableComponent = ({
  columns,
  sortColumn,
  onSort,
  data = [],
  classes,
}) => {
  if (data.length === 0) {
    return <h4 className="text-center my-5">No Record Found</h4>;
  }
  return (
    <React.Fragment>
      <div className="table-responsive">
        <Table className={classes}>
          <TableHeader
            columns={columns}
            sortColumn={sortColumn}
            onSort={onSort}
          />
          <TableBody columns={columns} data={data} />
        </Table>
      </div>
    </React.Fragment>
  );
};

export default TableComponent;
