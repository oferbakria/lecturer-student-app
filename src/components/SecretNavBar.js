import React from 'react'
import { Link } from 'react-router-dom';

function SecretNavBar() {
    return (
        <div className="secretnvbar">
            <ul>
                 <li><Link to="/login"> login</Link></li>
                 <li><Link to="/login/forgotpass"> forgotPass</Link></li>
                <li><Link to="/lecturer">lecturer</Link></li>
                <li><Link to="/Student">student</Link></li>
            </ul>
        </div>
    );
}

export default SecretNavBar;
