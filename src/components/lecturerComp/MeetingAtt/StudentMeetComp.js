import React,{useState} from 'react';
import axios from 'axios';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

function StudentMeetComp(props) {
    const [objId,setObjId]=useState("");
    function getdatte(){
        let date = new Date();
        date.setHours(20,1,1,100);//AWS/n.virgina GMT-5/IN ISRAEL GMT +2//delay with my timezone 
        // console.log(`${date}`);
        // return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()+1}`
        return date;
    }
    function hideX(){
        let url=`http://localhost:5000/info/add`;
        document.querySelector(`#a${props.indx}`).style.visibility= "visible";
        document.querySelector(`#b${props.indx}`).style.visibility= "hidden";
        axios.post(url,{id:props.current._id,date:getdatte(),was:true})
        .then(res=>{
            console.log(res.data.message);
            if(res.data.message==="Information added"){
                setObjId(res.data._id);//_id => the id(PK) of the object that added to the info DB
            }
            document.querySelector(`#reset${props.indx}`).style.visibility= "visible";
        })
        .catch(err=>{console.log(err)});
    }
    function HideV(){
        let url=`http://localhost:5000/info/add`;
        document.querySelector(`#b${props.indx}`).style.visibility= "visible";
        document.querySelector(`#a${props.indx}`).style.visibility= "hidden";
        axios.post(url,{id:props.current._id,date:getdatte(),was:false})
        .then(res=>{
            console.log(res.data.message);
            if(res.data.message==="Information added"){
                setObjId(res.data._id);//_id => the id(PK) of the object that added to the info DB
            }
        document.querySelector(`#reset${props.indx}`).style.visibility= "visible";
        })
        .catch(err=>{console.log(err)});
    }
    function reset(){
        let url=`http://localhost:5000/info/`;
        document.querySelector(`#b${props.indx}`).style.visibility= "visible";
        document.querySelector(`#a${props.indx}`).style.visibility= "visible";
        axios.delete(url,{params:{id:objId}})
        .then((res)=>{
            console.log(res.data.message);
            document.querySelector(`#reset${props.indx}`).style.visibility= "hidden";
        })
        .catch(err=>{console.log(err)});
    }
    return (
        <tr>
            <td>{props.current.id}</td>
            <td>{props.current.firstname} {props.current.lastname}</td>
            <td><div className="ddd">
                <CheckCircleOutlineIcon id={`a${props.indx}`} onClick={()=>hideX()} />
                <HighlightOffIcon id={`b${props.indx}`} className="x" onClick={()=>HideV()}/>
                <label id={`reset${props.indx}`} style={{"visibility":"hidden"}} onClick={()=>reset()}>Reset</label>
            </div></td>
        </tr>
    )
}

export default StudentMeetComp
