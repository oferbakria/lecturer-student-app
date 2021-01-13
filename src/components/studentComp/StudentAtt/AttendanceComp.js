import React from 'react'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

function AttendanceComp(props) {
    return (
        <tr>
            <td>{props.current.date.substring(0, 10)}</td>
            <td>{props.current.was?<CheckCircleOutlineIcon/>:<HighlightOffIcon className="x"/>}</td>
        </tr>
    )
}

export default AttendanceComp
