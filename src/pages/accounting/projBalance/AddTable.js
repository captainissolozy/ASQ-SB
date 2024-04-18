import {useEffect, useState} from "react";
import db from "../../../config/firebase-config"
import {collection, doc, getDoc, onSnapshot} from "firebase/firestore"
import {useNavigate} from "react-router-dom";

const AddTable = (props) => {

    const [formData, setFormData] = useState([])
    const [realData, setRealData] = useState([])
    const [count, setCount] = useState(0)
    const navigate = useNavigate()
    const [rerender, setRerender] = useState();

    useEffect(() => {
        onSnapshot(collection(db, "accounting", "IncomeExpenseO", "record"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
    }, [])

    useEffect(() => {
        let newArray = [];
        // Declare an empty object
        let uniqueObject = {};
        let objTitle = "";
        for(let i in formData){
            objTitle = formData[i].form;
            uniqueObject[objTitle] = formData[i];
        }
        for (let i in uniqueObject) {
            newArray.push(uniqueObject[i]);
        }
        setRealData(newArray)
        setRerender(Symbol()); 
    }, [formData])

    const handleJoinPublic = async (id) => {
        sessionStorage.setItem('projectIDAC', id)
        const docRef1 = doc(db, "PO", id);
        const docSnap = await getDoc(docRef1);
        if (docSnap.exists()) {
            navigate("/balanceProjIns")
        }
    }

    return (
        realData.filter( result => {
            return ((result.name.toLowerCase().includes(props.name))
                    && result.form.includes(props.form)
                    && result.cus.toLowerCase().includes(props.customer.toLowerCase())
                    && result.day.includes(props.day)
                    && result.month.includes(props.month) 
                    && result.year.includes(props.year))
        }).sort((b, a) => Date.parse(a.month+"/"+a.day+"/"+a.year) - Date.parse(b.month+"/"+b.day+"/"+b.year)).map((data, i) => (
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