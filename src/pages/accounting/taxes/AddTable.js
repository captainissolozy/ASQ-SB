import {useEffect, useState} from "react";
import db from "../../../config/firebase-config"
import {collection, doc, getDoc, onSnapshot} from "firebase/firestore"
import {useNavigate} from "react-router-dom";


const AddTable = (props) => {

    const [formData, setFormData] = useState([])

    useEffect(() => {
        onSnapshot(collection(db, "accounting", "incomeExpense", "record"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
    }, [])

    return (
        formData.filter( result => {
            return ((result.name.toLowerCase() == (props.name) || props.name == "")
                    && result.form.includes(props.form)
                    && result.mode.includes(props.mode) 
                    && result.day.includes(props.day)
                    && result.month.includes(props.month) 
                    && result.year.includes(props.year))
        }).map((data, i) => (
            <tbody>
            <tr>
                <td className="px-3">{data.mode}</td>
                <td className="px-3">{data.name}</td>
                <td className="px-3">{data.form}</td>
                <td className="px-3 overflow-hidden">{data.amount}</td>
                <td className="px-3">{data.day+"/"+data.month+"/"+data.year}</td>
            </tr>
            </tbody>

        ))
    )
}

export default AddTable