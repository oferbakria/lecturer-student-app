import React from 'react'
import { Link } from 'react-router-dom';
import './StudentNavbar.css';
import Cookies from 'js-cookie';


function Navbar() {
    function logout(){
        Cookies.remove('token');
        Cookies.remove('rememberMe')
        window.location = '/';
    }

    const toggleNav = () => {document.querySelector('#student-navlinks').classList.toggle('showNavbar')};
    return (
        <div className="student-nvbar">
            <span onClick={toggleNav} class="toggleNavbar" id="toggleNavbar" to={window.location}>☰</span>
            <ul id="student-navlinks">
                <li id="li1" className="navLinksLi"><Link to="/student/list">My Attendaces</Link></li>
                <li id="li2" className="navLinksLi"><Link to="/student/sendMail">Send Mail</Link></li>
                <li id="li3" className="navLinksLi"><Link to="/student/editMe">Edit</Link></li>
                <li className="navLinksLi" onClick={()=>{logout()}}><Link>Logout</Link></li>
            </ul>
        </div>
    )
}

export default Navbar
