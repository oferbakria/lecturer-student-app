import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import './Sendmail.css';
import emailjs from 'emailjs-com';


function SendMail() {
    const[errmsg,setErrmsg]=useState('*Required ');
    const [PKID, setPKID] = useState("");
    let liName=["li1","li2","li3"];//for change background color og current component in navbar
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
                                    Cookies.set('token', JSON.stringify(token))
                                    window.location = '/student/sendMail';
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
        Cookies.remove('rememberMe');
        Cookies.remove('token');
        window.location = '/';
    }
    function getStudentData(idParam) {
        axios.get('http://localhost:5000/student/getStudentInfo', { params: { id: idParam } })
            .then(res => {
                console.log(res.data.student);
                dqs('fullName').value = res.data.student.firstname+" "+res.data.student.lastname;
                dqs('email').value = res.data.student.email;
                dqs('id').value = ` my ID : ${res.data.student.id}`;
            })
            .catch(err => console.log(err));
    }
    function contactUs(e) {
        e.preventDefault();
        if(checkInputsNotEmpty()){
        emailjs.sendForm('myFinalService', 'final_template', e.target, 'user_gBbhwAOlpwN7k2lPAtoSr')//serviceId,templateId,form,userId
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });
        e.target.reset()
        }
    }
    function checkInputsNotEmpty() {
        let send=true;
        if (dqs('fullName').value===""){
            dqsByClassName('fname').style.display="block";
            send=false;
        }
        if (dqs('email').value===""){
            dqsByClassName('email').style.display="block";
            send=false;
        }
        if(dqs('subject').value===""){
            dqsByClassName('subject').style.display="block";
            send=false;
        }
        if(dqs('message').value===""){
            dqsByClassName('message').style.display="block";
            send=false;
        }
        return send;
    }
    function dqs(ele) {
        return document.querySelector(`#${ele}`)
    }
    function dqsByClassName(ele) {
        return document.querySelector(`.${ele}`)
    }
    function onChangeByele(ele){
        dqsByClassName(ele).style.display="none";
    }

    return (
        <div className="myContainer">
            <div className="DivForm">
                <form onSubmit={contactUs} className="myForm">
                    <input id="id" type="textt" name="studentId" style={{"display":"none"}}/>
                    <div>
                        <div className="header">Contact</div>
                        <div className="formInputs" >
                        <label for="fullName">First Name:<label className="warnings fname">{errmsg}</label></label><br />
                            <input id="fullName" type="text" placeholder="Name" name="name" onChange={()=>onChangeByele('fname')}/>
                        </div>
                        <div className="formInputs">
                            <label for="email">Email:<label className="warnings email">{errmsg}</label></label><br />
                            <input id="email" type="email" placeholder="Email Address" name="email" onChange={()=>onChangeByele('email')} />
                        </div>
                        <div className="formInputs">
                            <label for="subject">Subject:<label className="warnings subject">{errmsg}</label></label><br />
                            <input id="subject" type="text" placeholder="Subject" name="subject" onChange={()=>onChangeByele('subject')} />
                        </div>
                        <div className="formInputs">
                            <label for="message">Message:<label className="warnings message">{errmsg}</label></label><br />
                            <textarea id="message" cols="30" rows="8" placeholder="Your message" name="message" onChange={()=>onChangeByele('message')}/>
                        </div>
                        <div className="formInputs">
                            <input type="submit" value="Send Message"></input>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SendMail
