import {useEffect, useState} from "react";
import db from "../../../../config/firebase-config"
import {collection, doc, getDoc, onSnapshot, deleteDoc} from "firebase/firestore"
import {useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'


const AddTable = (props) => {

    const [formData, setFormData] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        onSnapshot(collection(db, "PO", props.roomCode, "expense"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
    }, [navigate])

    const onDelete = async (e) => {
        const docRef1 = doc(db, "PO", props.roomCode, "expense", e.target.id);
        await deleteDoc(docRef1);
        const docRef2 = doc(db, "accounting", "IncomeExpenseO", "record", e.target.id);
        await deleteDoc(docRef2);
    };

    return (
        formData.map((data) => (
            <tbody>
            <tr>
                <td>{data.exPenseDoc.name}</td>
                <td className="text-center">{data.exPenseDoc.bank || ""}</td>
                <td className="text-center">{data.exPenseDoc.supplier}</td>
                <td className="text-center">{data.exPenseDoc.amount}</td>
                <td className="text-center">{data.exPenseDoc.day+"/"+data.exPenseDoc.month+"/"+data.exPenseDoc.year}</td>
                <td key={data.url} className="text-center"><a href={data.url} target="_blank">{data.url != ""?data.exPenseDoc.name : ""}</a></td>
                <td className="text-center dlt-icon z-indie" onClick={onDelete} id={data.exPenseDoc.name+data.exPenseDoc.form}><FontAwesomeIcon id={data.exPenseDoc.name+data.exPenseDoc.form} icon={faTrashCan}/></td>
            </tr>
            </tbody>

        ))


    )
}

export default AddTable