import {useEffect, useState} from "react";
import db from "../../../../config/firebase-config"
import {collection, doc, getDoc, onSnapshot} from "firebase/firestore"
import {useNavigate} from "react-router-dom";


const AddTable = (props) => {

    const [formData, setFormData] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        onSnapshot(collection(db, "PO", props.roomCode, "expense"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
    }, [navigate])

    return (
        formData.map((data) => (
            <tbody>
            <tr>
                <td>{data.exPenseDoc.name}</td>
                <td className="text-center">{data.exPenseDoc.supplier}</td>
                <td className="text-center">{data.exPenseDoc.amount}</td>
                <td className="text-center">{data.exPenseDoc.day+"/"+data.exPenseDoc.month+"/"+data.exPenseDoc.year}</td>
                <td key={data.url} className="text-center"><a href={data.url} target="_blank">{data.url != ""?data.exPenseDoc.name : ""}</a></td>
            </tr>
            </tbody>

        ))


    )
}

export default AddTable