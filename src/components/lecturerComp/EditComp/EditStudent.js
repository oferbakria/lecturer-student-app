import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import './EditStudent.css';
import { useParams } from "react-router-dom";
import Cookies from 'js-cookie';


function EditStudent() {   
    let IdFromPathParams=useParams();
    const [email, setEmail] = useState("");//for warning
    const [fname, setFName] = useState("");//for warning
    const [lname, setLName] = useState("");//for warning
    const [id, setID] = useState("");//for warning
    const [gender, setGender] = useState("male");//for warning

useEffect(() => {//handle the token
    let token = (!Cookies.get('token')) ? { message: "" } : JSON.parse(Cookies.get('token'));
    if (token.message === "auth succesfull") {
        checkAccessToken();
        axios.get('http://localhost:5000/student/getStudentInfo', { params: { id: IdFromPathParams.id}})
        .then(res => {
            dqs('fname').value = res.data.student.firstname;
            dqs('lname').value = res.data.student.lastname;
            dqs('email').value = res.data.student.email;
            dqs('idd').value = res.data.student.id;
            dqs(`${res.data.student.gender}`).checked = "true";
            dqs('imgId').src = `/studentImages/${res.data.student.pic}`;
        })
        .catch(err => console.log(err));
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
    window.location = '/';
}

    function dqs(ele) {
        return document.querySelector(`#${ele}`);
    }
    function checkFName() {
        hidewarnings();
        if (dqs('fname').value.length < 3 || dqs('fname').value.length > 20) {
            setFName("-firstName-min:3/max:20");
        }
        else
            setFName("");
    }
    function checkLName() {
        hidewarnings();
        if (dqs('lname').value.length < 3 || dqs('lname').value.length > 20) {
            setLName("-last name min:3/max:20");
        }
        else
            setLName("");
    }
    function emailIsValid(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }
    function checkEmail() {
        hidewarnings();
        if (!(emailIsValid(dqs('email').value))) {
            setEmail("Invalid Email Address");
        }
        else
            setEmail("");
    }
    function checkID() {
        hidewarnings();
        if (dqs('idd').value.length < 1) {
            setID("-ID min:1");
        }
        else
            setID("");
    }
    function checkInfo() {
        if (fname === "" && lname === "" && email === "" && id === "" && gender !== "" && dqs(`fname`).value !== "" && dqs(`lname`).value !== "" &&
            dqs(`email`).value !== "" && dqs(`idd`).value !== "") {
                let student={
                    _id:IdFromPathParams.id,
                    firstname:dqs(`fname`).value,
                    lastname:dqs(`lname`).value,
                    email:dqs(`email`).value,
                    id:dqs(`idd`).value,
                    gender:gender
                }

            axios.post("http://localhost:5000/student/updateFromLecturer", student)
                .then(res => {
                    document.querySelector('.warnings').style.display = "block";
                    document.querySelector('.warnings').innerHTML = "<label style='color:green;'><strong>Result:</strong></label><br>" + res.data.message;
                 })
                .catch(err => { console.log('error with fetch') });
        } else {
            displayErrorAfterSubmit();
        }

    }
    function displayErrorAfterSubmit() {
        let msg = "required inputs";
        document.querySelector('.warnings').innerHTML = "<label style='color:red;'><strong>Error:</strong></label><br>" + msg;
        document.querySelector('.warnings').style.display = "block";
    }
    function hidewarnings() {
        document.querySelector('.warnings').style.display = "none";
    }
    return (
        <div class="edit-box">
            <h1>Edit Student</h1>
            <div>
                <img id="imgId" src="" alt="" />
            </div> 
            <div className="textbox">
                <i className="fa fa-envelope"></i>
                <input id="email" type="email" placeholder="Email"  onChange={checkEmail} />
            </div>
            <div className="textbox">
                <i className="fas fa-user"></i>
                <input id="fname" type="text" placeholder="First Name" onChange={checkFName} />
            </div>

            <div className="textbox">
                <i className="fas fa-user"></i>
                <input id="lname" type="text" placeholder="Last Name" onChange={checkLName} />
            </div>
            <div className="textbox">
                <i className="fas fa-user"></i>
                <input id="idd" type="text" placeholder="ID" onChange={checkID} />
            </div>
            <div className="labels">
                <label class="container" onClick={() => setGender("male")}>Male
			<input type="radio" id="male" name="radio" />
                    <span className="checkmark"></span>
                </label>
                <label class="container" onClick={() => setGender("female")}>Female
			<input type="radio" id="female" name="radio" />
                    <span className="checkmark"></span>
                </label>
            </div>
            <div>
                <a><input type="button" className="btn" value="Update" onClick={() => checkInfo()} /></a>
            </div>
            <div className="warnings"></div>
            <div>{email}</div>
            <div>{fname}</div>
            <div>{lname}</div>
            <div>{id}</div>

        </div>
    );
}

export default EditStudent
