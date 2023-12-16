import {useEffect, useState} from "react";
import db from "../../../config/firebase-config"
import {collection, doc, setDoc, onSnapshot} from "firebase/firestore"


const AddTable = (props) => {

    const [formData, setFormData] = useState([])

    useEffect(() => {
        onSnapshot(collection(db, "accounting", "lent", "record"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
    }, [])

    console.log(props.mode)

    return (
        formData.filter( result => {
            return ((result.name.toLowerCase() == (props.name) || props.name == "")
                    && result.description.includes(props.description)
                    && result.day.includes(props.day)
                    && result.month.includes(props.month) 
                    && result.year.includes(props.year)
                    && (result.status.includes(props.mode) || props.mode == "")
                    )
        }).map((data, i) => (
            <tbody>
            <tr style={{cursor: "pointer"}} onClick={() => {
                sessionStorage.setItem("PayID", data.name+data.description)
                sessionStorage.setItem("PayLent", data.lent)
                props.func(true);
            }}>
                <td className="px-3">{data.name}</td>
                <td className="px-3">{data.description}</td>
                <td className="px-3 text-center">{data.day+"/"+data.month+"/"+data.year}</td>
                <td className="px-3 overflow-hidden text-end">{data.lent}</td>
                <td className="px-3 text-center">{data.pday+"/"+data.pmonth+"/"+data.pyear}</td>
                <td className="px-3 text-end">{data.payback}</td>
                <td className="px-3 text-end">{data.lent - data.payback}</td>
            </tr>
            </tbody>
            
        ))
    )
}

export default AddTable