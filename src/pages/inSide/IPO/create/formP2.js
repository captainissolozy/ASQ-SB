import {useEffect, useState} from "react";
import db from "../../../../config/firebase-config"
import {collection, doc, getDoc, onSnapshot} from "firebase/firestore"
import {useNavigate} from "react-router-dom";


const AddTable = (props) => {

    const [formData, setFormData] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        onSnapshot(collection(db, "PO", props.roomCode, "media"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
    }, [navigate])

    return (
        formData.map((data) => (
            <tbody>
            <tr>
                <td>{data.docName.name}</td>
                <td key={data.url} className="text-center"><a href={data.url} target="_blank">{data.docName.name}.png</a></td>
            </tr>
            </tbody>

        ))


    )
}

export default AddTable