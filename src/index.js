import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { HashRouter, Route, Link, NavLink } from 'react-router-dom';
import { createStore } from 'redux';
import axios from 'axios';

const SET_EMPLOYEE = 'SET_EMPLOYEE';
const SET_NAVPGS = 'SET_NAVPGS';

const initialState = {
  employees: [],
  totalPages: 0,
  currentPage: 0,
};
const rootEl = document.querySelector('#root');

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EMPLOYEE:
      console.log('setting employees', action.data);
      return { ...state, employees: action.data };
    case SET_NAVPGS:
      console.log('setting nvpgs', action.data);
      return { ...state, totalPages: action.data };
    default:
      return state;
  }
};

const store = createStore(reducer);

const fetchEmployees = async page => {
  const response = await axios.get(`/api/employees/${page}`);
  const employees = response.data.rows;
  console.log('employees', employees);

  store.dispatch({
    type: SET_EMPLOYEE,
    data: employees,
  });
};

const Nav = props => {
  console.log('props in nav', props);
  const totalPages = Math.ceil(employees.count / 50);

  const pageNums = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNums.push(i);
  }
  return (
    <nav>
      <Link to={`/${currentPage - 1}`}>Previous</Link>

      {pageNums.map(num => (
        <NavLink to={`/${num - 1}`} activeStyle={{ color: 'pink' }}>
          {num}
        </NavLink>
      ))}
      <Link to={`/${currentPage + 1}`}>Next</Link>
    </nav>
  );
};

class TblEmply extends Component {
  constructor(props) {
    super();
    this.state = store.getState();
  }

  componentDidUpdate(prevProps) {
    //console.log('prevProps', prevProps.location);

    console.log(this.props);
    const current = this.props.location.pathname.slice(1) * 1;
    const previous = prevProps.location.pathname.slice(1) * 1;

    if (previous !== current) {
      fetchEmployees(current);
    }
  }
  componentDidMount(props) {
    //const { location } = this.props;
    this.setState(store.getState());
  }

  render() {
    const { employees, location } = this.props;
    if (!employees) {
      return '...loading';
    }
    //console.log('employees', employees);
    //const pageNums = location.pathname.slice(1) * 1;

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => {
              return (
                <tr key={employee.id}>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.email}</td>
                  <td>{employee.title}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = store.getState();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  componentDidMount() {
    // fetchPages();

    this.unsubscribe = store.subscribe(() => this.setState(store.getState()));
  }
  render() {
    const { employees } = this.state;

    return (
      <div>
        <h1 id="header">Acme Pager</h1>

        <HashRouter>
          <Route
            path="/:page?"
            render={props => <TblEmply {...this.state} {...props} />}
          />
          <Route render={props => <Nav {...this.state} {...props} />} />
        </HashRouter>
      </div>
    );
  }
}

ReactDOM.render(<App />, rootEl);

//<div>{JSON.stringify(this.state)}</div>
