import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {collection, onSnapshot} from "firebase/firestore";
import db from "../../../../config/firebase-config";
import {useEffect, useState} from "react";
const options = ['Option 1', 'Option 2'];

export default function ComboBox() {

    const [formData, setFormData] = useState([])
    const [formName] = useState([])
    const [inputValue, setInputValue] = useState('');
    const [value, setValue] = useState(options[0]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        onSnapshot(collection(db, "CustomersDetail"), (snapshot) => {
            setFormData(snapshot.docs.map((doc) => doc.data()))
        });
    }, [])

    useEffect( () => {
        formData.map((data) => {
            return formName.indexOf(data.v_box1+data.v_box2) === -1?formName.push(data.v_box1+data.v_box2):console.log("This item already exists");
        })
    }, [formData])

    return (
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            size="small"
            options={formName}
            onChange={(event: any, newValue: string | null) => {
                setValue(newValue);
                sessionStorage.setItem("selectCus", newValue)
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => <TextField {...params} label="Customer name" />}
        />
    );
}

