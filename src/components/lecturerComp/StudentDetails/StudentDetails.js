import React,{useEffect,useState} from 'react';
import axios from 'axios';
import AttendanceComp from './AttendanceComp'
import './StudentDetails.css';
import Cookies from 'js-cookie';
import CloseIcon from '@material-ui/icons/Close';


function StudentDetails(props) {
    const[refresh,setRefresh]= useState(-1)//for refresh after update attendances
    const [data, setData] = useState([]);
    const[was,setWas]=useState(0);
    
    useEffect(() => {
        let token = (!Cookies.get('token')) ? { message: "" } : JSON.parse(Cookies.get('token'));
        if (token.message === "auth succesfull") {
            checkAccessToken();
            axios.post('http://localhost:5000/info/attendances',{id:props.current._id})
            .then(response => {
                setData(response.data.info);
                checkIfIwas(response.data.info);
                console.log(response.data.info);
            })
                .catch((err) => `error With get studens ${err}`);
        } else {
            deleteCookieAndGoLogin();
        }
    }, [refresh]);

    function checkAccessToken() {
        let token = (JSON.parse(Cookies.get('token')));
        axios.post('http://localhost:5000/lecturer/checkAccessToken', { accessToken: token.accessToken })
            .then(res => {
                if (res.data.message === "auth succesfull") {//check if the access token that we had is not expire
                    return;
                } else {
                    if (res.data.message === "jwt expired") {//-notice : the acceess token expired,but doesn't attacked
                        axios.post('http://localhost:5000/lecturer/token', { refreshToken: token.refreshToken })
                            .then(res => {
                                if (res.data.accessToken !== "") {//if success generate a new access token
                                    token.accessToken = res.data.accessToken//update the old access token to new one
                                    Cookies.set('token', JSON.stringify(token))
                                } else {
                                    deleteCookieAndGoLogin();
                                }
                            })
                            .catch(err => { console.log("error with fetch") })
                    } else {//res.data.message will be malformed , been attacked
                        deleteCookieAndGoLogin();
                    }
                }
            })
            .catch(err => { console.log("error with fetch") });
    }
    function deleteCookieAndGoLogin() {
        Cookies.remove('token');
        window.location = '/';
    }
    let attendances = data.map((curr,indx) => {
        return <AttendanceComp current={curr} index={indx} refreshAttendaces={(num)=>setRefresh(num)}/>
    });
    function checkIfIwas(arr){
        let num=0
        let x = arr.map((curr) => {
            if(curr.was){
                num++
            }
        });
        setWas(num);
    }
    return (
        <div className='studentDetails'>
            <div className="table-student">
                {/* we have to do this func async because we have to wait to page rendering and after
                 that to restore input serach value */}
                <CloseIcon className="cancel" onClick={async() => {await props.showStudents();props.setSearch(props.subNameToSort,props.myScreenPosition)}}/>
                <div className="stuHeader">Hello {props.current.firstname}</div>
                <div className="imgStudentInfo">
                    <img src={`/studentImages/${props.current.pic}`} alt=""></img>
                    <div className="myName">
                        <div>First Name: {props.current.firstname}</div>
                        <div>Last Name: {props.current.lastname}</div>
                        <div>Id: {props.current.id}</div>
                        <div>E-mail: {props.current.email}</div>
                        <div>Percentage Attendances: <labe style={{"background-color":Math.floor(was/data.length*100)>80?"green":"red","color":"white"}}> {Math.floor(was/data.length*100)||0}%</labe></div>{/* || 0 deosn't show nan% */}
                    </div>
                </div>
                <table cellspacing="0">
                    <tr className="hideCol">
                        <th>Date</th>
                        <th>Your attendance</th>
                    </tr>
                    {attendances}
                </table>
            </div>
        </div>
    )
}

export default StudentDetails
