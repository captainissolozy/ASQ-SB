import {useEffect, useState} from "react";
import db from "../../../config/firebase-config"
import {collection, doc, getDoc, onSnapshot} from "firebase/firestore"


const AddTable = (props) => {

    const initialFormData = Object.freeze({
        name: "",
        mode: "",
        amount: "",
        form: "",
        day: "",
        month: "",
        year: "",
        bank: "",
        supplier:"",
        cus: "",
        url:""
    });

    const [formData, setFormData] = useState([])
    const [formData2, setFormData2] = useState([])
    const [realData, setRealData] = useState([])
    let amount = 0
    

    useEffect(() => {
        onSnapshot(collection(db, "accounting", "incomeExpense", "record"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
        onSnapshot(collection(db, "accounting", "IncomeExpenseO", "record"), (snapshot) => {
            setFormData2(snapshot.docs.map((doc) => doc.data()))
        });
    }, [])

    useEffect(() => {
        var realLength = formData.length + formData2.length - 1
        while(realLength > 0){
            for(var i in formData){
                realData[realLength] = formData[i]
                realLength -= 1
            }
            for(var i in formData2){
                realData[realLength] = formData2[i]
                realLength -= 1
            }
        }
    }, [formData, formData2])

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
        realData.filter( result => {
            return ((result.name.toLowerCase().includes(props.name))
                    && result.form.includes(props.form)
                    && (result.bank || "").includes(props.bank || "")
                    && result.day.includes(props.day)
                    && result.month.includes(props.month) 
                    && result.year.includes(props.year))
            }).sort((a, b) => Date.parse(a.month+"/"+a.day+"/"+a.year) - Date.parse(b.month+"/"+b.day+"/"+b.year))
            .map( data => (
            <tbody>
                {sumofAmount(parseFloat(data.amount), data.mode)}
            <tr>
                <td className="">{data.name}</td>
                <td className="">{data.form}</td>
                <td className="">{data.bank || ""}</td>
                <td className="">{data.day+"/"+data.month+"/"+data.year}</td>
                
                {data.mode == "Expense" ? (
                                <td className="overflow-hidden text-end">{parseFloat(data.amount*-1).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                            ) : (
                                <td className=" overflow-hidden text-end">{parseFloat(data.amount).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                            )}
                <td key={data.url} className="text-center"><a href={data.url} target="_blank">{(data.url == "" || data.url == null)? "" : "file"}</a></td>
            </tr>
            </tbody>

        ))
    )
}

export default AddTable