import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';

class SignUp extends Component {

    constructor(props) {

        super(props);

        this.state = {
            table: 'administrators',
            route: 'http://localhost:8080/',
            columns: ['id', 'login', 'password'],
            columnsAlt: ['#', 'Login', 'Password'],
            administrator: {
                login: '',
                password: ''
            },
            signedUp: false,
            errors: []
        }

        this.statusCodes = {
            BAD_REQUEST: 400,
            INTERNAL_SERVER_ERROR: 500
        };

        this.onChangeLogin = this.onChangeLogin.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

    }

    onChangeLogin(e) {
        this.setState({
            administrator : {
                ...this.state.administrator,
                login: e.target.value
            }
        });
    }

    onChangePassword(e) {
        this.setState({
            administrator: {
                ...this.state.administrator,
                password: e.target.value
            }
        });
    }

    onSubmit(e) {

        e.preventDefault();

        const obj = {
            login: this.state.administrator.login,
            password: this.state.administrator.password
        };

        axios.post(`${this.state.route}signup`, obj)
        .then(response => {
            this.setState({
                signedUp: true,
                errors: []
            })
        })
        .catch(err => {
            console.log(err);
            if (err.response && (err.response.status ===
                this.statusCodes.INTERNAL_SERVER_ERROR ||
                err.response.status === this.statusCodes.BAD_REQUEST)) {
                this.setState({
                    signedUp: false,
                    errors: err.response.data.errors
                });
            }
        })

    }

    render() {

        let errorBlocks = null;
        if (this.state.signedUp) {
            return <Redirect from="/signup" to="/signin" />
        }
        else {
            errorBlocks = this.state.errors.map((error) =>
                <div key={ error.msg } className="container">
                    <div className="alert alert-danger">{ error.msg }</div>
                </div>
            );
        }

        return(

            <div>
                <Link to="/signin" rel="noopener" className="btn btn-primary" align="right">Sign In</Link>
                <div>
                    { errorBlocks }
                </div>
                <div className="container">
                    <form method="post" onSubmit={ this.onSubmit } align="center">
                        <div className="form-group">
                            <label htmlFor="exampleFormControlInput1">{ this.state.columnsAlt[1] }:</label>
                            <input type="text" name={ this.state.columns[1] } value={ this.state.administrator.login } onChange= { this.onChangeLogin } className="form-control" id="exampleFormControlInput1" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlInput2">{ this.state.columnsAlt[2] }:</label>
                            <input type="password" name={ this.state.columns[2] } value={ this.state.administrator.password } onChange= { this.onChangePassword } className="form-control" id="exampleFormControlInput2" required />
                        </div>
                        <button type="submit" name="Sign Up" className="btn btn-success" align="center">Sign Up</button>
                    </form>
                </div>
            </div>

        )
    }
}

export default SignUp;
