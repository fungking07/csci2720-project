const {BrowserRouter, Link, Route, Switch, Redirect} = ReactRouterDOM;
const Router = BrowserRouter;
const {useRouteMatch, useParams, useLocation} = ReactRouterDOM;
  
  
  function LongLink({label, to, activeOnlyWhenExact}) {
    let match = useRouteMatch({
      path: to,
      exact: activeOnlyWhenExact
      });
      return (
      <li className={match ? "active" : ""}>
      {match && "> "}
      <Link to={to}>{label}</Link>
      </li>
    );
  }

  
  function NoMatch() {
    let location = useLocation();
    return (
    <div>
    <h3>
    No match for <code>{location.pathname}</code>
    </h3>
    </div>
    );
  }
  
  
  
  
  
  class Header extends React.Component {
  render() {
    return (
    <header className="bg-warning">
    <h1 className="display-4 text-center">{this.props.name}</h1>
    </header>
    );
    /* <header> here is an HTML tag! */
    }
  }
  
  class Home extends React.Component {
    render() {
      return (
        <>
        <h2>Home</h2>
        </>
      );
    }
  }
  
  class Main extends React.Component {
  
    render() {
    //console.log(this.props.name);
    return (
    <>
    <main className="container"></main>
    <FileCard />
    </>
    );
    }
  }


  {/* Fake login now */}
  {/* authenticated value will be admin, user and visit later */}
  class Login extends React.Component {

    constructor(props) {
      super(props);
      this.state = { authenticated: -1};
    }

    handleclick() {
      alert("Login successfuly");
      
      if (this.state.authenticated != 0)
        this.setState({authenticated: 0});
      else
        this.setState({authenticated: -1});
    }

    render() {

      if (this.state.authenticated == -1) {
        return (
          <>
                <div>
                  <label><b>Username</b></label>
                  <input type="text" placeholder="Enter Username" name="uname" required></input>
                </div>
                <div>
                  <p>{"\n"}</p>
                  </div>
                <div>
                  <label><b>Password</b></label>
                  <input type="password" placeholder="Enter Password" name="psw" required></input>
                  </div>
                <div>
                  <p>{"\n"}</p>
                </div>
                <button type="submit" onClick={()=>this.handleclick()} >Login</button>  
          
          </>
        )
      }
        else {
          return (
            <>
              <Redirect to= "/user/listallplace" />
              <Route path="/user/listallplace" component={User}/>
            </>
          )
        }
    }
  }

  {/* Need to be implemented */}
  class ListAllPlaces extends React.Component {
    render() {
      return (
        <>
          <h2>ListAllPlaces</h2>
        </>
      )
    }
  }

  {/* Need to be implemented */}
  class ShowAvailable extends React.Component {
    render() {
      return (
        <>
          <h2>ShowAvailable</h2>
        </>
      )
    }
  }

  {/* Need to be implemented */}
  class Search extends React.Component {
    render() {
      return (
        <>
          <h2>Search</h2>
        </>
      )
    }
  }

  class User extends React.Component {

    render() {
      return (
        <>
          <div align="right">
          <p>Username
            <button type="button" className="btn btn-info btn-sm">
              <span className="glyphicon glyphicon-log-out"></span> Log out
            </button>
          </p>
          </div>
          <Router>
            <div>
              <ul>
                <LongLink activeOnlyWhenExact={true} to="/user/listallplace" label="ListAllPlaces"/>
                <LongLink to="/user/showavailable" label="ShowAvailable" />
                <LongLink to="/user/search" label="Search" />
              </ul>
            <hr/>
            <Switch>
              <Route exact path="/user/listallplace" component={ListAllPlaces} /> 
              <Route exact path="/user/showavailable" component={ShowAvailable} />   
              <Route exact path="/user/search" component={Search} />
              <Route exact path="*" component={NoMatch} />
            </Switch>
            </div>
          </Router>
        </>
      )
    }

  }
  
  
  class App extends React.Component {
    render() {
      return (
      
    <>
    <Header name={this.props.name}/>
      <Router>
        <div>
          <ul>
            <Link to="/" label="Home"/>
            <Link to="/file" label="Images"/>
  
          </ul>
        <hr/>
  
        <Switch>
          <Route path="/" component={Login}/>
          <Route path="/user" component={User}/>
        </Switch>



        </div>
      </Router>
    </>
      );
    }
  }
  
  ReactDOM.render(
  <App name="Hospital Lookup"/>, 
  document.querySelector("#app"));
  
