import React from 'react'
import { Link } from 'react-router-dom';
import './LecturerNavbar.css';
import Cookies from 'js-cookie';


function Navbar() {
    function logout(){
        Cookies.remove('token');
        Cookies.remove('rememberMe')
        window.location = '/';
    }
    const toggleNav = () => {document.querySelector('#lecturer-navlinks').classList.toggle('showNavbar')};

    return (
        <div className="lecturer-nvbar">
            <span onClick={toggleNav} class="toggleNavbar" id="toggleNavbar" to={window.location}>☰</span>
            <ul id="lecturer-navlinks">
                <li id="li1" className="navLinksLi"><Link to="/lecturer/list"> Student List</Link></li>
                <li id="li2" className="navLinksLi"><Link to="/lecturer/meeting">נוכחות מפגש</Link></li>
                <li id="li3" className="navLinksLi"><Link to="/lecturer/add">Add Student</Link></li>
                <li id="li4" className="navLinksLi"><Link to="/lecturer/editMe">Edit</Link></li>
                <li className="navLinksLi" style={{ "display": "none" }}><Link to="/lecturer/edit/:id">Edit Student</Link></li>
                <li id="li5"  className="navLinksLi" onClick={()=>{logout()}}><Link>Logout</Link></li>
            </ul>
        </div>
    )
}

export default Navbar
