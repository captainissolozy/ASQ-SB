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
    FormControl
} from "@mui/material";
import db from "../../../config/firebase-config"
import {doc, getDoc, setDoc} from "firebase/firestore"
import AddTable from "./AddTable";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default function Lobby() {

    const initialFormData = Object.freeze({
        email: sessionStorage.getItem('email'),
        title: "",
        timeLimit: 0,
        gameState: true,
        turn: 0,
        pubLic: "no",
        WinState: false,
        UniqueKey: "",
        winCon: 0
    });

    const initialSearchKey = Object.freeze({
        sales: "",
        genQo: "",
        day: "",
        month: "",
        year: "",
        status: "",
    });

    const navigate = useNavigate()
    const {user} = useUserContext()
    const [open, setOpen] = useState(false)
    const [formData, updateFormData] = useState(initialFormData)
    const [gameData, upDateGameData] = useState()
    const [pKey, generatePKey] = useState("")
    const [searchKey, setSearchKey] = useState(initialSearchKey)

    useEffect(() => {
        if (!user) {
            navigate('/')
        }
        window.scrollTo(0, 0)
    }, [navigate, user])

    const handleCreate = () => {
        setOpen(true)
        sessionStorage.removeItem('roomKeyCus');
        sessionStorage.removeItem('selectCus');
        navigate('/createQuotation')
    }

    const joinChange = (e) => {
        setSearchKey({
            ...searchKey,
            [e.target.name]: e.target.value
        })
    }

    return (
        <LobbyWrapper>
            <div className="wrapper-box">
                <div className="container mb-5 py-4 px-3 shadow-sm" style={{height: "auto"}}>
                    <div className=''>
                    <div className="col px-2 d-flex align-items-center justify-content-between">
                        <h4 className="mb-0">Project</h4>
                        <IconButton variant="outlined" className="px-3 rounded-2 sty-addbtn" color="primary" onClick={handleCreate}
                                    size="small"><p3 className="mb-0">Add</p3></IconButton>
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
                                               name="genQo" label="Quotation Id" className="w-100" onChange={joinChange}/>
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
                                               name="sales" label="Sales" className="w-100" onChange={joinChange}/>
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
                                                        name="status" label="Status" className="w-100"
                                                        value={searchKey.status} onChange={joinChange}>
                                                <MenuItem value="">
                                                    <em>All</em>
                                                </MenuItem>
                                                <MenuItem value={"Completed"}>Completed</MenuItem>
                                                <MenuItem value={"Pending"}>Pending</MenuItem>
                                                <MenuItem value={"Cancelled"}>Cancelled</MenuItem>
                                                <MenuItem value={"Denied"}>Denied</MenuItem>
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
                                    <th scope="col" className="t-stick th px-3">Project-No</th>
                                    <th scope="col" className="t-stick th px-3">Customer</th>
                                    <th scope="col" className="t-stick th px-3">Sales</th>
                                    <th scope="col" className="t-stick th px-3">Status</th>
                                </tr>
                                </thead>
                                <AddTable genQo={searchKey.genQo} sales={searchKey.sales.toLowerCase()} status={searchKey.status.toLowerCase()}
                                          day={searchKey.day} month={searchKey.month} year={searchKey.year}
                                />
                            </table>
                    </div>
                </div>

            </div>
            <ToastContainer/>
        </LobbyWrapper>

    );
}
