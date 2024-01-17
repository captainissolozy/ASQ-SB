import {useEffect, useState} from "react";
import db from "../../../config/firebase-config"
import {collection, doc, getDoc, onSnapshot} from "firebase/firestore"
import {useNavigate} from "react-router-dom";


const AddTable = (props) => {

    const [formData, setFormData] = useState([])
    let amount = 0

    useEffect(() => {
        onSnapshot(collection(db, "accounting", "incomeExpense", "record"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
    }, [])

    const sumofAmount = (data, mode) => {
        if(mode == "Expense"){
            amount -= data
            props.total(amount)
        }else{
            amount += data
            props.total(amount)
        }
        
    }

    return (
        formData.filter( result => {
            return ((result.name.toLowerCase() == (props.name) || props.name == "")
                    && result.form.includes(props.form)
                    && result.mode.includes(props.mode) 
                    && result.day.includes(props.day)
                    && result.month.includes(props.month) 
                    && result.year.includes(props.year))
        }).sort((a, b) => Date.parse(a.month+"/"+a.day+"/"+a.year) - Date.parse(b.month+"/"+b.day+"/"+b.year)).map((data, i) => (
            <tbody>
                {sumofAmount(parseFloat(data.amount), data.mode)}
            <tr style={{cursor: "pointer"}} onClick={() => {
                sessionStorage.setItem("balanceID", data.name+data.amount)
                props.truth(true);}}
                >
                <td className="px-3">{data.mode}</td>
                <td className="px-3">{data.name}</td>
                <td className="px-3">{data.form}</td>
                <td className="px-3">{data.day+"/"+data.month+"/"+data.year}</td>
                {data.mode == "Expense" ? (
                                <td className="px-3 overflow-hidden text-end">{parseFloat(data.amount*-1).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                            ) : (
                                <td className="px-3 overflow-hidden text-end">{parseFloat(data.amount).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                            )}
                
            </tr>
            </tbody>

        ))
    )
}

export default AddTable