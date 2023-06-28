import {useEffect, useState} from "react";
import db from "../../../../config/firebase-config"
import {collection, doc, getDoc, onSnapshot} from "firebase/firestore"
import {useNavigate} from "react-router-dom";


const AddTable = (props) => {

    const [formData, setFormData] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        onSnapshot(collection(db, "PO", props.roomCode, "Quotation"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
    }, [])

    const handleJoinPublic = async (id) => {
        console.log(id)
        sessionStorage.setItem('quotationID', id)
        const docRef1 = doc(db, "PO", props.roomCode, "Quotation", id);
        const docSnap = await getDoc(docRef1);
        if (docSnap.exists()) {
            navigate('/staticQuotation2')
        }
    }

    return (
        formData.map((data) => (
            <tbody>
            <tr>
                <td>{data.genQo}</td>
                <td onClick={() => handleJoinPublic(data.genQo)} className="tb-click">{data.genQo}</td>
            </tr>
            </tbody>

        ))


    )
}

export default AddTable