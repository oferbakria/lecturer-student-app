import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Navbar from './navbar/Navbar';
import StudentAtt from './StudentAtt/StudentAtt';
import SendMail from './SendMail/SendMail';
import StudentEdit from './StudentEdit/StudentEdit'

function StudentApp() {
    return (
        <div>
            <Router>
                <Navbar />
                <Switch>
                    <Route exact path="/student"><Redirect to="/student/list" /></Route>
                    <Route path='/student/list' component={() => <StudentAtt />} />
                    <Route path='/student/sendMail' component={() => <SendMail/>} />
                    <Route path='/student/editMe' component={() => <StudentEdit />} />
                </Switch>
            </Router>
        </div>
    )
}

export default StudentApp;
