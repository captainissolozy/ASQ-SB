import {useEffect, useState} from "react";
import db from "../../../config/firebase-config"
import {collection, doc, getDoc, onSnapshot} from "firebase/firestore"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark } from '@fortawesome/free-regular-svg-icons'
import {useNavigate} from "react-router-dom";


const AddTable = (props) => {

    const navigate = useNavigate()
    const [formData, setFormData] = useState([])

    useEffect(() => {
        onSnapshot(collection(db, "accounting", "lent", "record"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
    }, [])

    const onHistory = async (e) => {
        console.log(e.target.id)
        sessionStorage.setItem("CreditId", e.target.id)
        const docRef = doc(db, "accounting", "lent", "record", e.target.id);
        const docsnap = await getDoc(docRef);
        if(docsnap.exists){
            navigate('/creditIn')
        }
    }

    return (
        formData.filter( result => {
            return ((result.name.toLowerCase().includes(props.name.toLowerCase()) || props.name == "")
                    && result.description.includes(props.description)
                    && result.day.includes(props.day)
                    && result.month.includes(props.month) 
                    && result.year.includes(props.year)
                    && (result.status.includes(props.mode) || props.mode == "")
                    )
        }).sort((b, a) => Date.parse(a.month+"/"+a.day+"/"+a.year) - Date.parse(b.month+"/"+b.day+"/"+b.year)).map((data, i) => (
            <tbody>
            <tr style={{cursor: "pointer"}}>
                <td className="px-3" onClick={() => {
                sessionStorage.setItem("PayID", data.name+data.description)
                sessionStorage.setItem("PayLent", data.lleft)
                props.func(true);
            }}>{data.name}</td>
                <td className="px-3" onClick={() => {
                sessionStorage.setItem("PayID", data.name+data.description)
                sessionStorage.setItem("PayLent", data.lleft)
                props.func(true);
            }}>{data.description}</td>
                <td className="px-3 text-center" onClick={() => {
                sessionStorage.setItem("PayID", data.name+data.description)
                sessionStorage.setItem("PayLent", data.lleft)
                props.func(true);
            }}>{data.day+"/"+data.month+"/"+data.year}</td>
                <td className="px-3 overflow-hidden text-end" onClick={() => {
                sessionStorage.setItem("PayID", data.name+data.description)
                sessionStorage.setItem("PayLent", data.lleft)
                props.func(true);
            }}>{parseFloat(data.lent).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                <td className="px-3 text-center" onClick={() => {
                sessionStorage.setItem("PayID", data.name+data.description)
                sessionStorage.setItem("PayLent", data.lleft)
                props.func(true);
            }}>{data.pday+"/"+data.pmonth+"/"+data.pyear}</td>
                <td className="px-3 text-end">{parseFloat(data.lleft).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                <td className="text-center dlt-icon z-indie" onClick={onHistory} id={data.name+data.description}><FontAwesomeIcon id={data.name+data.description} icon={faBookmark}/></td>
            </tr>
            </tbody>
            
        ))
    )
}

export default AddTable