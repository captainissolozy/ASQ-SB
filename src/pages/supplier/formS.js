import {useEffect, useState} from "react";
import db from "../../config/firebase-config"
import {collection, doc, getDoc, onSnapshot} from "firebase/firestore"
import {useNavigate} from "react-router-dom";


const AddTable = (s_name) => {

    const [formData, setFormData] = useState([])
    const navigate = useNavigate()


    useEffect(() => {
        onSnapshot(collection(db, "SuppliersDetail"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
    }, [])

    const handleJoinPublic = async (id) => {
        sessionStorage.setItem('roomKeySup', id)
        const docRef1 = doc(db, "SuppliersDetail", id);
        const docSnap = await getDoc(docRef1);
        if (docSnap.exists()) {
            navigate('/ins')
        }
    }

    return (
        formData.filter( result => {
            return (result.v_box1.toLowerCase().includes(s_name.s_name)
                && (result.v_box6.toLowerCase() == (s_name.s_status) || s_name.s_status == "")
                && result.v_box4.toLowerCase().includes(s_name.s_nickname)
                && result.v_box5.includes(s_name.s_tel))
        }).map((data) => (
            <tbody>
            <tr onClick={() => handleJoinPublic(data.v_box1 + data.v_box2)} style={{cursor: "pointer"}}>
                <td className="px-3 py-2">{data.v_box1}</td>
                <td className="px-3 py-2">{data.v_box4}</td>
                <td className="px-3 py-2">{data.v_box5}</td>
                <td className="px-3 py-2">{data.v_box6}</td>

            </tr>
            </tbody>

        ))


    )
}

export default AddTable