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
        onSnapshot(collection(db, "PO", props.roomCode, "income"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
    }, [navigate])

    const onDelete = async (e) => {
        console.log(e.target.id)
        const docRef1 = doc(db, "PO", props.roomCode, "income", e.target.id);
        await deleteDoc(docRef1);
        const docRef2 = doc(db, "accounting", "IncomeExpenseO", "record", e.target.id);
        await deleteDoc(docRef2);
    };

    return (
        formData.map((data) => (
            <tbody>
            <tr>
                <td>{data.inComeDoc.name}</td>
                <td className="text-center">{data.inComeDoc.bank || ""}</td>
                <td className="text-center">{data.inComeDoc.amount}</td>
                <td className="text-center">{data.inComeDoc.day+"/"+data.inComeDoc.month+"/"+data.inComeDoc.year}</td>
                <td key={data.url} className="text-center"><a href={data.url} target="_blank">{data.url != ""? data.inComeDoc.name : ""}</a></td>
                <td className="text-center dlt-icon z-indie" onClick={onDelete} id={data.inComeDoc.name+data.inComeDoc.form}><FontAwesomeIcon id={data.inComeDoc.name+data.inComeDoc.form} icon={faTrashCan}/></td>
            </tr>
            </tbody>

        ))


    )
}

export default AddTable