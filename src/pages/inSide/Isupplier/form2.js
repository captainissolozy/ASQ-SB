import {useEffect, useState} from "react";
import db from "../../../config/firebase-config"
import {collection, onSnapshot, doc, deleteDoc} from "firebase/firestore"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'

const AddTable = (props) => {

    const [formData, setFormData] = useState([])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        onSnapshot(collection(db, "SuppliersDetail", props.docname, "aid"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
    }, [props.docname])

    if(formData.length > 0){
        props.func("aid1")
    }else{
        props.func("aid0")
    }

    const onDelete = async (e) => {
        console.log(e.target.id)
        const docRef1 = doc(db, "SuppliersDetail", props.docname, "aid", e.target.id);
        await deleteDoc(docRef1);
    };

    return (
        formData.map((data, i) => (
            <tbody>
            <tr style={{cursor: "pointer"}}>
                <td key={data.docName.name}>{i+1}</td>
                <td>{data.docName.name}</td>
                <td key={data.url}><a href={data.url} target="_blank">download</a></td>
                <td className="text-center dlt-icon z-indie" onClick={onDelete} id={data.docName.name}>x</td>
            </tr>
            </tbody>

        ))


    )
}

export default AddTable