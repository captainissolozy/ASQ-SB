import {useEffect, useState} from "react";
import db from "../../../config/firebase-config"
import {collection, doc, getDoc, onSnapshot} from "firebase/firestore"
import {useNavigate} from "react-router-dom";


const AddTable = (props) => {

    const [formData, setFormData] = useState([])

    useEffect(() => {
        onSnapshot(collection(db, "accounting", "taxes", "record"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
    }, [])

    return (
        formData.filter( result => {
            return ( result.bank.includes(props.bank || "")
                    && result.mode.includes(props.mode) 
                    && result.day.includes(props.day)
                    && result.month.includes(props.month) 
                    && result.year.includes(props.year))
        }).sort((a, b) => Date.parse(a.month+"/"+a.day+"/"+a.year) - Date.parse(b.month+"/"+b.day+"/"+b.year)).map((data, i) => (
            <tbody>
            <tr style={{cursor: "pointer"}} onClick={() => {
                sessionStorage.setItem("taxesID", data.mode+data.bank+data.amount+data.day+data.month)
                props.truth(true);}}
            >
                <td className="px-3">{data.mode}</td>
                <td className="px-3">{data.bank}</td>
                <td className="px-3">{data.day+"/"+data.month+"/"+data.year}</td>
                <td className="px-3 overflow-hidden text-end">{parseFloat(data.amount).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
            </tr>
            </tbody>

        ))
    )
}

export default AddTable