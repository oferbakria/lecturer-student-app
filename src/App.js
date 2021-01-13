import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Login from './components/login/Login'
import SecretNavBar from './components/SecretNavBar';
import LecturerApp from './components/lecturerComp/LecturerApp';
import StudentApp from './components/studentComp/StudentApp';
import ForgotPass from './components/login/ForgotPass'
function App() {
  return (
    <div className="App">
       <Router>
        <SecretNavBar />
        <Switch>
          <Route exact path="/"><Redirect to="/login"/></Route>
          <Route path='/login' component={() => <Login />} />
          <Route path='/forgotpass' component={() => <ForgotPass />} />
          <Route path='/lecturer' component={() => <LecturerApp />} />
          <Route path='/student' component={() => <StudentApp />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
