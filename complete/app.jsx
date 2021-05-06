const {BrowserRouter, Link, Route, Switch, Redirect} = ReactRouterDOM;
const {useState} = React;
const Router = BrowserRouter;
const {useRouteMatch, useParams, useLocation} = ReactRouterDOM;

const STORAGE_KEY = 'id_token';
const STORAGE_KEY_NAME = 'id_name';
const adminRoutes = [
    {
      path: '/admin',
      component: Admin,
      exact: true,
      role: 'admin',
      backUrl: '/login'
    },
    {
      path: '/admin/refresh',
      component: Admin,
      exact: true,
      role: 'admin',
      backUrl: '/login'
    },
    {
      path: '/admin/manageplace',
      component: Admin,
      exact: true,
      role: 'admin',
      backUrl: '/login'
    },
    {
      path: '/admin/manageuser',
      component: Admin,
      exact: true,
      role: 'admin',
      backUrl: '/login'
    }    
  ];

  const userRoutes = [
    {
      path: '/backend',
      component: Backend,
      exact: true,
      role: 'user',
      backUrl: '/login'
    },
    {
      path: '/backend/listallplace',
      component: Backend,
      exact: true,
      role: 'user',
      backUrl: '/login'
    },
    {
      path: '/backend/showavailable',
      component: Backend,
      exact: true,
      role: 'user',
      backUrl: '/login'
    },
    {
      path: '/backend/search',
      component: Backend,
      exact: true,
      role: 'user',
      backUrl: '/login'
    }
  ];

  const publicRoutes = [
    {
      path: '/login',
      component: Login,
      exact: true,
    },
    {
      path: '/',
      component: Home,
      exact: true,
    },
  ];

  function AuthRoute(props) {
    const {
      user: {
        role: userRole
      },
      role: routeRole,
      backUrl,
      history,
      ...otherProps
    } = props;
  
    // 如果用户有权限，就渲染对应的路由
    if (userRole && userRole.indexOf(routeRole) > -1) {
      return <Route
        {...otherProps}
      />
    } else {
      // 如果没有权限，返回配置的默认路由
      return <Redirect to={backUrl} />
    }
  }

  function Home() {
    return (
      <>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/backend">User Page</Link></li>
          <li><Link to="/admin">Admin Page</Link></li>
        </ul>
      </>
    );
  }

  {/* Need to be implemented */}
  {/* Content type may need to change according to different usagew */}
  class ListAllPlaces extends React.Component {

    handleclick() {
      fetch("http://csci2720-g9.cse.cuhk.edu.hk/test", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('id_token')
        },
        mode: 'cors'
      })
      .then((res) => JSON.parse(res))
      .then((responseData) => {
        alert(
          "Get!"
      )
      })
      .catch((error) => console.error(error));
    }

    render() {
      return (
        <>
          <h2>ListAllPlaces</h2>
          <button type="submit" onClick={()=>this.handleclick()} >List</button>  
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

  {/* Need to be implemented */}
  class Refresh extends React.Component {
    render() {
      return (
        <>
          <h2>Refresh</h2>
        </>
      )
    }
  }

  {/* Need to be implemented */}
  class ManagePlace extends React.Component {
    render() {
      return (
        <>
          <h2>ManagePlace</h2>
        </>
      )
    }
  }

  {/* Need to be implemented */}
  class ManageUser extends React.Component {
    render() {
      return (
        <>
          <h2>ManageUser</h2>
        </>
      )
    }
  }

  {/* Need to be implemented */}
  class BlankPage extends React.Component {
    render() {
      return (
        <>
        </>
      )
    }
  }



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

  function Backend(props) {

    const {history} = props;

    const handleclick = () => {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY_NAME);
      history.replace('/');
      alert("Log out successfuly");      
    }    

    return (
        
        <>
        <div align="right">
        <p>{localStorage.getItem(STORAGE_KEY_NAME)}<span> </span>
          <button type="button" className="btn btn-info btn-sm" onClick={handleclick}>
            <span className="glyphicon glyphicon-log-out"></span> Log out
          </button>
        </p>
        </div>
        <Link to="/">Back to homepage</Link>
        <Router>
          <div>
            <ul>
              <LongLink activeOnlyWhenExact={true} to="/backend/listallplace" label="ListAllPlaces"/>
              <LongLink to="/backend/showavailable" label="ShowAvailable" />
              <LongLink to="/backend/search" label="Search" />
            </ul>
          <hr/>
          <Switch>
            <Route exact path="/backend" component={BlankPage} /> 
            <Route exact path="/backend/listallplace" component={ListAllPlaces} /> 
            <Route exact path="/backend/showavailable" component={ShowAvailable} />   
            <Route exact path="/backend/search" component={Search} />
            <Route path="*" component={NoMatch} />
          </Switch>
          </div>
        </Router>
      </>
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


  function Admin(props) {
  
    const {history} = props;

    const handleclick = () => {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY_NAME);
      history.replace('/');
      alert("Log out successfuly");
    }    

    return (

        <>
        <div align="right">
        <p>{localStorage.getItem(STORAGE_KEY_NAME)}<span> </span>
          <button type="button" className="btn btn-info btn-sm" onClick={handleclick}>
            <span className="glyphicon glyphicon-log-out"></span> Log out
          </button>
        </p>
        </div>
        <Link to="/">Back to homepage</Link>
        <Router>
          <div>
            <ul>
              <LongLink activeOnlyWhenExact={true} to="/admin/refresh" label="Refresh"/>
              <LongLink to="/admin/manageplace" label="ManagePlace" />
              <LongLink to="/admin/manageuser" label="ManageUser" />
            </ul>
          <hr/>
          <Switch>
            <Route exact path="/admin" component={BlankPage} /> 
            <Route exact path="/admin/refresh" component={Refresh} /> 
            <Route exact path="/admin/manageplace" component={ManagePlace} />   
            <Route exact path="/admin/manageuser" component={ManageUser} />
            <Route path ="*" component={NoMatch} />
          </Switch>
          </div>
        </Router>
        </>
    );
  }

  class User extends React.Component {
    render() {
      return (
        <>
        <h2>User</h2>
        </>
      );
    }
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


  function Login(props) {
    const {loginAsUser, loginAsAdmin, history} = props;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

  
    const LoginHandler = (admin) => {
      console.log(props);
      if (admin == false) {
        loginAsUser();
        history.replace('/backend');
      }
      else {
        loginAsAdmin();
        history.replace('/admin');
      }

    }

    const onValueChange = (item, selectedValue) =>{
      try {
        localStorage.setItem(item, selectedValue);
      } catch (error) {
        console.log('AsyncStorage error: ' + error.message);
      }
    }

    const handleSubmit = (event) => {
      //alert('A name was submitted: ' + this.state.username);
      console.log(username);
      console.log(password);
      fetch("http://csci2720-g9.cse.cuhk.edu.hk/login", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: username, password: password}),
        mode: 'cors'
      })
      .then((res) => res.json())
      .then((responseData) => {
        console.log(responseData),
        onValueChange(STORAGE_KEY, responseData.token),
        onValueChange(STORAGE_KEY_NAME, responseData.user.name),
        alert(
          "Login Success!"
        ),
        LoginHandler(responseData.user.admin);
      })
      .catch((error) => console.error(error));
      event.preventDefault();
    }

    const handleUsernameChange = (event) => {
      //console.log(event.target.id);
      setUsername(event.target.value);
    }

    const handlePasswordChange = (event) => {
      //console.log(event.target.id);
      setPassword(event.target.value);
    }

    return (
      <>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input type="text" id="username" value={username} onChange={handleUsernameChange} />
          </label>
          <br></br>
          <label>
            password:
            <input type="text" id="password" value={password} onChange={handlePasswordChange} />
          </label>
          <input type="submit" value="Login" />
        </form>
      </>
    );
  }

  function App(props) {
    const [user, setUser] = useState({});
  
    const loginAsUser = () => {
      setUser({
        role: 'user'
      });
    }
  
    const loginAsAdmin = () => {
      setUser({
        role: 'admin'
      });
    }

    const logOut = () => {
      setUser({
        role: ''
      });
    }
  
    return (
      <>
      <Header name={props.name}/>
      <Router>
        <Switch>
          {publicRoutes.map(
            ({path, component, ...route}) => 
              <Route key={path} path={path} {...route} render={(routeProps) => {
                const Component = component;
                return (
                  <Component loginAsUser={loginAsUser} loginAsAdmin={loginAsAdmin} {...routeProps}/>
                )
              }}/>
          )}
          {userRoutes.map(
            (route) => <AuthRoute key={route.path} logOut={logOut} {...route} user={user}/>
          )}
          {adminRoutes.map(
            (route) => <AuthRoute key={route.path} logOut={logOut} {...route} user={user}/>
          )}
        </Switch>
      </Router>
      </>
    );
  }




ReactDOM.render(
    <App name="Hospital Lookup"/>, 
    document.querySelector("#app"));