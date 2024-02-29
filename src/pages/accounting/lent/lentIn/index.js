import LobbyWrapper from "./LobbyWrapper";
import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "../../../../context/UserContexts";
import {
    InputLabel,
    IconButton,
    TextField,
    Select,
    MenuItem,
    FormControl,
    Button
} from "@mui/material";
import db from "../../../../config/firebase-config"
import {doc, getDoc, setDoc, } from "firebase/firestore"
import AddTable from "./AddTable";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Modal from "@material-ui/core/Modal";


export default function Lobby() {

    const initialFormData = Object.freeze({
        name: "",
        mode: "",
        amount: "",
        form: "",
        day: "",
        month: "",
        year: ""
    });

    const initialSearchKey = Object.freeze({
        name: "",
        mode: "",
        form: "",
        day: "",
        month: "",
        year: ""
    });

    const navigate = useNavigate()
    const {user} = useUserContext()
    const [open, setOpen] = useState(false)
    const [total, setTotal] = useState(0)
    const [formData, updateFormData] = useState(initialFormData)
    const [searchKey, setSearchKey] = useState(initialSearchKey)

    useEffect(() => {
        if (!user) {
            navigate('/')
        }
        window.scrollTo(0, 0)
    }, [navigate, user])

    const handleCreate = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
        updateFormData({})
    }
    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim()
        })
    }

    const listenTotal = (data) => {
        setTotal(data)
    }


    const joinChange = (e) => {
        setSearchKey({
            ...searchKey,
            [e.target.name]: e.target.value
        })
    }

    return (
        <LobbyWrapper>
            <div className="wrapper-box pt-4">
                <div className="container mb-5 py-4 px-3 shadow-sm" style={{height: "auto"}}>
                    <div className=''>
                    <div className="col px-2 d-flex align-items-center justify-content-between">
                        <h4 className="mb-0">Project Balance : {sessionStorage.getItem("projectIDAC")}</h4>
                    </div>
                    <div className="row mt-3 d-flex justify-content-center">
                        <div className="row">
                            <div className="col-8 px-2">
                                <div className="col pt-1 col-md-12 mb-2">
                                    <TextField id="outlined-search" type="search" InputLabelProps={{
                                        shrink: true,
                                    }} inputProps={{
                                        style: {
                                            height: "5px",
                                        },
                                    }}
                                               name="name" label="Description" className="w-100" onChange={joinChange}/>
                                </div>
                            </div>
                            <div className="col-md-4 p-0 col">
                                <div className="col p-0 pt-1 mb-2 mx-2">
                                    <TextField id="outlined-search" type="name" InputLabelProps={{
                                        shrink: true
                                    }} inputProps={{
                                        style: {
                                            height: "5px",
                                        },
                                    }}
                                               name="form" label="Form" className="w-100" onChange={joinChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-8">
                                <div className="row d-flex">
                                    <div className="col p-0 pt-1 col-md mb-2 mx-2">
                                        <TextField id="outlined-search" type="search" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "5px",
                                            },
                                        }}
                                                   name="day" label="Date" className="w-100" onChange={joinChange}/>
                                    </div>
                                    <div className="col p-0 pt-1 col-md mb-2 mx-2">
                                        <TextField id="outlined-search" type="search" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "5px",
                                            },
                                        }}
                                                   name="month" label="Month" className="w-100" onChange={joinChange}/>
                                    </div>
                                    <div className="col p-0 pt-1 col-md mb-2 mx-2">
                                        <TextField id="outlined-search" type="search" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "5px",
                                            },
                                        }}
                                                   name="year" label="Year" className="w-100" onChange={joinChange}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row d-flex justify-content-center">
                                    <div className="col p-0">
                                        <div className="col p-0 pt-1 mb-2 mx-2">
                                        <FormControl size="small" className="w-100">
                                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                            <Select     id="demo-simple-select" labelId="demo-simple-select-label"
                                                        name="mode" label="Type" className="w-100"
                                                        value={searchKey.mode} onChange={joinChange}>
                                                <MenuItem value="">
                                                    <em>All</em>
                                                </MenuItem>
                                                <MenuItem value={"Income"}>Income</MenuItem>
                                                <MenuItem value={"Expense"}>Expense</MenuItem>
                                            </Select>
                                        </FormControl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="row mt-2 mx-2 table-responsive">
                            <table className="table border-bottom-0 overflow-auto" id="dtHorizontalExample" >
                                <thead className="text-light">
                                <tr>
                                    <th scope="col" className="t-stick th px-3">Type</th>
                                    <th scope="col" className="t-stick th px-3">Description</th>
                                    <th scope="col" className="t-stick th px-3">Form</th>
                                    <th scope="col" className="t-stick th px-3">Date</th>
                                    <th scope="col" className="t-stick th px-3 text-end">Amount</th>
                                </tr>
                                </thead>
                                <AddTable name={searchKey.name} form={searchKey.form.toLowerCase()} mode={searchKey.mode}
                                          day={searchKey.day} month={searchKey.month} year={searchKey.year} total={listenTotal}
                                          roomcode={sessionStorage.getItem("projectIDAC")}
                                />
                            </table>
                            <h5 className="d-flex justify-content-end">Total : {total.toLocaleString(undefined, {maximumFractionDigits:2})}</h5>
                    </div>
                </div>

            </div>
            
            <ToastContainer/>
        </LobbyWrapper>

    );
}
