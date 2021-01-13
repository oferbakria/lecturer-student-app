import React,{useState,useEffect} from 'react'
import axios from 'axios';
import './Meeting.css';
import StudentMeetComp from './StudentMeetComp';
import Cookies from 'js-cookie';


function Meeting() {
    const [url, setUrl] = useState(`http://localhost:5000/student/getAllStudents`);
    const [dataStudents, setDataStudents] = useState([]);// to save the student in local varibale
    let date = new Date();
    let liName=["li1","li2","li3","li4","li5"];//for change background color og current component in navbar
    function dqs(ele){
        return document.querySelector(`#${ele}`);
    }
    function changeNavbarBColor(){
        liName.map((curr) => {
            if(curr==="li2"){
            dqs(curr).style.backgroundColor = "#9ad3bc";
            }else{
                dqs(curr).style.backgroundColor = "#327A81"
            }
        });
    }

    useEffect(() => {//handle the token
        changeNavbarBColor();
        let token = (!Cookies.get('token')) ? { message: "" } : JSON.parse(Cookies.get('token'));
        if (token.message === "auth succesfull") {
            checkAccessToken();
            axios.post(url)
            .then(studentsObj => {
                setDataStudents(studentsObj.data.info);
                console.log(studentsObj.data.info);
            })
            .catch((err) => `error With get studens ${err}`);
        } else {
            deleteCookieAndGoLogin();
        }
    }, []);
   
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
        Cookies.remove('rememberMe');
        window.location = '/';
    }
    let students = dataStudents.map((curr,index) => {
        return <StudentMeetComp current={curr} indx={index}/>
    });
    return (
        <div className="table-meeting">
            <div className="header">Attendance Of Meeting-{date.getDate()}/{date.getMonth()+1}/{date.getFullYear()}</div>

            <table cellspacing="0">
                <tr>
                    <th>Student Id</th>
                    <th> Full Name</th>
                    <th>Attendance Meeting</th>
                </tr>
                {students}
            </table>
        </div>
    )
}

export default Meeting
