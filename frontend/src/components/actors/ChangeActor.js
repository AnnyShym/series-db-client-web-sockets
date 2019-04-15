import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class ChangeActor extends Component {

    constructor(props) {

        super(props);

        this.state = {
            table: 'actors',
            route: 'http://localhost:8080/',
            columns: ['id', 'name', 'middle_name', 'last_name', 'citizenship'],
            columnsAlt: ['#', 'Name', 'Middle Name', 'Last Name', 'Citizenship'],
            countries: [],
            actor: {
                name: '',
                middle_name: '',
                last_name: '',
                citizenship: 'NULL'
            },
            changed: false,
            errors: []
        }

        this.statusCodes = {
            CREATED: 201,
            NO_CONTENT: 204,
            BAD_REQUEST: 400
        };

        this.opInsert = 'insert';
        this.opUpdate = 'update';

        this.onChangeName= this.onChangeName.bind(this);
        this.onChangeMiddleName = this.onChangeMiddleName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
        this.onChangeCitizenship = this.onChangeCitizenship.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

    }

    componentDidMount() {

        this.getCountries();

        if (this.props.match.params.operation == this.opUpdate) {
            this.getActorInfo();
        }

    }

    getCountries() {
        axios.get(`${this.state.route}${this.state.table}/countries`)
        .then(response => {
            this.setState({
                countries: response.data.countries
            })
        })
        .catch(err => console.log(err))
    }

    getActorInfo() {
        axios.get(`${this.state.route}${this.state.table}/${this.props.match.params.id}`)
        .then(response => {
            this.setState({
                actor: response.data.actor[0]
            })
        })
        .catch(err => console.log(err))
    }

    onChangeName(e) {
        this.setState({
            actor : {
                ...this.state.actor,
                name: e.target.value
            }
        });
    }

    onChangeMiddleName(e) {
        this.setState({
            actor: {
                ...this.state.actor,
                middle_name: e.target.value
            }
        });
    }

    onChangeLastName(e) {
        this.setState({
            actor: {
                ...this.state.actor,
                last_name: e.target.value
            }
        });
    }

    onChangeCitizenship(e) {
        this.setState({
            actor: {
                ...this.state.actor,
                citizenship: e.target[e.target.selectedIndex].value
            }
        });
    }


    onSubmit(e) {

        e.preventDefault();

        const obj = {
            name: this.state.actor.name,
            middle_name: this.state.actor.middle_name,
            last_name: this.state.actor.last_name,
            citizenship: this.state.actor.citizenship,
        };

        let route = null;
        if (this.props.match.params.operation === this.opInsert) {
            route = `${this.state.route}${this.state.table}/${this.props.match.params.operation}`
        }
        else {
            route = `${this.state.route}${this.state.table}/${this.props.match.params.operation}/${this.props.match.params.id}`;
        }

        axios.post(route, obj)
            .then((response) => {
                this.setState({
                    errors: [],
                    changed: true
                });
            })
            .catch(err => {
                console.log(err);
                if (err.response.status == this.statusCodes.BAD_REQUEST) {
                    this.setState({
                        errors: err.response.data.errors,
                        changed: false
                    });
                }
                else {
                    this.setState({
                        errors: [],
                        changed: false
                    });
                }
            })

    }

    render() {

        let errorBlocks = null;
        if (this.state.changed) {
            return <Redirect from={ `/${this.state.table}/${this.props.match.params.operation}/${this.props.match.params.id}` } to={ `/${this.state.table}` } />
        }
        else {
            errorBlocks = this.state.errors.map((error) =>
                <div className="container">
                    <div className="alert alert-danger">{ error.msg }</div>
                </div>
            );
        }

        const countryOptions = this.state.countries.map((country) => {
            if (country == this.state.actor.citizenship) {
                return <option selected value={ country }>{ country }</option>
            } else {
                return <option value={ country }>{ country }</option>
            }
        });

        const operationAlt = this.props.match.params.operation[0].toUpperCase() + this.props.match.params.operation.slice(1);

        if (this.props.match.params.operation != this.opInsert && this.props.match.params.operation != this.opUpdate) {
            return <div></div>
        }

        return(

            <div>
                <div>
                    { errorBlocks }
                </div>
                <div className="container">
                    <form method="post" onSubmit={ this.onSubmit } align="center">
                        <div className="form-group">
                            <label for="exampleFormControlInput1">{ this.state.columnsAlt[1] }:</label>
                            <input type="text" name={ this.state.columns[1] } value={ this.state.actor.name } onChange= { this.onChangeName } className="form-control" id="exampleFormControlInput1" required />
                        </div>
                        <div className="form-group">
                            <label for="exampleFormControlInput1">{ this.state.columnsAlt[2] }:</label>
                            <input type="text" name={ this.state.columns[2] } value={ this.state.actor.middle_name } onChange= { this.onChangeMiddleName } className="form-control" id="exampleFormControlInput1" />
                        </div>
                        <div className="form-group">
                            <label for="exampleFormControlInput1">{ this.state.columnsAlt[3] }:</label>
                            <input type="text" name={ this.state.columns[3] } value={ this.state.actor.last_name } onChange= { this.onChangeLastName } className="form-control" id="exampleFormControlInput1" required />
                        </div>
                        <div className="form-group">
                            <label for="exampleFormControlInput1">{ this.state.columnsAlt[4] }:</label>
                            <select name={ this.state.columns[4] } onChange= { this.onChangeCitizenship } className="form-control" id="exampleFormControlSelect1">
                                { countryOptions }
                            </select>
                        </div>
                        <button type="submit" name={ operationAlt } className="btn btn-success" align="center">{ operationAlt }</button>
                    </form>
                </div>
            </div>

        )
    }
}

export default ChangeActor;
