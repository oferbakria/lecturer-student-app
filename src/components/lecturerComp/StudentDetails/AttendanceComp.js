import React from 'react'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios'

function AttendanceComp(props) {
    async function reset(status) {
        if (status) {//if status trueee
            let url = `http://localhost:5000/info/`;
            await axios.delete(url, { params: { id: props.current._id } })
                .then((res) => {
                    console.log(res.data.message);
                })
                .catch(err => { console.log(err) });
            let num = Math.random() * 999999999;
            props.refreshAttendaces(props.index + num);
        }else{//if status flase
            document.querySelector(`.arrYouSure${props.index}`).style.display = "none";
            document.querySelector(`.div2${props.index}`).style.display = "grid";
        }
    }
    function deleteClicked() {
        document.querySelector(`.arrYouSure${props.index}`).style.display = "grid";
        document.querySelector(`.div2${props.index}`).style.display = "none";
    }
    function editClicked() {
        document.querySelector(`.div1${props.index}`).style.display = "grid";
        document.querySelector(`.div2${props.index}`).style.display = "none";
    }
    async function editWith(status) {
        let url = `http://localhost:5000/info/update`;
        await axios.post(url, { was: status, idd: props.current._id })
            .then(res => { console.log(res.data.message) })
            .catch(err => { console.log(err.data.message) })
        let num = Math.random() * 999999999;
        props.refreshAttendaces(props.index + num);
        document.querySelector(`.div1${props.index}`).style.display = "none";
        document.querySelector(`.div2${props.index}`).style.display = "grid";
    }
    return (
        <tr>
            <td>{props.current.date.substring(0, 10)}</td>
            <td className="edit-attendance-row">{props.current.was ? <CheckCircleOutlineIcon /> : <HighlightOffIcon className="x" />}
                <div className={`att1 div1${props.index}`} >
                    <CheckCircleOutlineIcon onClick={() => editWith(true)} />
                    <HighlightOffIcon className="x" onClick={() => editWith(false)} />
                </div>
                <div className={`att2 div2${props.index}`}>
                    <EditIcon className="primary" onClick={() => editClicked()} color="primary" />
                    <DeleteIcon className="primary" onClick={() => deleteClicked()} />
                </div>
                <div className={`att3 arrYouSure${props.index}`}>
                    <CheckCircleOutlineIcon onClick={() => reset(true)} />
                    <HighlightOffIcon className="x" onClick={() => reset(false)} />
                </div>
            </td>
        </tr>
    )
}

export default AttendanceComp
