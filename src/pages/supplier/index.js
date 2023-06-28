import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "../../context/UserContexts";
import {Button, IconButton, TextField} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Modal from "@material-ui/core/Modal";
import db from "../../config/firebase-config"
import {doc, setDoc} from "firebase/firestore"
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CustomerWrapper from "./SupplierWrapper";
import FormS from "./formS";


export default function Customer() {

    const initialFormData2 = Object.freeze({
        type: "Organization",
        v_box1: "",
        v_box2: "",
        v_box3: "",
        v_box4: "",
        v_box5: "",
        v_box6: "Incompleted",
        v_box7: ""
    });

    const initialFormData = Object.freeze({
        type: "Private",
        v_box1: "",
        v_box2: "",
        v_box3: "",
        v_box4: "",
        v_box5: "",
        v_box6: "Incompleted",
        v_box7: ""
    });

    const navigate = useNavigate()
    const {user} = useUserContext()
    const [open, setOpen] = useState(false)
    const [formData, updateFormData] = useState(initialFormData)
    const [formData2, updateFormData2] = useState(initialFormData2)
    const [box2, setBox2] = useState("Taxpayer-num")
    const [box3, setBox3] = useState("Register-capital")
    const [boxLa, setBoxLa] = useState("Agent")
    const [sendTo, setSendTo] = useState(2)
    const [searchChanged, setSearchChanged] = useState({
        name: "",
        status: "",
        nickname: "",
        tel: ""
    })

    useEffect(() => {
        if (!user) {
            navigate('/lobby')
        }
    }, [navigate, user])

    const handleCreate = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const handleChange = (e) => {
        if (sendTo === 1) {
            updateFormData({
                ...formData,
                [e.target.name]: e.target.value.trim()
            })
        } else if (sendTo === 2) {
            updateFormData2({
                ...formData2,
                [e.target.name]: e.target.value.trim()
            })
        }
    }

    const handleChangeToOrg = () => {
        setBox2("taxpayerNum")
        setBox3("registerCapital")
        setSendTo(2)
        setBoxLa("Agent")
    }

    const handleChangeToPer = () => {
        setBox2("surname")
        setBox3("email")
        setSendTo(1)
        setBoxLa("Nickname")
    }

    const joinChange = (e) => {
        setSearchChanged({
            ...searchChanged,
            [e.target.name]: e.target.value.trim()
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (sendTo === 1) {
            sessionStorage.setItem('roomKeySup', formData.v_box1 + formData.v_box2)
            const docRef1 = doc(db, "SuppliersDetail", formData.v_box1 + formData.v_box2);
            await setDoc(docRef1, formData);
            navigate('/ins')
        } else {
            sessionStorage.setItem('roomKeySup', formData2.v_box1 + formData2.v_box2)
            const docRef1 = doc(db, "SuppliersDetail", formData2.v_box1 + formData2.v_box2);
            await setDoc(docRef1, formData2);
            navigate('/ins')
        }
    };


    return (
        <CustomerWrapper>
            <div className="wrapper-box bg-cus h-100 container px-0 shadow-sm mb-5">
                <div className="container-fluid">
                    <div className="my-1 p-3 pb-3 row d-flex justify-content-center">
                        <div className="col-10 d-flex justify-content-between align-items-center col-md-9 header-wrapper">
                            <h4 className="mb-0">Supplier</h4>
                            <IconButton variant="outlined" className="px-3 rounded-2 sty-addbtn" color="primary" onClick={handleCreate}
                                        size="small"><p3 className="mb-0">Add</p3></IconButton>
                        </div>
                        <div className="row mt-2 d-flex justify-content-center">
                            <div className="row d-flex justify-content-center p-0 wrap-input">
                                <div className="col-8 col-md-6 flex-md-fill p-0">
                                    <div className="col pt-1 col-md-12 mb-2">
                                        <TextField id="outlined-search" type="search" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "5px",
                                            },
                                        }}
                                                   name="name" label="Name" className="w-100" onChange={joinChange}/>
                                    </div>
                                </div>
                                <div className="col p-0 col-md-3 flex-sm-fill">
                                    <div className="col p-0 pt-1 mb-2">
                                        <TextField id="outlined-search" type="search" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "5px",
                                            },
                                        }}
                                                   name="status" label="Status" className="w-100"
                                                   onChange={joinChange}/>
                                    </div>
                                </div>
                            </div>
                            <div className="row d-flex justify-content-center wrap-input p-0">
                                <div className="col-md-6 p-0 col-8 flex-md-fill">
                                    <div className="col p-0 pt-1 mb-2">
                                        <TextField id="outlined-search" type="name" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "5px",
                                            },
                                        }}
                                                   name="nickname" label="Nickname" className="w-100"
                                                   onChange={joinChange}/>
                                    </div>
                                </div>
                                <div className="col p-0 col-md-3 flex-sm-fill">
                                    <div className="col p-0 pt-1 mb-2">
                                        <TextField id="outlined-search" type="search" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "5px",
                                            },
                                        }}
                                                   name="tel" label="Tel." className="w-100" onChange={joinChange}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row m-2 mt-1 pt-2">
                        <div className="table-responsive">
                        <table className="table table-sm border-bottom-0 rounded">
                            <thead className="bg-dark text-light">
                            <tr>
                                <th scope="col" className="t-stick px-3 py-2">Name</th>
                                <th scope="col" className="t-stick px-3 py-2">Contact</th>
                                <th scope="col" className="t-stick px-3 py-2">tel.</th>
                                <th scope="col" className="t-stick px-3 py-2">status</th>
                            </tr>
                            </thead>
                            <FormS s_name={searchChanged.name.toLowerCase()} s_status={searchChanged.status.toLowerCase()}
                                   s_nickname={searchChanged.nickname.toLowerCase()} s_tel={searchChanged.tel}/>
                        </table>
                    </div>
                    </div>

                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                className="d-flex justify-content-center align-items-center"

            >

                <form className="border border-secondary p-4 m-2 rounded-2 row bg-white" style={{maxWidth: "900px"}}>
                    <div className="heading-container mt-2 p-0 d-flex justify-content-start">
                        <h3>Customer</h3>
                        <Button type="submit" variant="outlined" color="warning" className="ms-auto me-2"
                                onClick={handleChangeToOrg}>
                            Org
                        </Button>
                        <Button type="submit" variant="outlined" color="success" className=""
                                onClick={handleChangeToPer}>
                            Private
                        </Button>
                    </div>
                    <TextField className="my-2"
                               label="Name"
                               name="v_box1"
                               required
                               onChange={handleChange}
                    />
                    <TextField className="my-2"
                               label={box2}
                               name="v_box2"
                               type="text"
                               required
                               onChange={handleChange}
                    />
                    <TextField className="my-2"
                               label={box3}
                               name="v_box3"
                               type="text"
                               required
                               onChange={handleChange}
                    />
                    <TextField className="my-2"
                               label={boxLa}
                               name="v_box4"
                               variant="filled"
                               type="text"
                               required
                               onChange={handleChange}
                    />
                    <TextField className="my-2"
                               label="Tel."
                               name="v_box5"
                               variant="filled"
                               type="text"
                               required
                               onChange={handleChange}
                    />
                    <TextField className="my-2"
                               label="Address"
                               name="v_box7"
                               type="text"
                               required
                               onChange={handleChange}
                    />

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
            <ToastContainer/>
        </CustomerWrapper>

    );
}
