import {useEffect, useState} from "react";
import db from "../../../config/firebase-config"
import {collection, doc, getDoc, onSnapshot} from "firebase/firestore"
import {useNavigate} from "react-router-dom";


const AddTable = (props) => {

    const [formData, setFormData] = useState([])
    const navigate = useNavigate()


    useEffect(() => {
        onSnapshot(collection(db, "PO"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
    }, [])

    const handleJoinPublic = async (id, cus) => {
        sessionStorage.setItem('projectID', id)
        sessionStorage.setItem('CustomerProj', cus)
        const docRef1 = doc(db, "PO", id);
        const docSnap = await getDoc(docRef1);
        if (docSnap.exists()) {
            navigate("/insideQuotation")
        }
    }
    
    return (
        formData.filter( result => {
            return (((result.status || "") == (props.status) || props.status == "")
                    && result.genQo.includes(props.genQo)
                    && result.sales.toLowerCase().includes(props.sales) 
                    && result.date.toString().includes(props.day)
                    && result.month.toString().includes(props.month) 
                    && result.year.toString().includes(props.year))
        }).sort((b, a) => Date.parse(a.month+"/"+a.date+"/"+a.year) - Date.parse(b.month+"/"+b.date+"/"+b.year)).map((data, i) => (
            <tbody>
            <tr onClick={() => handleJoinPublic(data.genQo, data.v_box1)} style={{cursor: "pointer"}}>
                <td className="px-3">{data.genQo}</td>
                <td className="px-3">{data.v_box1}</td>
                <td className="px-3 overflow-hidden">{data.sales}</td>
                <td className="px-3">{data.status || "Pending"}</td>
            </tr>
            </tbody>

        ))
    )
}

export default AddTable