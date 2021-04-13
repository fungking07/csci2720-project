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
  
   //for printing table in LisTAllPlace and Search
   class Table extends React.Component{
    constructor(props){
      super(props);
      this.state = {ordering:{name:0,latitude:0,longitude:0,waitTime:0}}; //save for the ordering 
      
    }
    onSortChange(key){
      const copyOrdering = this.state.ordering;
      //two cases have been seperated, as name is String, remaining are int, sorting method shd be different
      //sort in ascending order 
      if (this.state.ordering[key]!= 1){ 
        this.props.data.sort(function(a,b){
          if (key == "name")
            return a[key].localeCompare(b[key]);
          else{
            return a[key]-b[key];
          }
        });
        copyOrdering[key] = 1;
      }
      //sort in descending order
      else if (this.state.ordering[key]!=-1){
        this.props.data.sort(function(a,b){
          if (key == "name")
            return b[key].localeCompare(a[key]);
          else{
            return b[key]-a[key];
          }
        });
        copyOrdering[key] = -1;
      }
      this.setState({ordering:copyOrdering});  //change the saved-ordering
    }

    render(){
      return(
        <>
        {this.props.data.length>0 &&(
          <table className="text-center table">
            <thead>
              <tr>
                <th>
                  name<button className = "btn" onClick={()=>this.onSortChange("name")}><span className={this.state.ordering["name"]<0 ? "bi bi-sort-down":"bi bi-sort-up" }/></button>
                </th>
                <th>
                  latitude<button className = "btn" onClick={()=>this.onSortChange("latitude")}><span className={this.state.ordering["latitude"]<0 ? "bi bi-sort-down":"bi bi-sort-up" }/></button>
                </th>
                <th>
                  longitude<button className = "btn" onClick={()=>this.onSortChange("longitude")}><span className={this.state.ordering["longitude"]<0 ? "bi bi-sort-down":"bi bi-sort-up" }/></button>
                </th>
                <th>
                  waiting Time<button className = "btn" onClick={()=>this.onSortChange("waitTime")}><span className={this.state.ordering["waitTime"]<0 ? "bi bi-sort-down":"bi bi-sort-up" }/></button>
                </th>
              </tr>
            </thead>
            <tbody>
            {this.props.data.map((hospital,index)=>
            <tr key = {index}>
              <td>{hospital["name"]}</td>
              <td>{hospital["latitude"]}</td>
              <td>{hospital["longitude"]}</td>
              <td>Over {hospital["waitTime"]} hours</td>
            </tr>
            )}
            </tbody>
          </table>
        )}          
        {this.props.data.length==0 &&
        <p>No data are found</p>}
        </> 
      )
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

  {/* List all hospitals [Processing] */}
  class ListAllPlaces extends React.Component {
    constructor(props){
      super(props);
      this.state = {data :[]};
    }
    componentDidMount(){
      fetch("http://csci2720-g49.cse.cuhk.edu.hk/loaddata")
      .then(response => response.json())
      .then(data=> this.setState({data}))}
    
    render() {
      return (
        <>
        <Table data ={this.state.data}></Table>
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

  {/*Searching [In process]*/ }
  class Search extends React.Component {
    constructor(props){
      super(props);
      this.state = {data :[],field:"name",keyw:"",submitted:false};
      this.handleChangeField = this.handleChangeField.bind(this);
      this.handleChangeKeyw = this.handleChangeKeyw.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeField(event){
      this.setState({field:event.target.value});
    }
    
    handleChangeKeyw(event){
      this.setState({keyw:event.target.value});
    }
    
    handleSubmit(){
      var url = "http://csci2720-g49.cse.cuhk.edu.hk/loaddata"+"?field="+this.state.field+"&searchItem="+this.state.keyw;
      fetch(url)
      .then(response => response.json())
      .then(data=> {
        this.setState({data});
        this.setState({submitted:true});
      })
    }
    
    render() {
      return (
        <>
          <h3>Searching </h3>
          <label>Field</label>
          <select value = {this.state.field} onChange= {this.handleChangeField}>
            <option value = "name">Name</option>
            <option value = "latitude">Latitude</option>
            <option value = "longitude">Longitude</option>
            <option value = "waitTime">Waiting Time</option>
          </select>
          <label>Keywords</label>
          <input onChange={this.handleChangeKeyw}></input>
          <button type="submit" onClick={this.handleSubmit}>submit</button>
          {this.state.submitted &&<Table data = {this.state.data}></Table>}
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
  
