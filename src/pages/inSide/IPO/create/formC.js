import {useEffect, useState} from "react";
import db from "../../../../config/firebase-config"
import {collection, doc, getDoc, onSnapshot} from "firebase/firestore"
import {useNavigate} from "react-router-dom";
import CustomerWrapper from "./CustomerWrapper";


const AddTable = (props) => {

    const [formData, setFormData] = useState([])

    useEffect(() => {
        onSnapshot(collection(db, "PO", props.roomCode, "Quotation", props.roomCode, "work"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
        var total = 0;
        for(var i in formData){
            total += (parseFloat(formData[i].labor) + parseFloat(formData[i].material))*parseFloat(formData[i].quantity)
        }
        props.func(total)
    }, [props.reOpen])

    return (
        formData.map((data, i) => (
            <tbody>
            <tr>
                <td className="text-center">{(i+1).toString().padStart(2, "0")}</td>
                <td className="px-2 py-2">{data.description}</td>
                <td className="text-center">{data.quantity}</td>
                <td className="text-center">{data.unit}</td>
                <td className="ta-c px-2 py-2">{parseFloat(data.labor).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                <td className="ta-c px-2 py-2">{parseFloat(data.material).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                <td className="ta-r px-2 py-2">{(parseFloat(data.labor) + parseFloat(data.material)).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                <td className="ta-r px-2 py-2">{((parseFloat(data.labor) + parseFloat(data.material))*parseFloat(data.quantity)).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
            </tr>
            </tbody>
        ))
    )
}

export default AddTable