import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import {SERVER_URL} from '../constants.js'
import Grid from '@mui/material/Grid';
import {DataGrid} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AddingStudent from './addStudent';

// NOTE:  for OAuth security, http request must have
//   credentials: 'include' 
//

// properties year, semester required
//  
//  NOTE: because SchedList is invoked via <Route> in App.js  
//  props are passed in props.location

class AddStudents extends Component {
  constructor(props) {
    super(props);
    this.state = { students: [] };
  } 
  
  componentDidMount() {
    this.fetchCourses();
  }
  
  fetchCourses = () => {
    console.log("AddStudents.fetchCourses");
    const token = Cookies.get('XSRF-TOKEN');
    
    fetch(`${SERVER_URL}/getStudent`, 
      {  
        method: 'GET', 
        headers: { 'X-XSRF-TOKEN': token }
      } )
    .then((response) => {
      console.log("FETCH RESP:"+response);
      return response.json();}) 
    .then((responseData) => { 
      // do a sanity check on response
      if (Array.isArray(responseData)) {
        this.setState({ 
          students: responseData
		  
        });
      } else {
        toast.error("Fetch 1 failed.", {
          position: toast.POSITION.BOTTOM_LEFT
        });
      }        
    })
    .catch(err => {
      toast.error("Fetch 2 failed.", {
          position: toast.POSITION.BOTTOM_LEFT
        });
        console.error(err); 
    })
  }
/*
  // Drop Course 
  onDelClick = (id) => {
    if (window.confirm('Are you sure you want to drop the course?')) {
      const token = Cookies.get('XSRF-TOKEN');
      
      fetch(`${SERVER_URL}/schedule/${id}`,
        {
          method: 'DELETE',
          headers: { 'X-XSRF-TOKEN': token }
        })
    .then(res => {
        if (res.ok) {
          toast.success("Course successfully dropped", {
              position: toast.POSITION.BOTTOM_LEFT
          });
          this.fetchCourses();
        } else {
          toast.error("Course drop failed", {
              position: toast.POSITION.BOTTOM_LEFT
          });
          console.error('Delete http status =' + res.status);
    }})
      .catch(err => {
        toast.error("Course drop failed", {
              position: toast.POSITION.BOTTOM_LEFT
        });
        console.error(err);
      }) 
    } 
  }
  
  */

   // Add student
  AddingStu = (student) => {
    const token = Cookies.get('XSRF-TOKEN');
 
    fetch(`${SERVER_URL}/addStudent`,
      { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json',
                   'X-XSRF-TOKEN': token  }, 
        body: JSON.stringify(student)
      })
    .then(res => {
        if (res.ok) {
          toast.success("Student successfully added", {
              position: toast.POSITION.BOTTOM_LEFT
          });
          this.fetchCourses();
        } else {
          toast.error("Error when adding", {
              position: toast.POSITION.BOTTOM_LEFT
          });
          console.error('Post http status =' + res.status);
        }})
    .catch(err => {
      toast.error("Error when adding", {
            position: toast.POSITION.BOTTOM_LEFT
        });
        console.error(err);
    })
  }  

  render() {
     const columns = [
      { field: 'name', headerName: 'Student name', width: 400 },
      { field: 'email', headerName: 'Email', width: 300 },
      { field: 'statusCode', headerName: 'Holds', width: 200 }
      ];
  
  return(
      <div>
          <AppBar position="static" color="default">
            <Toolbar>
               <Typography variant="h6" color="inherit">
                  { 'All Students '  }
                </Typography>
            </Toolbar>
          </AppBar>
          <div className="App">
            <div style={{width:'100%'}}>
                For DEBUG:  display state.
                {JSON.stringify(this.state)}
            </div>
			
			<Grid container>
              <Grid item>
                  <AddingStudent AddingStu={this.AddingStu}  />
              </Grid>
            </Grid>
			

            <div style={{ height: 400, width: '100%' }}>
              <DataGrid  getRowId={(row) => row.student_id}  rows={this.state.students} columns={columns} />
            </div>
            <ToastContainer autoClose={1500} />   
          </div>
      </div>
      ); 
  }
}

export default AddStudents;