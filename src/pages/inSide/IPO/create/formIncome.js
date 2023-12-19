import {useEffect, useState} from "react";
import db from "../../../../config/firebase-config"
import {collection, doc, getDoc, onSnapshot} from "firebase/firestore"
import {useNavigate} from "react-router-dom";


const AddTable = (props) => {

    const [formData, setFormData] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        onSnapshot(collection(db, "PO", props.roomCode, "income"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
    }, [navigate])

    return (
        formData.map((data) => (
            <tbody>
            <tr>
                <td>{data.inComeDoc.name}</td>
                <td className="text-center">{data.inComeDoc.amount}</td>
                <td className="text-center">{data.inComeDoc.day+"/"+data.inComeDoc.month+"/"+data.inComeDoc.year}</td>
                <td key={data.url} className="text-center"><a href={data.url} target="_blank">{data.inComeDoc.name}.png</a></td>
            </tr>
            </tbody>

        ))


    )
}

export default AddTable