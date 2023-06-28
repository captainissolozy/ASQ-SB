import * as React from 'react';
import {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {collection, onSnapshot} from "firebase/firestore";
import db from "../../../../config/firebase-config";

const options = ['Option 1', 'Option 2'];

export default function ComboBox(props) {

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

    useEffect(() => {
        formData.map((data) => {
            return formName.indexOf(data.v_box1 + data.v_box2) === -1 ? formName.push(data.v_box1 + data.v_box2) : console.log("This item already exists");
        })
    }, [formData, formName])

    return (
        <div className="container-fluid col-4 p-0" id="no-print">
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            size="small"
            disabled={props.dis}
            options={formName}
            onChange={(event, newValue) => {
                setValue(newValue);
                sessionStorage.setItem("selectCus", newValue)
                props.func(newValue)
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => <TextField size="small" {...params} label="Customer name"/>}
        />
        </div>
    );
}

