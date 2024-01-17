import {useEffect, useState} from "react";
import db from "../../../config/firebase-config"
import {collection, doc, getDoc, onSnapshot} from "firebase/firestore"
import {useNavigate} from "react-router-dom";


const AddTable = (props) => {

    const [formData, setFormData] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        onSnapshot(collection(db, "accounting", "IncomeExpenseO", "record"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
    }, [])

    const handleJoinPublic = async (id) => {
        sessionStorage.setItem('projectIDAC', id)
        const docRef1 = doc(db, "PO", id);
        const docSnap = await getDoc(docRef1);
        if (docSnap.exists()) {
            navigate("/balanceProjIns")
        }
    }

    return (
        formData.filter( result => {
            return ((result.name.toLowerCase() == (props.name) || props.name == "")
                    && result.form.includes(props.form)
                    && result.cus.toLowerCase().includes(props.customer.toLowerCase())
                    && result.day.includes(props.day)
                    && result.month.includes(props.month) 
                    && result.year.includes(props.year))
        }).sort((a, b) => Date.parse(a.month+"/"+a.day+"/"+a.year) - Date.parse(b.month+"/"+b.day+"/"+b.year)).map((data, i) => (
            <tbody>
                <tr onClick={() => handleJoinPublic(data.form)} style={{cursor: "pointer"}}
                >
                    <td className="px-3">{data.form}</td>
                    <td className="px-3">{data.name}</td>
                    <td className="px-3">{data.cus || ""}</td>
                    <td className="px-3">{data.day+"/"+data.month+"/"+data.year}</td>   
                </tr>
            </tbody>

        ))
    )
}

export default AddTable