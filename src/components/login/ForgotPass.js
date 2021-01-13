import React,{useState} from 'react'
import './ForgotPass.css';
import axios from 'axios';
//using smtp api (smtp j.s)
function ForgotPass() {
    const[status,setStatus]=useState("");
    const[url,setUrl]=useState("http://localhost:5000/reset/add");

    function connectToServer(){
        if(dqs("forgot-email").value!==""&&status===""){
            axios.post(url,{email:dqs('forgot-email').value})
            .then(res=>{setStatus(res.data.message)})
            .catch(err=>{console.log(err)});
        }else if (dqs('forgot-email').value===""){
            dqs('required').style.display="inline-grid";
        }
    }
    function dqs(ele) {
        return document.querySelector(`#${ele}`);
    }
    function emailIsValid(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }
    function checkEmail() {
        dqs('required').style.display="none";
        if (!(emailIsValid(dqs('forgot-email').value))) {
            setStatus("Invalid Email Address");
        }
        else {
            setStatus("");
        }
    }
    return (
        <div className='reset-div'>
            <div className="main-div-reset">
                <h3>Reset Your Password</h3>
                <hr/>
                <div class="field">
                    <label for="forgot-email">Write your Email:<label id="required">*Required</label></label>
                    <input type="text" id="forgot-email" name="forgot-email" placeholder="your@email.com" onChange={()=>{checkEmail()}} />
                </div>
                <div class="field">
                    <input id="forgot-email-btn" type="submit" value="Send Mail" onClick={()=>connectToServer()} />
                     <div>{status}</div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPass
