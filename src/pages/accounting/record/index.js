import LobbyWrapper from "./LobbyWrapper";
import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "../../../context/UserContexts";
import {
    InputLabel,
    IconButton,
    TextField,
    Select,
    MenuItem,
    FormControl,
    Button
} from "@mui/material";
import db from "../../../config/firebase-config"
import {doc, getDoc, setDoc, } from "firebase/firestore"
import AddTable from "./AddTable";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Modal from "@material-ui/core/Modal";
import ComboBox from "./combobox";


export default function Lobby() {

    const initialFormData = Object.freeze({
        bank: "",
        number: "",
        amount: "",
        description: "",
        day: "",
        month: "",
        year: ""
    });

    const initialFormData2 = Object.freeze({
        bank: "",
        number: ""
    });

    const initialSearchKey = Object.freeze({
        bank: "",
        number: "",
        amount: "",
        description: "",
        day: "",
        month: "",
        year: ""
    });

    const navigate = useNavigate()
    const {user} = useUserContext()
    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [listen, setListen] = useState("")
    const [formData, updateFormData] = useState(initialFormData)
    const [formData2, updateFormData2] = useState(initialFormData2)
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
        setListen("")
    }

    const handleCreate2 = () => {
        setOpen2(true)
    }

    const handleClose2 = () => {
        setOpen2(false)
    }

    const listenChange = (data) => {
        setListen(data)
        handleBank(data)
    }

    const handleBank = async (data) => {
        const docSnap = data.split("-")
        updateFormData({
            ...formData,
            "bank": docSnap[0],
            "number": docSnap[1],
        });
    }

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim()
        });
    }

    const handleChange2 = (e) => {
        updateFormData2({
            ...formData2,
            [e.target.name]: e.target.value.trim()
        })
    }

    const joinChange = (e) => {
        setSearchKey({
            ...searchKey,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const docRef1 = doc(db, "accounting", "record", "record", formData.number+formData.description);
        await setDoc(docRef1, formData);
        setOpen(false)
    };

    const handleSubmit2 = async (e) => {
        e.preventDefault()
        const docRef1 = doc(db, "bank", formData2.number);
        await setDoc(docRef1, formData2);
        setOpen2(false)
    };

    return (
        <LobbyWrapper>
            <div className="wrapper-box pt-4">
                <div className="container mb-5 py-4 px-3 shadow-sm" style={{height: "auto"}}>
                    <div className=''>
                    <div className="col px-2 d-flex align-items-center justify-content-between">
                        <h4 className="mb-0">Accounting Record</h4>
                        <div>
                        <IconButton variant="outlined" className="px-3 rounded-2 sty-addbtn" color="primary" onClick={handleCreate}
                                    size="small"><p3 className="mb-0">Add Record</p3></IconButton>
                        <IconButton variant="outlined" className="px-3 rounded-2" color="secondary" onClick={handleCreate2}
                                    size="small"><p3 className="mb-0">+ Bank</p3></IconButton>
                        </div>
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
                                               name="bank" label="Bank name" className="w-100" onChange={joinChange}/>
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
                                               name="number" label="Account Number" className="w-100" onChange={joinChange}/>
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
                            <div className="col-md-4 p-0 col">
                                <div className="col p-0 pt-1 mb-2 mx-2">
                                    <TextField id="outlined-search" type="name" InputLabelProps={{
                                        shrink: true
                                    }} inputProps={{
                                        style: {
                                            height: "5px",
                                        },
                                    }}
                                               name="description" label="Description" className="w-100" onChange={joinChange}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="row mt-2 mx-2 table-responsive">
                            <table className="table border-bottom-0 overflow-auto" id="dtHorizontalExample" >
                                <thead className="text-light">
                                <tr>
                                    <th scope="col" className="t-stick th px-3">Bank</th>
                                    <th scope="col" className="t-stick th px-3">Account number</th>
                                    <th scope="col" className="t-stick th px-3">Description</th>
                                    <th scope="col" className="t-stick th px-3">Date</th>
                                    <th scope="col" className="t-stick th px-3 text-end">Amount</th>
                                </tr>
                                </thead>
                                <AddTable bank={searchKey.bank} number={searchKey.number} description={searchKey.description}
                                          day={searchKey.day} month={searchKey.month} year={searchKey.year}
                                />
                            </table>
                    </div>
                </div>

            </div>
            <Modal
                open={open}
                onClose={handleClose}
                className="d-flex justify-content-center align-items-center"
                disableEnforceFocus
            >

                <form className="border border-secondary p-4 m-2 rounded-2 row bg-white" style={{maxWidth: "600px"}}>
                    <div className="heading-container mt-2 mb-2 p-0 d-flex justify-content-start">
                        <h3>Accounting record</h3>
                    </div>
                    <ComboBox className="w-100" func={listenChange}/>
                    <TextField className="my-2"
                               label="Bank name"
                               name="name"
                               value={formData.bank}
                               required
                               onChange={handleChange}
                    />
                    <TextField className="my-2"
                               label="Account number"
                               name="name"
                               required
                               value={formData.number}
                               onChange={handleChange}
                    />
                    <TextField className="my-2"
                               label="Description"
                               name="description"
                               required
                               onChange={handleChange}
                    />
                    <TextField className="my-2"
                               label="Amount"
                               name="amount"
                               type="text"
                               required
                               onChange={handleChange}
                    />
                    <div className="px-0 mb-2">
                        <div className="col d-flex justify-content-between w-100">
                        <TextField className="my-2"
                               label="Day"
                               name="day"
                               type="text"
                               required
                               onChange={handleChange}/>
                    <TextField className="my-2"
                               label="Month"
                               name="month"
                               type="text"
                               required
                               onChange={handleChange}/>
                    <TextField className="my-2"
                               label="Year"
                               name="year"
                               type="text"
                               required
                               onChange={handleChange}/>
                        </div>
                    </div>

                    <div className="pt-2">
                        <div className="col d-flex justify-content-center">
                            <Button type="submit" variant="contained" color="secondary" className="mx-3 m"
                                    onClick={handleClose}>
                                Close
                            </Button>

                            <Button type="submit" variant="contained" color="primary" className="mx-3"
                                    onClick={handleSubmit}>
                                Done
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>
            <Modal
                open={open2}
                onClose={handleClose2}
                className="d-flex justify-content-center align-items-center"
                disableEnforceFocus
            >

                <form className="border border-secondary p-4 m-2 rounded-2 row bg-white" style={{maxWidth: "600px"}}>
                    <div className="heading-container mt-2 mb-2 p-0 d-flex justify-content-start">
                        <h3>Bank</h3>
                    </div>
                    <InputLabel id="demo-simple-select-label" >Bank</InputLabel>
                        <Select id="demo-simple-select" labelId="demo-simple-select-label" name="bank" label="Bank" className="w-100 mb-2"
                            value={formData2.bank} onChange={handleChange2}>
                                <MenuItem value={"Kasikorn"}>Kasikorn</MenuItem>
                                <MenuItem value={"Krungthai"}>Krungthai</MenuItem>
                                <MenuItem value={"TTB"}>TTB</MenuItem>
                                <MenuItem value={"SCB"}>SCB</MenuItem>
                                <MenuItem value={"BB"}>TTB</MenuItem>
                                <MenuItem value={"GSB"}>SCB</MenuItem>
                        </Select>
                        <TextField className="my-2"
                               label="Account number"
                               name="number"
                               type="text"
                               required
                               onChange={handleChange2}/>

                    <div className="pt-2">
                        <div className="col d-flex justify-content-center">
                            <Button type="submit" variant="contained" color="secondary" className="mx-3 m"
                                    onClick={handleClose2}>
                                Close
                            </Button>

                            <Button type="submit" variant="contained" color="primary" className="mx-3"
                                    onClick={handleSubmit2}>
                                Done
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>
            <ToastContainer/>
        </LobbyWrapper>

    );
}
