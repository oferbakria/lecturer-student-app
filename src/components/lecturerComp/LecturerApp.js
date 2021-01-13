import React  from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Navbar from './Navbar';
import StudentsTableComp from './StudentsTableComp';
import Meeting from './MeetingAtt/Meeting';
import AddStudent from './AddComp/AddStudent'
import EditStudent from'./EditComp/EditStudent';
import LecturerEdit from './LecturerEditComp/LecturerEdit'
function LecturerApp() {
    return (
        <div>
            <Router>
                <Navbar />
                <Switch>
                    <Route exact path="/lecturer"><Redirect to="/lecturer/list" /></Route>
                    <Route path='/lecturer/list' component={() => <StudentsTableComp/>} />
                    <Route path='/lecturer/meeting' component={() => <Meeting/>} />
                    <Route path='/lecturer/add' component={() => <AddStudent />} />
                    <Route path='/lecturer/editMe' component={() => <LecturerEdit />} />
                    <Route path='/lecturer/edit/:id' component={() => <EditStudent />} />
                </Switch>
            </Router>
        </div>
    )
}

export default LecturerApp;
