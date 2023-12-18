import * as React from 'react';
import {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {collection, onSnapshot} from "firebase/firestore";
import db from "../../../config/firebase-config";

const options = ['Option 1', 'Option 2'];

export default function ComboBox(props) {

    const [formData, setFormData] = useState([])
    const [formName] = useState([])
    const [inputValue, setInputValue] = useState('');
    const [value, setValue] = useState(options[0]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        onSnapshot(collection(db, "bank"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
    }, [])

    useEffect(() => {
        formData.map((data) => {
            return formName.indexOf(data.bank +"-"+ data.number) === -1 ? formName.push(data.bank +"-"+ data.number) : console.log("This item already exists");
        })
    }, [formData, formName])

    return (
        <div className="w-100 p-0 mb-2" id="no-print">
        <Autocomplete
            disablePortal
            size="medium"
            id="combo-box-demo"
            options={formName}
            onChange={(event, newValue) => {
                setValue(newValue);
                sessionStorage.setItem("selectBank", newValue)
                props.func(newValue)
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => <TextField size="medium" {...params} label="Choose Bank"/>}
        />
        </div>
    );
}

