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
import {doc, updateDoc, setDoc } from "firebase/firestore"
import AddTable from "./AddTable";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Modal from "@material-ui/core/Modal";


export default function Lobby() {

    const initialFormData = Object.freeze({
        name: "",
        lent: 0,
        description: "",
        payback: 0,
        day: "",
        month: "",
        year: "",
        pday: "::",
        pmonth: "::",
        pyear: "::::",
        status:"pending"
    });

    const initialFormData2 = Object.freeze({
        payback: 0,
        pday: "",
        pmonth: "",
        pyear: "",
        status:"pending"
    });

    const initialSearchKey = Object.freeze({
        name: "",
        description: "",
        day: "",
        month: "",
        year: "",
        mode:""
    });

    const navigate = useNavigate()
    const {user} = useUserContext()
    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
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

    const listenChange = () => {
        setOpen2(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleClose2 = () => {
        setOpen2(false)
    }

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim()
        })
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
        const docRef1 = doc(db, "accounting", "lent", "record", formData.name+formData.description);
        await setDoc(docRef1, formData);
        setOpen(false)
    };

    const handleSubmit2 = async (e) => {
        e.preventDefault()
        const docRef1 = doc(db, "accounting", "lent", "record", sessionStorage.getItem("PayID"));
        if(sessionStorage.getItem("PayLent") - formData2.payback == 0){
            formData2.status = "done"
        }
        await updateDoc(docRef1, formData2);
        sessionStorage.setItem("PayID", "");
        sessionStorage.setItem("PayLent", "");
        setOpen2(false)
    };

    return (
        <LobbyWrapper>
            <div className="wrapper-box pt-4">
                <div className="container mb-5 py-4 px-3 shadow-sm" style={{height: "auto"}}>
                    <div className=''>
                    <div className="col px-2 d-flex align-items-center justify-content-between">
                        <h4 className="mb-0">Credit</h4>
                        <div>
                        <IconButton variant="outlined" className="px-3 rounded-2 sty-addbtn" color="primary" onClick={handleCreate}
                                    size="small"><p3 className="mb-0">เงินยืม</p3></IconButton>
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
                                               name="description" label="Description" className="w-100" onChange={joinChange}/>
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
                                               name="name" label="By." className="w-100" onChange={joinChange}/>
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
                                                <MenuItem value={"done"}>Done</MenuItem>
                                                <MenuItem value={"pending"}>Pending</MenuItem>
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
                                    <th scope="col" className="t-stick th px-3">By.</th>
                                    <th scope="col" className="t-stick th px-3">Description</th>
                                    <th scope="col" className="t-stick th px-3 text-center">Lent Date</th>
                                    <th scope="col" className="t-stick th px-3 text-end">เงินยืม</th>
                                    <th scope="col" className="t-stick th px-3 text-center">Payback Date</th>
                                    <th scope="col" className="t-stick th px-3 text-end">เงินคืน</th>
                                    <th scope="col" className="t-stick th px-3 text-end">คงเหลือ</th>
                                </tr>
                                </thead>
                                <AddTable name={searchKey.name} description={searchKey.description} mode={searchKey.mode}
                                          day={searchKey.day} month={searchKey.month} year={searchKey.year}
                                          func={listenChange}
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
                        <h3>เงินยืม</h3>
                    </div>
                    <TextField className="my-2"
                               label="Description"
                               name="description"
                               required
                               onChange={handleChange}
                    />
                    <TextField className="my-2"
                               label="จำนวนเงินยืม"
                               name="lent"
                               type="text"
                               required
                               onChange={handleChange}
                    />
                    <TextField className="my-2"
                               label="By."
                               name="name"
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
                                Create
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
                        <h3>เงินคืน</h3>
                    </div>
                    <TextField className="my-2"
                               label="จำนวนเงินคืน"
                               name="payback"
                               type="text"
                               required
                               onChange={handleChange2}
                    />
                    <div className="px-0 mb-2">
                        <div className="col d-flex justify-content-between w-100">
                        <TextField className="my-2"
                               label="Day"
                               name="pday"
                               type="text"
                               required
                               onChange={handleChange2}/>
                    <TextField className="my-2"
                               label="Month"
                               name="pmonth"
                               type="text"
                               required
                               onChange={handleChange2}/>
                    <TextField className="my-2"
                               label="Year"
                               name="pyear"
                               type="text"
                               required
                               onChange={handleChange2}/>
                        </div>
                    </div>

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
