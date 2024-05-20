import {useEffect, useState} from "react";
import db from "../../../../config/firebase-config"
import {collection, doc, getDoc, onSnapshot, deleteDoc, updateDoc} from "firebase/firestore"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'



const AddTable = (props) => {

    const initialFormData = Object.freeze({
        name: "",
        lent: 0,
        description: "",
        payback: 0,
        day: "",
        month: "",
        year: "",
        pday: "::",
        pmonth: "::",
        pyear: "::::",
        status:"pending",
        lleft: 0
    });

    const initialFormData2 = Object.freeze({
        lleft: ""
    });

    const [formData, setFormData] = useState([])
    const [formData2, updateFormData2] = useState(initialFormData2)

    useEffect(() => {
        onSnapshot(collection(db, "accounting", "record", props.roomcode), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
        
    }, [])

    const onDelete = async (e) => {
        var string_split = e.target.id.split("-")
        const docRef2 = doc(db, "accounting", "record", props.roomcode, string_split[0]+string_split[1]);
        await deleteDoc(docRef2);
        const docRef = doc(db, "accounting", "lent", "record", props.roomcode);
        const docsnap = await getDoc(docRef);
        var formData3 = {lleft: ""}
        if(docsnap.exists){
            formData3.lleft = docsnap.data().lleft + parseFloat(string_split[0]);
        }
        await updateDoc(docRef, formData3)
    };

    return (
        formData.sort((b, a) => Date.parse(a.month+"/"+a.day+"/"+a.year) - Date.parse(b.month+"/"+b.day+"/"+b.year)).map((data, i) => (
            <tbody>
            <tr>
                <td className="px-3">{parseFloat(data.payback).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                <td className="px-3">{data.pday+"/"+data.pmonth+"/"+data.pyear}</td>
                <td key={data.url} className="text-center"><a href={data.url} target="_blank">{data.url != ""?"File":""}</a></td>
                <td style={{cursor: "pointer"}} className="text-center dlt-icon z-indie" onClick={onDelete} id={data.payback +"-"+ data.pday} ><FontAwesomeIcon id={data.payback + "-" + data.pday} icon={faTrashCan}/></td>
            </tr>
            </tbody>

        ))
    )
}

export default AddTable