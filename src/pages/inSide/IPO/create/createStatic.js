import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "../../../../context/UserContexts";
import {Button, IconButton, TextField} from "@mui/material";
import Modal from "@material-ui/core/Modal";
import db from "../../../../config/firebase-config"
import { doc, getDoc, setDoc} from "firebase/firestore"
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CustomerWrapper from "./CustomerWrapper";
import AddIcon from "@mui/icons-material/Add";
import FormPStatic from "./formPStatic";


export default function Customer(props) {

    const initialDocData = Object.freeze({
        description: "",
        quantity: 1,
        unit: "",
        labor: 0,
        material: 0
    });


    const navigate = useNavigate()
    const {user} = useUserContext()
    const [stateOfN, setStateOfN] = useState(false)
    const [openTwo, setOpenTwo] = useState(false)
    const [formDataIn, setFormDataIn] = useState([{name: "hi"}])
    const [edit] = useState(true)
    const [box2, setBox2] = useState("Taxpayer-num")
    const [box3, setBox3] = useState("Register-capital")
    const [boxLa, setBoxLa] = useState("Agent")
    const [count, setCount] = useState(0)
    const [docName, setDocName] = useState(initialDocData)
    const [listenC, setListen] = useState("");
    const [countQo, setCountQo] = useState(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        async function fetchData() {
            const docRef1 = doc(db, "PO", sessionStorage.getItem("projectID"));
            const docSnap = await getDoc(docRef1);
            if (docSnap.exists()) {
                setFormDataIn(docSnap.data())
                if (count <= 1) {
                    setCount(count + 1)
                }
            }
        }
        await fetchData()
    }, [count])

    useEffect(() => {
        if (formDataIn.type === "Private") {
            setBox2("surname")
            setBox3("email")
            setBoxLa("nickname")
        } else {
            setBoxLa("nickname")
            setBox3("registeredCapital")
            setBox2("taxpayerNum")
        }

    }, [count, formDataIn.type, listenC])

    useEffect(() => {
        if (!user) {
            navigate('/')
        }
    }, [navigate, user])

    const handleCreateTwo = () => {
        setOpenTwo(true)
    }

    const handleChangeUpload = (e) => {
        setDocName({
            ...docName,
            [e.target.name]: e.target.value
        })
    }

    const handleCloseTwo = () => {
        setOpenTwo(false)
        setDocName({
            ...docName,
            total: 0,
            labor: 0,
            material: 0,
            quantity: 1,
            totalUnitPrice: 0
        })
    }

    const handleChangePro = (e) => {
        setFormDataIn({
            ...formDataIn,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmitNext = async (e) => {
        e.preventDefault()
        if (formDataIn.option) {
            setCountQo(1)
            setStateOfN(true)
            const docRef1 = doc(db, "PO", formDataIn.genQo, "Quotation", formDataIn.genQo+"_"+formDataIn.option);
            await setDoc(docRef1, {"genQo": `${formDataIn.genQo+"_"+formDataIn.option}`, "payment": formDataIn.payment})
        }else {
            toast.error('Please Fill in all the value', {position: toast.POSITION.BOTTOM_CENTER});
        }
    };

    const handleSubmitPrice = async (e) => {
        e.preventDefault()
        setOpenTwo(false)
        const docRef1 = doc(db, "PO", formDataIn.genQo, "Quotation", formDataIn.genQo+"_"+formDataIn.option, "work", docName.description);
        await setDoc(docRef1, docName);
        setOpenTwo(false)
        setDocName({
            ...docName,
            labor: 0,
            material: 0,
            quantity: 1,
        })
    };

    const handleCancelNext = async (e) => {
        e.preventDefault()
        if (stateOfN === true) {
            setStateOfN(false)
        }
    };

    const handleGoNext = async () => {
        navigate("/insideQuotation")
        sessionStorage.setItem("projectID", formDataIn.genQo)
    };

    return (
        <CustomerWrapper>
            <div className="wrapper-box pt-4">
                <div className="container bg-white pt-5 mb-3">
                    <h4 className="pt-1 pt-md-1 px-2 mb-2">Quotation: {formDataIn.genQo}</h4>
                    <form>
                        <div className="row pt-2 pt-md-1 px-3 mb-0">
                            <div className="col px-2">
                                <div className="col pt-1 col-md-12">
                                    <TextField type="search" onChange={handleChangePro} InputLabelProps={{
                                        shrink: true,
                                    }} inputProps={{
                                        style: {
                                            height: "5px",
                                        },
                                    }}
                                               name="option" label="Option" className="w-100" required
                                    />
                                </div>
                            </div>
                            <div className="col p-0">
                                <div className="col p-0 pt-1 mb-2 mx-2">
                                    <TextField type="search" InputLabelProps={{
                                        shrink: true,
                                    }} inputProps={{
                                        style: {
                                            height: "5px",
                                        },
                                    }}
                                               name="sales" label="Sales" className="w-100" value={sessionStorage.getItem("email")} disabled={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row pt-2 pt-md-1 px-3 mb-0">
                            <div className="col px-2">
                                <div className="col pt-1 col-md-12">
                                    <TextField type="search" InputLabelProps={{
                                        shrink: true,
                                    }} inputProps={{
                                        style: {
                                            height: "5px",
                                        },
                                    }}
                                               name="subject" label="Subject" className="w-100" value={formDataIn.subject} required disabled={true}
                                    />
                                </div>
                            </div>
                            <div className="col p-0">
                                <div className="col p-0 pt-1 mb-2 mx-2">
                                    <TextField type="search" InputLabelProps={{
                                        shrink: true,
                                    }} inputProps={{
                                        style: {
                                            height: "5px",
                                        },
                                    }}
                                               name="projectName" label="Project Name" className="w-100" value={formDataIn.projectName} required disabled={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3 d-flex justify-content-center">
                            <div className="row pt-1">
                                <h6 className="pt-1 pt-md-1">Customer-info:</h6>
                                <div className="col px-2">
                                    <div className="col pt-1 col-md-12 mb-2">
                                        <TextField id="v_box1" type="search" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "5px",
                                            },
                                        }}
                                                   name="v_box1" label="Name" className="w-100" required
                                                   value={formDataIn.v_box1} disabled={true}/>
                                    </div>
                                </div>
                                <div className="col p-0">
                                    <div className="col p-0 pt-1 mb-2 mx-2">
                                        <TextField id="v_box2" type="search" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "5px",
                                            },
                                        }}
                                                   name="v_box2" label={box2} className="w-100" required
                                                   value={formDataIn.v_box2} disabled={true}/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col px-2">
                                    <div className="col pt-1 col-md-12 mb-2">
                                        <TextField id="v_box3" type="search" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "5px",
                                            },
                                        }}
                                                   name="v_box3" label={box3} className="w-100" required
                                                   value={formDataIn.v_box3} disabled={edit}/>
                                    </div>
                                </div>
                                <div className="col p-0">
                                    <div className="col p-0 pt-1 mb-2 mx-2">
                                        <TextField id="v_box4" type="search" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "5px",
                                            },
                                        }}
                                                   name="v_box4" label={boxLa} className="w-100" required
                                                   value={formDataIn.v_box4} disabled={edit}/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col px-2">
                                    <div className="col pt-1 col-md-12 mb-2">
                                        <TextField id="v_box5" type="search" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "5px",
                                            },
                                        }}
                                                   name="v_box5" label="Tel." className="w-100" required
                                                   value={formDataIn.v_box5} disabled={edit}/>
                                    </div>
                                </div>
                                <div className="col p-0">
                                    <div className="col p-0 pt-1 mb-2 mx-2">
                                        <TextField id="v_box7" type="search" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "5px",
                                            },
                                        }}
                                                   name="v_box7" label="Address" className="w-100" required
                                                   value={formDataIn.v_box7} disabled={edit}/>
                                    </div>
                                </div>
                                <div className="col-12 px-1">
                                    <div className="col p-0 pt-1 mb-2">
                                        <TextField name="payment" type="text" variant="filled" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "20px",
                                            },
                                        }}
                                                   label="payment"
                                                   className="w-100 px-1"
                                                   required
                                                   />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col p-0 mb-3">
                                    <div className="col p-0 pt-1 mt-2 mx-2 d-flex flex-row-reverse">
                                        <Button variant="contained" className="" color="primary"
                                                onClick={handleSubmitNext} type="submit" disabled={stateOfN}
                                                size="small">confirm
                                        </Button>
                                        <Button variant="contained" className="mx-1" color="secondary"
                                                onClick={handleCancelNext} type="submit" disabled={!stateOfN}
                                                size="small">Edit
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    {stateOfN?(<div className="container-fluid p-0">
                        <div className="row m-2 pt-1 mb-0">

                            <table className="table table-sm border-bottom-0">
                                <thead className="bg-dark text-light">
                                <tr>
                                    <th scope="col" className="t-stick">Description</th>
                                    <th scope="col" className="t-stick">Quantity</th>
                                    <th scope="col" className="t-stick">unit</th>
                                    <th scope="col" className="t-stick">labor</th>
                                    <th scope="col" className="t-stick">material</th>

                                </tr>
                                </thead>
                                <FormPStatic roomCode={formDataIn.genQo} currentCode={formDataIn.genQo+"_"+formDataIn.option}/>

                            </table>

                        </div>
                        <div className="row m-2 justify-content-end mt-0">
                            <div className="col-2 p-0 mx-md-1 col-md-1 mx-2">
                                <Button variant="outlined" className="w-100" color="primary" onClick={handleCreateTwo}
                                        size="small"><AddIcon/>
                                </Button>
                            </div>
                        </div>
                        <div className="row m-1 mt-0 justify-content-end pb-2">
                            <div className="col-4 p-0 mt-2 col-md-2 mx-1">
                                <Button variant="contained" className="w-100" color="primary" onClick={handleGoNext}
                                        size="small">Finish
                                </Button>
                            </div>
                        </div>
                    </div>):(<></>)}
                </div>
            </div>
            <Modal
                open={openTwo}
                onClose={handleCloseTwo}
                className="d-flex justify-content-center align-items-center"

            >

                <form className="border border-secondary p-2 m-2 rounded-2 row bg-white py-4" style={{maxWidth: "900px"}}>
                    <div className="pt-2">
                        <h4 className="col d-flex justify-content-start px-2">Add work</h4>
                        <div className="row mt-3 d-flex justify-content-center mb-2">
                            <div className="row pt-1">
                                <div className="col px-2">
                                    <div className="col pt-1 col-md-12 mb-2">
                                        <TextField onChange={handleChangeUpload} type="search" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "5px",
                                            },
                                        }}
                                                   name="description" label="Description" className="w-100"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row pt-1">
                                <div className="col px-2">
                                    <div className="col pt-1 col-md-12 mb-2">
                                        <TextField onChange={handleChangeUpload} type="number" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "5px",
                                            },
                                        }}
                                                   name="quantity" label="Quantity" className="w-100" Value={docName.quantity}
                                        />
                                    </div>
                                </div>
                                <div className="col p-0">
                                    <div className="col p-0 pt-1 mb-2 mx-2">
                                        <TextField onChange={handleChangeUpload} type="text" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "5px",
                                            },
                                        }}
                                                   name="unit" label="Unit" className="w-100"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col px-2">
                                    <div className="col pt-1 col-md-12 mb-2">
                                        <TextField onChange={handleChangeUpload} type="number" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "5px",
                                            },
                                        }}
                                                   name="labor" label="Labor" className="w-100"
                                        />
                                    </div>
                                </div>
                                <div className="col p-0">
                                    <div className="col p-0 pt-1 mb-2 mx-2">
                                        <TextField onChange={handleChangeUpload} type="number" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "5px",
                                            },
                                        }}
                                                   name="material" label="Material" className="w-100"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col px-2">
                                    <div className="col pt-1 col-md-12 mb-2">
                                        <TextField type="number" disabled={true} InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "5px",
                                            },
                                        }}
                                                   name="totalUnitPrice" label="TotalUnitPrice" className="w-100" value={(parseFloat(docName.labor)+parseFloat(docName.material))}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col px-2">
                                    <div className="col pt-1 col-md-12 mb-2">
                                        <TextField type="number" disabled={true} InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "5px",
                                            },
                                        }}
                                                   name="total" label="Total" className="w-100" value={docName.quantity*(parseFloat(docName.labor)+parseFloat(docName.material))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row d-flex justify-content-center">
                            <Button type="submit" variant="contained" color="error" className="mx-3 col-3"
                                    onClick={handleCloseTwo}>
                                Close
                            </Button>
                            <Button type="submit" variant="contained" color="primary" className="mx-3 px-2 col-3"
                                    onClick={handleSubmitPrice}>
                                Add
                            </Button>

                        </div>
                    </div>
                </form>
            </Modal>
            <ToastContainer/>
        </CustomerWrapper>

    );
}
