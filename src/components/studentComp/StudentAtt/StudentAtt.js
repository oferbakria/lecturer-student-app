import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import AttendanceComp from './AttendanceComp'
import './StudentDetails.css'

function StudentAtt() {
    const [url, setUrl] = useState(`http://localhost:5000/info/attendances`);
    const [dataStudent, setDataStudent] = useState([]);// to save the student Attendance in local varibale
    const [aboutMe, SetaAboutMe] = useState({})
    //it will contains the information that we'll get from student id that we get from the accessToken
    const [was, setWas] = useState(0);//we will sum how many times the student was in the class
    let liName = ["li1", "li2", "li3"];//for change background color og current component in navbar
    function changeNavbarBColor() {
        liName.map((curr) => {
            if (curr === "li1") {
                dqs(curr).style.backgroundColor = "#9ad3bc";
            } else {
                dqs(curr).style.backgroundColor = "#327A81"
            }
        });
    }
    useEffect(async () => {//handle the token
        initToken();
        let token = JSON.parse(Cookies.get('token'));
        changeNavbarBColor();
        if (token.message === "auth succesfull") {
            let myId = await checkAccessToken();//because we have to wait to the fetch from axios and then to got the student Id
            axios.post(url, { id: myId })
                .then(studentlist => {
                    setDataStudent(studentlist.data.info);
                    checkIfIwas(studentlist.data.info);
                })
                .catch((err) => `error With get studens ${err}`);
        } else {
            deleteCookieAndGoLogin();
        }
    }, []);
    async function checkAccessToken() {
        let token = (JSON.parse(Cookies.get('token')));
        let myId = await axios.post('http://localhost:5000/student/checkAccessToken', { accessToken: token.accessToken })
            .then(res => {
                if (res.data.message === "auth succesfull") {//check if the access token that we had is not expire
                    return res.data.id;
                } else {
                    if (res.data.message === "jwt expired") {//-notice : the acceess token expired,but doesn't attacked
                        axios.post('http://localhost:5000/student/token', { refreshToken: token.refreshToken })
                            .then(res => {
                                if (res.data.accessToken !== "") {//if success generate a new access token
                                    token.accessToken = res.data.accessToken//update the old access token to new one
                                    Cookies.set('token', JSON.stringify(token));
                                    window.location = '/student';
                                } else {
                                    deleteCookieAndGoLogin();
                                }
                            })
                            .catch(err => { console.log(`error with fetch ${err}`) })
                    } else {//res.data.message will be malformed , been attacked
                        deleteCookieAndGoLogin();
                    }
                }
            })
            .catch(err => { console.log(`error with fetch ${err}`) });
        getMyInformation(myId);
        return myId;
    }
    function getMyInformation(myId) {
        axios.get(`http://localhost:5000/student/getStudentInfo`, { params: { id: myId } })
            .then(studentlist => {
                SetaAboutMe(studentlist.data.student);
            })
            .catch((err) => `error With get studens ${err}`);
    }
    function deleteCookieAndGoLogin() {
        Cookies.remove('token');
        Cookies.remove('rememberMe')
        window.location = '/';
    }
    function initToken() {
        let token = (Cookies.get('token')) ? JSON.parse(Cookies.get('token')) : { message: "" };
        if (token.message === "") {
            token = (Cookies.get('rememberMe')) ? JSON.parse(Cookies.get('rememberMe')) : token;
        }
        Cookies.set('token', JSON.stringify(token));
    }
    let attendances = dataStudent.map((curr) => {
        return <AttendanceComp current={curr} />
    });
    function dqs(ele) {
        return document.querySelector(`#${ele}`)
    }
    function checkIfIwas(arr) {
        let num = 0
        let x = arr.map((curr) => {
            if (curr.was) {
                num++
            }
        });
        setWas(num);
    }
    return (
        <div className='studentDetails'>
            <div className="student-Table">
                <div className="stuHeader">Hello {aboutMe.firstname}</div>
                {/* <table cellspacing="0"> */}
                <div className="imgStudentInfo">
                    <img src={`/studentImages/${aboutMe.pic}`} alt="" ></img>
                    <div className="myName">
                        <div>First Name: {aboutMe.firstname}</div>
                        <div>Last Name: {aboutMe.lastname}</div>
                        <div>Id: {aboutMe.id}</div>
                        <div>E-mail: {aboutMe.email}</div>
                        <div>Percentage Attendances: <labe style={{"background-color":Math.floor(was/dataStudent.length*100)>80?"green":"red","color":"white"}}> {Math.floor(was/dataStudent.length*100)||0}%</labe></div>
                    </div>
                </div>
                <br />
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

export default StudentAtt
