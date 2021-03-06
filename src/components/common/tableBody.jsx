import React, { Component } from "react";
import _ from "lodash";

class TableBody extends Component {
  renderCell = (item, column) => {
    if (column.content) return column.content(item);

    // return item[column.path];
    return _.get(item, column.path);
  };

  createKey = (item, column) => {
    return item.id + column.path;
  };

  render() {
    const { columns, data } = this.props;

    return (
      <>
        <tbody>
          {data.map((item) => (
            <tr key={Math.random()}>
              {columns.map((column) => (
                <td key={this.createKey(item, column)}>
                  {this.renderCell(item, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </>
    );
  }
}

export default TableBody;
