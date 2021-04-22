const {BrowserRouter, Link, Route, Switch, Redirect} = ReactRouterDOM;
const Router = BrowserRouter;
const {useRouteMatch, useParams, useLocation} = ReactRouterDOM;

//change the url here for ur own implementation
var url = "http://csci2720-g49.cse.cuhk.edu.hk"
  
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
      fetch(url + "/loaddata")
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
      var searchurl = url +"/loaddata"+"?field="+this.state.field+"&searchItem="+this.state.keyw;
      fetch(searchurl)
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
                <LongLink to="/admin" label="Admin" />
              </ul>
            <hr/>
            <Switch>
              <Route exact path="/user/listallplace" component={ListAllPlaces} /> 
              <Route exact path="/user/showavailable" component={ShowAvailable} />   
              <Route exact path="/user/search" component={Search} />
              <Route exact path="/admin" component={Admin} />
              <Route exact path="*" component={NoMatch} />
            </Switch>
            </div>
          </Router>
        </>
      )
    }

  }
  //refresh[done]
  class Refresh extends React.Component{
    constructor(props){
      super(props);
      this.state ={data:[],udpate:0};
    }
    componentDidMount(){
      fetch(url+"/loaddata")
      .then(response => response.json())
      .then(data=> this.setState({data}))}

    handleUpdate(){
      axios.get(url+"/update")
      .then(res=> {
        if(res.data =="Update successfully!"){
          this.setState({update:1});
        }else{
          this.setState({update:-1});
        }
        setTimeout(()=>{this.setState({update:0})},2000);
        this.componentDidMount();
      })}
    
    render() {
      return (
        <>
        <h3>Refresh Data</h3>
        <div >
        <button type="button" className="d-inline-block" onClick = {()=>this.handleUpdate()}>Update</button>
        {this.state.update==1 && <p className="d-inline-block ">Udpate Successfully!</p>}
        {this.state.udpate==-1 && <p className="d-inline-block">Fail to Update</p>}
        </div>
        <Table data ={this.state.data}></Table>
        </>
      )
    }
  }
  //CRUD Place interface
  class CRUDPlace extends React.Component{
    render(){
      return(
        <>
        <h3>CRUD Place</h3>
        <Router>
        <div>
          <ul>
            <LongLink activeOnlyWhenExact={true} to="/admin/place/create" label="Create Place"/>
            <LongLink to="/admin/place/read" label="Read Place" />
            <LongLink to="/admin/place/update" label="Update Place" />
            <LongLink to="/admin/place/delete" label="Delete Place" />
          </ul>
        <hr/>
        <Switch>
          <Route exact path="/admin/place/create" component={CreatePlace} /> 
          <Route exact path="/admin/place/read" component={Readplace} />   
          <Route exact path="/admin/place/update" component={UpdatePlace} />
          <Route exact path="/admin/place/delete" component={DeletePlace} />
          <Route path="/admin/place/*" component={NoMatch} />
        </Switch>
        </div>
      </Router>
      </>
      )
    }
  }
  //Admin create place [in process] database problem
  class CreatePlace extends React.Component{
    constructor(props){
      super(props);
      this.state = {info:{name:"",latitude:"",longitude:"",waitTime:"",updateTime:"",udpateTime:""},stm:"",submitted:-1};
      this.handleSubmit = this.handleSubmit.bind(this);
      this.changeItem = this.changeItem.bind(this);
    }
    handleSubmit(event){
      event.preventDefault();
      axios.post(url+ "/admin/addplace",this.state.info)
      .then(res=>{
        this.setState({stm:res.data,submitted:1});
        setTimeout(()=>{this.setState({submitted:-1})},5000);
      })
    }
    changeItem(event,item){
      event.preventDefault();
      let copyinfo = this.state.info
      copyinfo[item] = event.target.value;
      this.setState({info:copyinfo})
    }
    render(){
      return(
        <>
        <h3>Create Place</h3>
        <form onSubmit = {this.handleSubmit}>
          <label> Name
            <input type="text" name="name" onChange={(event)=>this.changeItem(event,"name")}></input>
          </label>
          <br/>
          <label> Latitude
            <input type="text" name ="latitude" onChange={(event)=>this.changeItem(event,"latitude")}></input>
          </label>
          <br/>
          <label> Longitude
            <input type="text" name="longitude" onChange={(event)=>this.changeItem(event,"longitude")}></input>
          </label>
          <br/>
          <label> wait Time
            <input type="text" name="waitTime" onChange={(event)=>this.changeItem(event,"waitTime")}></input>
          </label>
          <br/>
          <label> Update Time 
            <input type="text" name="updateTime" onChange={(event)=>this.changeItem(event,"updateTime")}></input>
          </label>
          <br/>
          <input type="submit"></input>
        </form>
        
        {this.state.submitted ==1 && <p>{this.state.stm}</p>}
        </>
      )
      
    }
  }
  //Admin read place 
  class Readplace extends React.Component{
    constructor(props){
      super(props);
      this.state = {stm:"No data is found"};
    }
    componentDidMount(){
      axios.get(url+"/admin/place")
      .then(res => {
        this.setState({stm:res.data});
        document.getElementById("show_place").innerHTML = this.state.stm;
      });
    }
    render(){
      return(
        <>
        <h3>Read Place</h3>
        <div id = "show_place">
          {this.state.stm}
        </div>
        </>
      )
    }
  }
  //Admin update place [temperarily done]
  class UpdatePlace extends React.Component{
    constructor(props){
      super(props);
      this.state = {info:{name:"",latitude:"",longitude:"",waitTime:"",updateTime:"",comment:""},stm:"",submitted:-1};
      this.handleSubmit = this.handleSubmit.bind(this);
      this.changeItem = this.changeItem.bind(this);
    }
    handleSubmit(event){
      event.preventDefault();
      axios.post(url+"/admin/update",this.state.info)
      .then(res=>{
        this.setState({stm:res.data,submitted:1});
        setTimeout(()=>{this.setState({submitted:-1})},5000);
      })
    }
    changeItem(event,item){
      event.preventDefault();
      let copyinfo = this.state.info
      copyinfo[item] = event.target.value;
      this.setState({info:copyinfo})
    }
    render(){
      return(
        <>
        <h3>Update Place</h3>
        <form onSubmit={this.handleSubmit}>
          <label> Name
            <input type="text" onChange={(event)=>this.changeItem(event,"name")}></input>
          </label>
          <br/>
          <label> Latitude
            <input type="text" onChange={(event)=>this.changeItem(event,"latitude")}></input>
          </label>
          <br/>
          <label> Longitude
            <input type="text" onChange={(event)=>this.changeItem(event,"longitude")}></input>
          </label>
          <br/>
          <label> wait Time
            <input type="text" onChange={(event)=>this.changeItem(event,"waitTime")}></input>
          </label>
          <br/>
          <label> Update Time 
            <input type="text" onChange={(event)=>this.changeItem(event,"udpateTime")}></input>
          </label>
          <br/>
          <button type="submit">Submit</button>
        </form>
        {this.state.submitted==1 &&<p>{this.state.stm}</p>}
        </>
      )
    }
  }
  // Admin delete place [done]
  class DeletePlace extends React.Component{
    constructor(props){
      super(props);
      this.state = {placename:"",stm:"",submitted:-1};
      this.changePlace = this.changePlace.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
    }
    changePlace(event){
      this.setState({placename: event.target.value});
      console.log(this.state.placename);
    }
    handleDelete(event){
      event.preventDefault();
      axios.post(url+"/admin/deleteplaces",{placename:this.state.placename})
      .then(res=>{
        this.setState({stm:res.data,submitted:1});
        setTimeout(()=>{this.setState({submitted:0})},2000);
      })
    }
    render(){
      return(
        <>
        <h3>Delete Place</h3>
        <form onSubmit={this.handleDelete} >
          <label>Hospital being deleted:
            <input  type="text" name="placename" id="delete_item" onChange={this.changePlace}></input>
          </label>
          <br/>
          <button type="submit">Submit</button>
        </form>
        {this.state.submitted==1 && <p>{this.state.stm}</p>}
        </>
      )
    }
  }
  //CRUD users interface
  class CRUDUser extends React.Component{
    render(){
      return(
        <>
        <h3>CRUD User</h3>
        <Router>
        <div>
          <ul>
            <LongLink activeOnlyWhenExact={true} to="/admin/user/create" label="Create User"/>
            <LongLink to="/admin/user/read" label="Read User" />
            <LongLink to="/admin/user/update" label="Update User" />
            <LongLink to="/admin/user/delete" label="Delete User" />
          </ul>
        <hr/>
        <Switch>
          <Route exact path="/admin/user/create" component={CreateUser} /> 
          <Route exact path="/admin/user/read" component={ListAllUser} />   
          <Route exact path="/admin/user/update" component={UpdateUser} />
          <Route exact path="/admin/user/delete" component={DeleteUser} />
          <Route path="/admin/user/*" component={NoMatch} />
        </Switch>
        </div>
      </Router>
      </>
      )
    }
  }
  // Admin create user[done]
  class CreateUser extends React.Component{
    constructor(props){
      super(props);
      this.state = {info:{name:"",password:""},stm:"",submitted:-1};
      this.handleSubmit = this.handleSubmit.bind(this);
      this.changeItem = this.changeItem.bind(this);
    }
    handleSubmit(event){
      event.preventDefault();
      axios.post(url+"/admin/adduser",this.state.info)
      .then(res=>{
        this.setState({stm:res.data,submitted:1});
        setTimeout(()=>{this.setState({submitted:-1})},5000);
      })
    }
    changeItem(event,item){
      event.preventDefault();
      let copyinfo = this.state.info
      copyinfo[item] = event.target.value;
      this.setState({info:copyinfo})
    }
    render(){
      return(
        <>
        <h3>Create User</h3>
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>Username
              <input type="text" onChange={(event)=>this.changeItem(event,"name")}></input>
            </label>
            <label>Password
              <input type="text" onChange={(event)=>this.changeItem(event,"password")}></input>
            </label>
            <br/>
          <button type="submit" >Submit</button>  
          </form>
        </div>
        {this.state.submitted==1 &&<p>{this.state.stm}</p>}
        </>
        
      )
    }
  }
  //Admin read user account [in process]
  class ListAllUser extends React.Component{
    constructor(props){
      super(props);
      this.state = {stm:"No data is found"};
    }
    componentDidMount(){
      axios.get(url+"/admin/users")
      .then(res=>{
        this.setState({stm:res.data});
        document.getElementById("show_user").innerHTML = this.state.stm;
      })
    }
    render(){
      return(
        <>
        <h3>List All User</h3>
        <div id = "show_user">{this.state.stm}</div>
        </>
      )
    }
  }
  //Admin update user [done]
  class UpdateUser extends React.Component{
    constructor(props){
      super(props);
      this.state = {info:{name:"",password:""},stm:"",submitted:-1};
      this.handleSubmit = this.handleSubmit.bind(this);
      this.changeItem = this.changeItem.bind(this);
    }
    handleSubmit(event){
      event.preventDefault();
      axios.post(url+"/admin/updateUser",this.state.info)
      .then(res=>{
        this.setState({stm:res.data,submitted:1});
        setTimeout(()=>{this.setState({submitted:-1})},5000);
      })
    }
    changeItem(event,item){
      event.preventDefault();
      let copyinfo = this.state.info
      copyinfo[item] = event.target.value;
      this.setState({info:copyinfo})
      console.log(this.state.info);
    }
    render(){
      return(
        <>
        <h3>Update User</h3>
        <form onSubmit={this.handleSubmit}>
          <label>Username
            <input type="text" onChange={(event)=>this.changeItem(event,"name")}></input>
          </label>
          <br/>
          <label>Password
            <input type="text" onChange={(event)=>this.changeItem(event,"password")}></input>
          </label>
          <br/>
          <button type="submit">Submit</button>
        </form>
        {this.state.submitted ==1 && <p>{this.state.stm}</p>}
        </>
      )
    }
  }
  //Admin delete user [done]
  class DeleteUser extends React.Component{
    constructor(props){
      super(props);
      this.state = {username:"",stm:"",submitted:-1};
      this.changeUser = this.changeUser.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
    }
    changeUser(event){
      this.setState({username: event.target.value});
      console.log(this.state.placename);
    }
    handleDelete(event){
      event.preventDefault();
      axios.post(url+"/admin/deleteUser",{username:this.state.username})
      .then(res=>{
        this.setState({stm:res.data,submitted:1});
        setTimeout(()=>{this.setState({submitted:0})},2000);
      })
    }
    render(){
      return(
        <>
        <h3>Delete User</h3>
        <form onSubmit={this.handleDelete} >
          <label>Username:
            <input  type="text" name="username" id="delete_item" onChange={this.changeUser}></input>
          </label>
          <br/>
          <button type="submit">Submit</button>
        </form>
        {this.state.submitted==1 && <p>{this.state.stm}</p>}
        </>
      )
    }
  }
  //admin interface 
  class Admin extends React.Component{
    render(){
      return(
        <>
          <div align="right">
          <p>Admin Name
            <button type="button" className="btn btn-info btn-sm">
              <span className="glyphicon glyphicon-log-out"></span> Log out
            </button>
          </p>
          </div>
          <h3>Admin Page</h3>
          <Router>
            <div>
              <ul>
                <LongLink activeOnlyWhenExact={true} to="/admin/refresh" label="Refresh"/>
                <LongLink to="/admin/place" label="CRUD Place" />
                <LongLink to="/admin/user" label="CRUD User" />
              </ul>
            <hr/>
            <Switch>
              <Route exact path="/admin/refresh" component={Refresh} /> 
              <Route exact path="/admin/place" component={CRUDPlace} />   
              <Route exact path="/admin/user" component={CRUDUser} />
              <Route path="/admin/*" component={NoMatch} />
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
  
