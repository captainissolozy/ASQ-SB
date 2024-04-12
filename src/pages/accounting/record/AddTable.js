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
    const [formData3, setFormData3] = useState([])
    const [formData4, setFormData4] = useState([])
    const [realData, setRealData] = useState([])
    let amount = 0
    

    useEffect(() => {
        onSnapshot(collection(db, "accounting", "incomeExpense", "record"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
        onSnapshot(collection(db, "accounting", "IncomeExpenseO", "record"), (snapshot) => {
            setFormData2(snapshot.docs.map((doc) => doc.data()))
        });
        // onSnapshot(collection(db, "accounting", "lent", "record"), (snapshot) => {
        //     setFormData3(snapshot.docs.map((doc) => doc.data()))
        // });
        onSnapshot(collection(db, "accounting", "taxes", "record"), (snapshot) => {
            setFormData4(snapshot.docs.map((doc) => doc.data()))
        });
    }, [])

    useEffect(() => {
        var realLength = formData.length + formData2.length + formData4.length - 1
        while(realLength > 0){
            for(var i in formData){
                realData[realLength] = formData[i]
                realData[realLength].type = "Project Balance"
                realLength -= 1
            }
            for(var i in formData2){
                realData[realLength] = formData2[i]
                realData[realLength].type = "Income/Expense"
                realLength -= 1
            }
            // for(var i in formData3){
            //     realData[realLength] = formData3[i]
            //     realData[realLength].type = "Credit"
            //     realLength -= 1
            // }
            for(var i in formData4){
                realData[realLength] = formData4[i]
                realData[realLength].type = "Taxes"
                realLength -= 1
            }
        }
    }, [formData, formData2, formData3, formData4])

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
            return (((result.name || "").toLowerCase().includes(props.name || ""))
                    && (result.form || "").includes(props.form || "")
                    && (result.bank || "").includes(props.bank || "")
                    && result.day.includes(props.day)
                    && result.month.includes(props.month) 
                    && result.year.includes(props.year))
            }).sort((b, a) => Date.parse(a.month+"/"+a.day+"/"+a.year) - Date.parse(b.month+"/"+b.day+"/"+b.year))
            .map( data => (
            <tbody>
                {sumofAmount(parseFloat(data.amount), data.mode)}
            <tr>
                <td className="">{data.type || ""}</td>
                <td className="">{data.name?data.name:data.mode}</td>
                <td className="">{data.form || ""}</td>
                <td className="">{data.bank || ""}</td>
                <td className="">{data.day+"/"+data.month+"/"+data.year}</td>
                
                {data.mode == "Expense" ? (
                                <td className="overflow-hidden text-end">{parseFloat((data.amount || 0)*-1).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                            ) : (
                                <td className=" overflow-hidden text-end">{parseFloat((data.amount || 0)).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                            )}
                <td key={data.url} className="text-center"><a href={data.url} target="_blank">{(data.url == "" || data.url == null)? "" : "file"}</a></td>
            </tr>
            </tbody>

        ))
    )
}

export default AddTable