import {useEffect, useState} from "react";
import db from "../../../../config/firebase-config"
import {collection, doc, getDoc, onSnapshot} from "firebase/firestore"
import {useNavigate} from "react-router-dom";


const AddTable = (props) => {

    const [formData, setFormData] = useState([])
    const [formData2, setFormData2] = useState([])
    const [realData, setRealData] = useState([])
    const [count, setCount] = useState(0)
    let amount = 0
    

    useEffect(() => {
        onSnapshot(collection(db, "PO", props.roomcode, "income"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
        onSnapshot(collection(db, "PO", props.roomcode, "expense"), (snapshot) => {
            setFormData2(snapshot.docs.map((doc) => doc.data()))
        });
    }, [count])

    useEffect(() => {
        var realLength = formData.length + formData2.length

        while(realLength > 0){
            if(formData.length > 0){
                for(var i in formData){
                    realData[realLength-1] = formData[i].inComeDoc
                    realData[realLength-1].url = formData[i].url || ""
                    realLength -= 1
                }
            }

            if(formData2.length > 0){
                for(var i in formData2){
                    realData[realLength-1] = formData2[i].exPenseDoc
                    realData[realLength-1].url = formData2[i].url || ""
                    realLength -= 1
                }
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
            return ((result.name.toLowerCase() == (props.name) || props.name == "")
                    && result.form.includes(props.form)
                    && result.mode.includes(props.mode) 
                    && result.day.includes(props.day)
                    && result.month.includes(props.month) 
                    && result.year.includes(props.year))
        }).sort((b, a) => Date.parse(a.month+"/"+a.day+"/"+a.year) - Date.parse(b.month+"/"+b.day+"/"+b.year)).map((data, i) => (
            <tbody>
                {sumofAmount(parseFloat(data.amount), data.mode)}
            <tr>
                <td className="px-3">{data.mode}</td>
                <td className="px-3">{data.name}</td>
                    
                <td className="px-3">{data.bank || ""}</td>
                <td className="px-3">{data.supplier || ""}</td>
                <td className="px-3">{data.day+"/"+data.month+"/"+data.year}</td>
                {data.mode == "Expense" ? (
                                <td className="px-3 overflow-hidden text-end">{parseFloat(data.amount*-1).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                            ) : (
                                <td className="px-3 overflow-hidden text-end">{parseFloat(data.amount).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                            )}
                <td key={data.url} className="text-center"><a href={data.url} target="_blank">{data.url != ""?"file" : ""}</a></td>
            </tr>
            </tbody>

        ))
    )
}

export default AddTable