import React, { Component } from 'react';
import axios from 'axios';

import Table from '../Table';

class Users extends Component {

  constructor(props) {

    super(props);

    this.state = {
      table: 'users',
      route: 'http://localhost:8080/',
      columns: ['#', 'Login', 'Password'],
      rows: []
    };

  }

  getUsers() {
    axios.get(`${this.state.route}${this.state.table}`)
      .then(response => {
        this.setState({
          rows: response.data.rows
        })
      })
      .catch(err => console.log(err))
  }

  getRowInfo(row) {
    return(
      <div>
        <td>{ row.login }</td>
        <td>{ row.password }</td>
      </div>
    )
  }

  render() {

    this.getUsers();

    return(
      <Table table={this.state.table} columns={this.state.columns} rows={this.state.rows} getRowInfo={this.getRowInfo} />
    )

  }

}

export default Users;
