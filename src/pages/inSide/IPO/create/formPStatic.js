import {useEffect, useState, useRef} from "react";
import db from "../../../../config/firebase-config"
import {collection, deleteDoc, doc, getDoc, onSnapshot} from "firebase/firestore"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'


const AddTable = (props) => {

    const [formData, setFormData] = useState([])
    const myTable = useRef(null);


    useEffect(() => {
        onSnapshot(collection(db, "PO", props.roomCode, "Quotation", props.currentCode, "work"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
    }, [props.reOpen])

    var total = 0;
        for(var i in formData){
            total += (parseFloat(formData[i].labor || 0) + parseFloat(formData[i].material || 0))*parseFloat(formData[i].quantity || 0)
        }
        props.func(total)

    const onDelete = async (e) => {
        const docRef1 = doc(db, "PO", props.roomCode, "Quotation", props.currentCode, "work", e.target.id);
        await deleteDoc(docRef1);
    };

    return (
        formData.filter( data => {
            return ((data.dummy != "dummy"))
            }).map((data,i) => (
            <tr>
                <td className="text-center">{(i+1).toString().padStart(2, "0")}</td>
                <td className="px-2 py-2" ref={myTable}>{data.description}</td>
                <td className="text-center">{data.quantity}</td>
                <td className="text-center">{data.unit}</td>
                <td className="ta-c px-2 py-2">{parseFloat(data.labor).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                <td className="ta-c px-2 py-2">{parseFloat(data.material).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                <td className="ta-c px-2 py-2">{(parseFloat(data.labor) + parseFloat(data.material)).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                <td className="ta-c px-2 py-2">{((parseFloat(data.labor) + parseFloat(data.material))*parseFloat(data.quantity)).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                <td className="text-center dlt-icon z-indie" onClick={onDelete} id={data.description}>x</td>
            </tr>
            
        ))
    )
}

export default AddTable