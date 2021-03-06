import React, { useState, useEffect } from 'react';
import axios from 'axios'
import './StudentEdit.css';
import SettingsIcon from '@material-ui/icons/Settings';
import Cookies from 'js-cookie';

//multer is a middleware that you use
//  if you wantto handle multipart from data such(files) 

function StudentEdit() {
    const [file, setFile] = useState();
    const [PKID, setPKID] = useState("");

    const [email, setEmail] = useState("");//for warning
    const [pass, setPass] = useState("");//for warning
    const [fname, setFName] = useState("");//for warning
    const [lname, setLName] = useState("");//for warning
    const [id, setID] = useState("");//for warning
    const [gender, setGender] = useState("");//for warning
    let liName=["li1","li2","li3"];//for change background color og current component in navbar
    function changeNavbarBColor(){
        liName.map((curr) => {
            if(curr==="li3"){
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
        } else {
            deleteCookieAndGoLogin();
        }
    }, []);

    function checkAccessToken() {
        let token = (JSON.parse(Cookies.get('token')));
        axios.post('http://localhost:5000/student/checkAccessToken', { accessToken: token.accessToken })
            .then(res => {
                if (res.data.message === "auth succesfull") {//check if the access token that we had is not expire
                    getStudentData(res.data.id);
                    setPKID(res.data.id);
                    return;
                } else {
                    if (res.data.message === "jwt expired") {//-notice : the acceess token expired,but doesn't attacked   
                        axios.post('http://localhost:5000/student/token', { refreshToken: token.refreshToken })
                            .then(res => {
                                if (res.data.accessToken !== "") {//if success generate a new access token
                                    token.accessToken = res.data.accessToken//update the old access token to new one
                                    Cookies.set('token', JSON.stringify(token));
                                    window.location = '/student/editMe';
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
    function getStudentData(idParam) {
        console.log(idParam);
        axios.get('http://localhost:5000/student/getStudentInfo', { params: { id: idParam } })
            .then(res => {
                console.log(res.data.student);
                dqs('fname').value = res.data.student.firstname;
                dqs('lname').value = res.data.student.lastname;
                dqs('email').value = res.data.student.email;
                dqs('idd').value = res.data.student.id;
                dqs(`${res.data.student.gender}`).checked = "true"
                setGender(res.data.student.gender);
                console.log(res.data.student.pic);
                dqs('imgId').src = `/studentImages/${res.data.student.pic}`;
            })
            .catch(err => console.log(err));
    }
    function deleteCookieAndGoLogin() {
        Cookies.remove('rememberMe');
        Cookies.remove('token');
        window.location = '/';
    }
    function dqs(ele) {
        return document.querySelector(`#${ele}`);
    }
    function checkOldPass() {
        hidewarnings();
        if (dqs('oldpass').value.length < 7) {
            setPass("invalid Old Password ,min 7 let");
        }
        else
            setPass("");
    }
    function checkPass() {
        hidewarnings();
        if (dqs('pass').value !== dqs('confirmPass').value || (dqs('pass').value.length < 7)) {
            setPass("validate your Password ,min 7 let");
        }
        else
            setPass("");
    }
    function checkConfirmPass() {
        hidewarnings();
        if (dqs('pass').value !== dqs('confirmPass').value) {
            setPass("validate your Password");
        }
        else {
            dqs('pass').value.length < 7 ? setPass("validate your Password ,min 7 let") : setPass("");
        }
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
        if (pass === "" && fname === "" && lname === "" && email === "" && id === "" && gender !== "" && dqs(`pass`).value === dqs(`confirmPass`).value &&
            dqs(`pass`).value !== "" && dqs(`confirmPass`).value !== "" && dqs(`fname`).value !== "" && dqs(`lname`).value !== "" &&
            dqs(`email`).value !== "" && dqs(`idd`).value !== "") {
            const data = new FormData();// to send ,multi-part form data
            data.append("file", file); // "file" :will be the same with the server (upload.single("file"))
            data.append("_id",PKID)
            data.append("email", dqs(`email`).value);
            data.append("oldpass", dqs('oldpass').value);
            data.append("password", dqs(`pass`).value);
            data.append("firstname", dqs(`fname`).value);
            data.append("lastname", dqs(`lname`).value);
            data.append("id", dqs(`idd`).value);
            data.append("gender", gender);

            axios.post("http://localhost:5000/student/update", data)
                .then(res => {
                    if (res.data.message === 'Student updated') {
                        deleteCookieAndGoLogin();
                    }
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
        <div class="student-edit">
            {/* <h1>Edit <SettingsIcon className="edit" color="primary" /></h1> */}
            <div className="imglabel"><img id="imgId" src="/person.png" alt="lecturerImg"/><SettingsIcon className="edit"/></div>
            <div className="textbox">
                <i className="fa fa-envelope"></i>
                <input id="email" type="email" placeholder="Email" onChange={checkEmail} required />
            </div>
            <div className="textbox">
                <i className="fas fa-lock"></i>
                <input id="oldpass" type="password" placeholder="Old Password" onChange={checkOldPass} />
            </div>
            <div className="textbox">
                <i className="fas fa-lock"></i>
                <input id="pass" type="password" placeholder="New Password" onChange={checkPass} required />
            </div>
            <div className="textbox">
                <i className="fas fa-lock"></i>
                <input id="confirmPass" type="password" placeholder="Confirm New Password" onChange={checkConfirmPass} required />
            </div>

            <div className="textbox">
                <i className="fas fa-user"></i>
                <input id="fname" type="text" placeholder="First Name" onChange={checkFName} required />
            </div>

            <div className="textbox">
                <i className="fas fa-user"></i>
                <input id="lname" type="text" placeholder="Last Name" onChange={checkLName} required />
            </div>
            <div className="textbox">
                <i className="fas fa-user"></i>
                <input id="idd" type="text" placeholder="ID" onChange={checkID} required />
            </div>
            <div className="labels">
                <label class="container" onClick={() => setGender("male")} required>Male
			<input type="radio" id="male" name="radio" />
                    <span className="checkmark"></span>
                </label>
                <label class="container" onClick={() => setGender("female")} required>Female
			<input type="radio" id="female" name="radio" />
                    <span className="checkmark"></span>
                </label>
            </div>
            <div>
                <input type="file" name="fileToUpload" accept=".jpg" onChange={event => setFile(event.target.files[0])}></input>
                <a><input type="button" className="btn" value="Save" onClick={() => checkInfo()} /></a>
            </div>
            <div className="warnings"></div>
            <div>{email}</div>
            <div>{pass}</div>
            <div>{fname}</div>
            <div>{lname}</div>
            <div>{id}</div>
        </div>
    );
}

export default StudentEdit
