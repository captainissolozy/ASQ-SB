import {useEffect, useState} from "react";
import db from "../../../config/firebase-config"
import {collection, doc, getDoc, onSnapshot} from "firebase/firestore"
import ComboBox from "./combobox";


const AddTable = (props) => {

    const [formData, setFormData] = useState([])

    useEffect(() => {
        onSnapshot(collection(db, "accounting", "record", "record"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
    }, [])

    return (
        formData.filter( result => {
            return ( result.bank.includes(props.bank)
                    && result.number.includes(props.number) 
                    && result.description.includes(props.description) 
                    && result.day.includes(props.day)
                    && result.month.includes(props.month) 
                    && result.year.includes(props.year))
        }).map((data, i) => (
            <tbody>
            <tr>
                <td className="px-3">{data.bank}</td>
                <td className="px-3">{data.number}</td>
                <td className="px-3">{data.description}</td>
                <td className="px-3 text-end">{data.day+"/"+data.month+"/"+data.year}</td>
                <td className="px-3 overflow-hidden">{data.amount}</td>
            </tr>
            </tbody>

        ))
    )
}

export default AddTable