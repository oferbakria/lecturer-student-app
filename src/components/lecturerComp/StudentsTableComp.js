import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentComponent from './StudentComponent'//for each student in students list
import StudentDetails from './StudentDetails/StudentDetails';// to show current student details after click on
import './StudentTableComp.css';
import Cookies from 'js-cookie';


function StudentsTableComp() {
    const [url, setUrl] = useState(`http://localhost:5000/student/getAllStudents`);
    const [dataStudents, setDataStudents] = useState([]);// to save the student in local varibale
    const [data, setData] = useState([]);// save the main version of student this will help me to work with search
    const [showDetails, setShowDetails] = useState(false);// to show student list / student details
    const [currId, setCurrId] = useState("");// to show student ID(PK in DB)that the lecturer clicked
    const [currIndex, setCurrIndex] = useState(-1);//to show student Index(in local array) that the lecturer clicked
    const [refreshTable, setRefreshTable] = useState(-1);//to refresh student list after delete someone , i've used it in useEffect
    let liName = ["li1", "li2", "li3", "li4", "li5"];//for change background color og current component in navbar
    function dqs(ele) {
        return document.querySelector(`#${ele}`);
    }
    function changeNavbarBColor() {
        liName.map((curr) => {
            if (curr === "li1") {
                dqs(curr).style.backgroundColor = "#9ad3bc";
            } else {
                dqs(curr).style.backgroundColor = "#327A81"
            }
        });
    }
    useEffect(() => {//handle the token
        initToken();
        let token = JSON.parse(Cookies.get('token'));
        changeNavbarBColor();

        if (token.message === "auth succesfull") {
            checkAccessToken();
            axios.post(url)
                .then(studentsObj => {
                    setDataStudents(studentsObj.data.info);
                    setData(studentsObj.data.info);
                })
                .catch((err) => `error With get studens ${err}`);
        } else {
            deleteCookieAndGoLogin();
        }
    }, [refreshTable]);
    function initToken() {
        let token = (Cookies.get('token')) ? JSON.parse(Cookies.get('token')) : { message: "" };
        if (token.message === "") {
            token = (Cookies.get('rememberMe')) ? JSON.parse(Cookies.get('rememberMe')) : token;
        }
        Cookies.set('token', JSON.stringify(token));
    }
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
    let students = dataStudents.map((curr, indx) => {
        return <StudentComponent current={curr} showMe={() => setShowDetails(true)}
            myId={(x) => setCurrId(x)}
            myIndex={(num) => setCurrIndex(num)}
            index={indx}
            refrehStuTable={(num) => setRefreshTable(num)} />
    });
    function sortTheStudents(subName) {
        let arr = data.filter((curr) => {
            if (curr.firstname.includes(subName)) {
                return curr;
            }
        })
        setDataStudents(arr);
    }
    if (!showDetails)
        return (
            <div className="table-lecturer">
                <div className="headerPlusSearch">
                    <div class="header">Students List</div>
                    <input type="text" id="myInput" placeholder="Search For Names.." onKeyUp={(event) => sortTheStudents(event.target.value)} />
                </div>
                <table cellspacing="0">
                    <tr><th>Student Image</th><th>Full Name</th><th>Gender</th><th>Email</th><th>Student ID</th><th>Option</th></tr>
                    {students}
                </table>
            </div>
        )
    else {
        return (
            <div>
                <StudentDetails current={dataStudents[currIndex]}
                    setSearch={(str,myScreenPosition) => {
                        dqs('myInput').value = str;
                        dqs('myInput').focus();
                        document.documentElement.scrollTop+=myScreenPosition;
                    }}
                    subNameToSort={dqs('myInput').value}    
                    showStudents={() => setShowDetails(false)}
                    myScreenPosition={document.documentElement.scrollTop} />
                    {/* myScreenPosition - it's for save screen postion , to return to the same postion on the table */}
            </div>
        )
    }
}

export default StudentsTableComp;
