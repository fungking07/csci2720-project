const {BrowserRouter, Link, Route, Switch, Redirect} = ReactRouterDOM;
const {useState} = React;
const Router = BrowserRouter;
const {useRouteMatch, useParams, useLocation} = ReactRouterDOM;

const url = "http://csci2720-g49.cse.cuhk.edu.hk"
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
      path: '/admin/place',
      component: Admin,
      exact: true,
      role: 'admin',
      backUrl: '/login'
    },
    {
      path: '/admin/place/create',
      component: Admin,
      exact: true,
      role: 'admin',
      backUrl: '/login'
    },
    {
      path: '/admin/place/read',
      component: Admin,
      exact: true,
      role: 'admin',
      backUrl: '/login'
    },
    {
      path: '/admin/place/update',
      component: Admin,
      exact: true,
      role: 'admin',
      backUrl: '/login'
    },
    {
      path: '/admin/place/delete',
      component: Admin,
      exact: true,
      role: 'admin',
      backUrl: '/login'
    },
    {
      path: '/admin/user',
      component: Admin,
      exact: true,
      role: 'admin',
      backUrl: '/login'
    },
    {
      path: '/admin/user/create',
      component: Admin,
      exact: true,
      role: 'admin',
      backUrl: '/login'
    },
    {
      path: '/admin/user/read',
      component: Admin,
      exact: true,
      role: 'admin',
      backUrl: '/login'
    },
    {
      path: '/admin/user/update',
      component: Admin,
      exact: true,
      role: 'admin',
      backUrl: '/login'
    },
    {
      path: '/admin/user/delete',
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
      path: '/backend/GoogleMap',

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

   //for printing table in LisTAllPlace and Search
   class Table extends React.Component{
    constructor(props){
      super(props);
      this.state = {ordering:{name:0,latitude:0,longitude:0,waitTime:0,updateTime:0}}; //save for the ordering 
      
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
          <table className="text-left table">
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
                <th>
                  Last Update Time<button className = "btn" onClick={()=>this.onSortChange("updateTime")}><span className={this.state.ordering["updateTime"]<0 ? "bi bi-sort-down":"bi bi-sort-up" }/></button>

                </th>
              </tr>
            </thead>
            <tbody>
            {this.props.data.map((hospital,index)=>
            <tr key = {index}>
              <td><LongLink to={"/user/place/"+ hospital['name']} label={hospital['name']}/></td>
              <td>{hospital["latitude"]}</td>
              <td>{hospital["longitude"]}</td>
              <td>Over {hospital["waitTime"]} hours</td>
              <td>{hospital["updateTime"]}</td>
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

  {/* List all hospitals [Processing] */}
  class ShowAvailablePlace extends React.Component {
    constructor(props){
      super(props);
      this.state = {data :[]};
    }
    componentDidMount(){
      fetch("http://csci2720-g49.cse.cuhk.edu.hk/loaddata", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('id_token')
        },
        mode: 'cors'
      })
      .then(response => response.json())
      .then(data=> this.setState({data}))}
    
    render() {
      return (
        <>
          <Table data={this.state.data}></Table>
          <GoogleMap data={this.state.data}></GoogleMap>

        </>
      )
    }
  }

class GoogleMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], clickmark: -1, place: "" };
  }

  getGoogleMaps() {
    // If we haven't already defined the promise, define it
    if (!this.googleMapsPromise) {
      this.googleMapsPromise = new Promise((resolve) => {
        // Add a global handler for when the API finishes loading
        window.resolveGoogleMapsPromise = () => {
          // Resolve the promise
          resolve(google);

          // Tidy up
          delete window.resolveGoogleMapsPromise;
        };

        // Load the Google Maps API
        const script = document.createElement("script");
        const API = 'AIzaSyBX3OPlj2Y4dYCqy-tGb0LwJ9f7-ExC6tg';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
        script.async = true;
        document.body.appendChild(script);
      });
    }

    // Return a promise for the Google Maps API
    return this.googleMapsPromise;
  }

  componentWillMount() {
    // Start Google Maps API loading since we know we'll soon need it
    this.getGoogleMaps();
  }

  componentDidMount() {
    this.getGoogleMaps().then((google) => {
      // var location = {};
      var centerLocation = { lat: 22.302711, lng: 114.177216 }; // Hong Kong
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: centerLocation
      });
      
      for (var i = 0; i < this.props.data.length; i++) {
        var markerLoc = { lat: this.props.data[i].latitude, lng: this.props.data[i].longitude };
        var marker = new google.maps.Marker({
          label: this.props.data[i].name,
          position: markerLoc,
          map: map
        })
        let self = this;
        google.maps.event.addListener(
          marker,
          'click',
          (function (marker, i) {
            return function () {
              self.setState({ place: marker.label });
              self.setState({ clickmark: 1 });
            }
          })(marker, i)
        )
      }
    })
  }

  render() {
    // No yet click the marker
    if (this.state.clickmark == -1) {
      return (
        <>
          {this.props.data.length > 0 && (
            <>
              <div id="map" style={{ width: 1200, height: 1000 }}></div>
            </>
          )}
        </>
      )
    }
    else { // clicked
      return (
        <>
          <SeparateView name={this.state.place}></SeparateView>
        </>
      )
    }

  }
}
class SeparateView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], placeinfo: [], info: { user: "", place: "", comment: "" } };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setCommentInfo = this.setCommentInfo.bind(this);
  }

  getGoogleMaps() {
    // If we haven't already defined the promise, define it
    if (!this.googleMapsPromise) {
      this.googleMapsPromise = new Promise((resolve) => {
        // Add a global handler for when the API finishes loading
        window.resolveGoogleMapsPromise = () => {
          // Resolve the promise
          resolve(google);

          // Tidy up
          delete window.resolveGoogleMapsPromise;
        };

        // Load the Google Maps API
        const script = document.createElement("script");
        const API = 'AIzaSyBX3OPlj2Y4dYCqy-tGb0LwJ9f7-ExC6tg';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
        script.async = true;
        document.body.appendChild(script);
      });
    }

    // Return a promise for the Google Maps API
    return this.googleMapsPromise;
  }

  componentWillMount() {
    // Start Google Maps API loading since we know we'll soon need it
    this.getGoogleMaps();
  }

  getplaceinfo() {
    var placeurl = url + "/loaddata?field=name&searchItem=" + this.props.place;
    fetch(placeurl)
      .then(response => response.json())
      .then(placeinfo => {
        this.setState({ placeinfo });
      })
  }

  componentDidMount() {
    axios.get(url + "/loadcomment?searchItem=" + this.props.place)
      .then(res => {
        this.setState({ data: res.data });
      });

    this.getplaceinfo();

    this.getGoogleMaps().then((google) => {
      var centerLocation = { lat: this.state.placeinfo[0].latitude, lng: this.state.placeinfo[0].longitude };
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 20,
        center: centerLocation
      });

      var marker = new google.maps.Marker({
        label: this.state.placeinfo[0].name,
        position: centerLocation,
        map: map
      })

    }
    )
  }

  handleSubmit(event) {
    event.preventDefault();
    axios.post(url + "/addcomment", this.state.info)
      .then(res => {
        this.setState({ stm: res.data, submitted: 1 });
        setTimeout(() => { this.setState({ submitted: -1 }) }, 5000);
        this.componentDidMount();
      })
  }

  setCommentInfo(event) {
    event.preventDefault();
    let copyinfo = this.state.info
    copyinfo["user"] = "test2"; // need to change to your user
    copyinfo["place"] = this.state.placeinfo[0].name;
    copyinfo["comment"] = event.target.value;
    this.setState({ info: copyinfo });
  }

  render() {
    return (
      <>
        <div id="map" style={{ width: 1200, height: 500 }}></div>

        {this.state.data.length == 0 && (
          <h4>NO comment for this place yet.</h4>
        )}

        {this.state.data.length > 0 && (
          <table className="text-left table">
            <thead>
              <tr>
                <th>author</th>
                <th>comment</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map((commments, index) =>
                <tr key={index}>
                  <td>{commments[0]}</td>
                  <td>{commments[1]}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        <h3>Add a new comment</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="mb-3">
            <textarea id="commentbox" className="form-control" rows="3" onChange={(event) => this.setCommentInfo(event)}></textarea>
          </div>
          <input type="submit"></input>
        </form>

      </>
    )
  }
}

=======
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

  {/*Searching */ }
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
      fetch(searchurl, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('id_token')
        },
        mode: 'cors'
      })
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

  class Refresh extends React.Component{
    constructor(props){
      super(props);
      this.state ={data:[],update:0};

    }
    componentDidMount(){
      fetch(url+"/loaddata", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('id_token')
        },
        mode: 'cors'
      })
      .then(response => response.json())
      .then(data=> this.setState({data}))}

    handleUpdate(){
      fetch(url+"/update", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('id_token')
        },
        mode: 'cors'
      })
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
        {this.state.update==1 && <p className="d-inline-block ">update Successfully!</p>}
        {this.state.update==-1 && <p className="d-inline-block">Fail to Update</p>}

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
      this.state = {info:{name:"",latitude:"",longitude:"",waitTime:"",updateTime:""},stm:"",submitted:-1};

      this.handleSubmit = this.handleSubmit.bind(this);
      this.changeItem = this.changeItem.bind(this);
    }
    handleSubmit(event){
      event.preventDefault();
      axios.post(url+ "/admin/addplace",this.state.info, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('id_token')
        }
      })
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
      axios.get(url+"/admin/place", {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('id_token')
        }
      })
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
      axios.post(url+"/admin/update",this.state.info, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('id_token')
        }
      })
      .then(res=>{
        this.setState({stm:res.data,submitted:1});
        setTimeout(()=>{this.setState({submitted:-1})},5000);
      })
    }
    changeItem(event,item){
      event.preventDefault();
      let copyinfo = this.state.info;
      copyinfo[item] = event.target.value;
      this.setState({info:copyinfo})
    }
    clickbutton(){
      let copyinfo = this.state.info;
      copyinfo["updateTime"] = moment().format("DD/MM/YYYY hh:mmA");
      this.setState({info:copyinfo});
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
          <button type="submit" onClick = {()=>this.clickbutton()}>Submit</button>
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
      this.state = {name:"",stm:"",submitted:-1};
      this.changePlace = this.changePlace.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
    }
    changePlace(event){
      this.setState({name: event.target.value});
      //console.log(this.state.name);
    }
    handleDelete(event){
      event.preventDefault();
      axios.post(url+"/admin/deleteplace",{name:this.state.name}, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('id_token')
        }
      })
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
            <input  type="text" name="name" id="delete_item" onChange={this.changePlace}></input>
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
      axios.post(url+"/admin/adduser",this.state.info, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('id_token')
        }
      })
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
      axios.get(url+"/admin/users", {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('id_token')
        }
      })
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
      axios.post(url+"/admin/updateUser",this.state.info, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('id_token')
        }
      })
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
      this.state = {name:"",stm:"",submitted:-1};
      this.changeUser = this.changeUser.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
    }
    changeUser(event){
      this.setState({name: event.target.value});
    }
    handleDelete(event){
      event.preventDefault();
      axios.post(url+"/admin/deleteUser",{name:this.state.name}, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('id_token')
        }
      })
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
            <input  type="text" name="name" id="delete_item" onChange={this.changeUser}></input>
          </label>
          <br/>
          <button type="submit">Submit</button>
        </form>
        {this.state.submitted==1 && <p>{this.state.stm}</p>}
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
              <LongLink to="/backend/GoogleMap" label="GoogleMap" />
              <LongLink to="/backend/search" label="Search" />
            </ul>
          <hr/>
          <Switch>
            <Route exact path="/backend" component={BlankPage} /> 

              <Route exact path="/backend/listallplace" component={ShowAvailablePlace} />
            <Route exact path="/backend/GoogleMap" component={GoogleMap} />   

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
              <LongLink to="/admin/place" label="CURDPlace" />
              <LongLink to="/admin/user" label="CRUDUser" />
            </ul>
          <hr/>
          <Switch>
            <Route exact path="/admin" component={BlankPage} />
            <Route exact path="/admin/refresh" component={Refresh} /> 
            <Route exact path="/admin/place" component={CRUDPlace} />
            <Route exact path="/admin/user" component={CRUDUser} />
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
      fetch("http://csci2720-g49.cse.cuhk.edu.hk/login", {
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
        LoginHandler(responseData.user.isAdmin);
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