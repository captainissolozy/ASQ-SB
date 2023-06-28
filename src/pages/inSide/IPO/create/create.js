import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "../../../../context/UserContexts";
import {Button, IconButton, TextField} from "@mui/material";
import Modal from "@material-ui/core/Modal";
import db from "../../../../config/firebase-config"
import {collection, doc, getDoc, setDoc, getDocs, deleteDoc} from "firebase/firestore"
import FormC from "./formC";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CustomerWrapper from "./CustomerWrapper";
import AddIcon from "@mui/icons-material/Add";
import ComboBox from "./combobox";
import { jsPDF } from "jspdf";
import * as html2canvas from "html2canvas";


export default function Customer() {

    const current = new Date();

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

    const initialFormDataProject = Object.freeze({
        subject: "",
        projectName: "",
        sales: sessionStorage.getItem("email"),
        date: current.getDate(),
        month: current.getMonth() + 1,
        year: current.getFullYear(),
        payment: ""
    });

    const initialDocData = Object.freeze({
        description: "",
        quantity: 1,
        unit: "",
        labor: 0,
        material: 0,
        totalUnitPrice: 0,
        total: 0,
    });

    const navigate = useNavigate()
    const {user} = useUserContext()
    const [open, setOpen] = useState(false)
    const [stateOfN, setStateOfN] = useState(false)
    const [openTwo, setOpenTwo] = useState(false)
    const [formDataIn, setFormDataIn] = useState([])
    const [formData, updateFormData] = useState(initialFormData)
    const [formData2, updateFormData2] = useState(initialFormData2)
    const [formDataProject, updateFormDataProject] = useState(initialFormDataProject)
    const [edit] = useState(true)
    const [box2, setBox2] = useState("Taxpayer-num")
    const [box3, setBox3] = useState("Register-capital")
    const [boxLa, setBoxLa] = useState("Agent")
    const [sendTo, setSendTo] = useState(2)
    const [count, setCount] = useState(0)
    const [docName, setDocName] = useState(initialDocData)
    const [listenC, setListen] = useState("");
    const [genQo, setGenQo] = useState("");
    const [countQo, setCountQo] = useState(0);
    const [overHead, serOverHead] = useState(0);
    const [listenTotal, setListenTotal] = useState(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        async function fetchData() {
            const docRef1 = doc(db, "CustomersDetail", listenC);
            const docSnap = await getDoc(docRef1);
            if (docSnap.exists()) {
                setFormDataIn(docSnap.data())
                if (count <= 1) {
                    setCount(count + 1)
                }
            }
        }
        await fetchData()
    }, [count, listenC])


    useEffect(async () => {
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
            navigate('/lobby')
        }
    }, [navigate, user])

    useEffect(async () => {
        const docRef1 = collection(db, "PO");
        const docSnap = await getDocs(docRef1);
        if (countQo === 0){
            setGenQo(`${docSnap.docs.length+1}`+`${formDataProject.date}`+
                `${formDataProject.month}`+`${formDataProject.year}`)
        }
    }, [formDataProject, genQo, stateOfN, listenC])

    const handleCreate = () => {
        setOpen(true)
    }
    const handleCreateTwo = () => {
        setOpenTwo(true)
    }

    const listenChange = async (data) => {
        setListen(data)
    }

    const pull_total = async (data) => {
        setListenTotal(data)
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

    const handleChangeUpload = (e) => {
        setDocName({
            ...docName,
            [e.target.name]: e.target.value
        })
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleCloseTwo = () => {
        setOpenTwo(false)
        setDocName({
            ...docName,
            total: 0,
            labor: 0,
            material: 0,
            quantity: 1,
            totalUnitPrice: 0,
            total: 0
        })
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

    const handleChangePro = (e) => {
        updateFormDataProject({
            ...formDataProject,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (sendTo === 1) {
            sessionStorage.setItem('roomKeyCus', formData.v_box1 + formData.v_box2)
            const docRef1 = doc(db, "CustomersDetail", formData.v_box1 + formData.v_box2);
            await setDoc(docRef1, formData);
            setOpen(false)
        } else {
            sessionStorage.setItem('roomKeyCus', formData2.v_box1 + formData2.v_box2)
            const docRef1 = doc(db, "CustomersDetail", formData2.v_box1 + formData2.v_box2);
            await setDoc(docRef1, formData2);
            setOpen(false)
        }
    };

    const handleSubmitNext = async (e) => {
        e.preventDefault()
        if (stateOfN === false && formDataProject.projectName !== "" && formDataProject.subject !== ""
            && listenC !== "" && listenC !== null) {
            setCountQo(1)
            setStateOfN(true)
            let projectData = {
                ...formDataProject,
                ...formDataIn,
                genQo
            }
            const docRef1 = doc(db, "PO", genQo);
            await setDoc(docRef1, projectData);
        }else {
            toast.error('Please Fill in all the value', {position: toast.POSITION.BOTTOM_CENTER});
        }
    };

    const handleSubmitPrice = async (e) => {
        e.preventDefault()
        const docRef1 = doc(db, "PO", genQo, "Quotation", genQo);
        await setDoc(docRef1, {genQo, "payment": formDataProject.payment});
        const docRef2 = doc(db, "PO", genQo, "Quotation", genQo, "work", docName.description);
        await setDoc(docRef2, docName);
        setOpenTwo(false)
        setDocName({
            ...docName,
            labor: 0,
            material: 0,
            quantity: 1,
            totalUnitPrice: 0,
            total: 0
        })
    };

    const handleCancelNext = async (e) => {
        e.preventDefault()
        if (stateOfN === true) {
            setStateOfN(false)
        }
    };

    const createPDF = async () => {
        var originalTitle = document.title;
        document.title = '\u00A0';
        window.print();
        document.title = originalTitle;
      };

    const handleGoNext = async () => {
        if (stateOfN === false && formDataProject.projectName !== "" && formDataProject.subject !== ""
            && listenC !== "" && listenC !== null) {
            const docRef1 = doc(db, "PO", genQo, "Quotation", genQo);
            await setDoc(docRef1, {genQo, "payment": formDataProject.payment});
            navigate("/insideQuotation")
            sessionStorage.setItem("projectID", genQo)
        }else {
            toast.error('Please Fill in all the value', {position: toast.POSITION.BOTTOM_CENTER});
        }
        
    };

    return (
        <CustomerWrapper>
            <div className="heading-container mt-1 d-flex justify-content-end pt-1 no-print" id="no-print">
                <div className="col d-flex justify-content-end flex-row-reverse align-items-center customer-box-sl" id="no-print">
                    <div className="col p-0" id="no-print">
                        <div className="col p-0 d-flex justify-content-start" id="no-print">
                            <Button variant="contained" className="mx-2 px-3 cs-add-btn confirm" color="primary"
                                    onClick={handleSubmitNext} type="submit" disabled={stateOfN}
                                    size="small">Confirm
                            </Button>
                            <Button variant="contained" className="px-3 cs-add-btn edit" color="secondary"
                                    onClick={handleCancelNext} type="submit" disabled={!stateOfN}
                                    size="small">Edit
                            </Button>
                        </div>
                    </div>
                    <ComboBox func={listenChange} dis={stateOfN}/>
                </div>
                <div className="row px-2" id="no-print">
                    <div className="p-0 d-flex justify-content-between align-items-center">
                        <IconButton variant="outlined" className="px-3 cs-add-btn" color="error"
                                    onClick={handleCreate}
                                    size="small"><p4 className="">Add Customer</p4></IconButton>
                    </div>
                    
                </div>
            </div>
            <div className="wrapper-box pt-4" id="pdf">
                <div className="container pt-5 mb-3 bg-white">
                    <div className="wrapper-header d-flex justify-content-between align-items-start px-4 mb-1">
                        <div className="img-box"><img src="../../asq-logo.png" width="80"/></div>
                        <div className="wrap-text d-flex flex-column">
                            <p3 className="pb-1">ใบเสนอราคา/ใบสั่งซื้อ</p3>
                            <p3 className="pb-1">Quotation/Purchase Order</p3>
                            <div className="wrap-input d-flex align-items-center justify-content-between">
                                <p3>เลขที่/No. :</p3>
                                <TextField inputProps={{
                                    style: {
                                        height: "16px",
                                    },
                                }} variant="standard"
                                    name="qu_number" className="inp-box" value={genQo}
                                />
                            </div>
                            <div className="wrap-input d-flex align-items-center">
                                <p3>วันที่/Date :</p3>
                                <TextField inputProps={{
                                    style: {
                                        height: "16px",
                                    },
                                }} variant="standard"
                                    name="qu_number" className="inp-box" value={formDataProject.date.toString() + "/" + formDataProject.month.toString().padStart(2, "0") + "/" + formDataProject.year.toString()}
                                />
                            </div>
                        </div>
                    </div>
                    <form>
                        <div className="row mt-3 d-flex justify-content-center mb-2">
                            <div className="col d-flex flex-row mx-2 align-items-center">
                                {/* <h6 className="pt-1 pt-md-1">Customer-info:</h6> */}
                                <p3 className="txt-hd">Attn.: </p3>
                                <div className="col p-0">
                                    <div className="col pt-1 col-md-12">
                                        <TextField id="v_box1" type="search" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "16px",
                                                color: "#000000"
                                            },
                                        }} variant="standard"
                                                   name="v_box1" label="" className="w-100" required
                                                   value={formDataIn.v_box1} disabled={true}/>
                                    </div>
                                </div>
                                {/* <div className="col p-0">
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
                                </div> */}
                            </div>
                            <div className="row">
                                <div className="col px-2 d-flex flex-row align-items-center">
                                    <p3 className="txt-hd"></p3>
                                    <div className="col p-0">
                                        <div className="col ">
                                            <TextField id="v_box7" type="search" InputLabelProps={{
                                                shrink: true,
                                            }} inputProps={{
                                                style: {
                                                    height: "16px",
                                                    color: "#000000"
                                                },
                                            }} variant="standard"
                                                    name="v_box7" label="" className="w-100" required
                                                    value={formDataIn.v_box7} disabled={edit}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col px-2 d-flex flex-row align-items-center">
                                    <p3 className="txt-hd">Tel. :</p3>
                                    <div className="col p-0">
                                        <TextField id="v_box5" type="search" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "16px",
                                                color: "#000000",
                                            },
                                        }} variant="standard"
                                                   name="v_box5" label="" className="w-100" required
                                                   value={formDataIn.v_box5} disabled={edit}/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col px-2 d-flex flex-row align-items-center">
                                {box3 == "email" ? (
                                    <p3 className="txt-hd">{box3.toUpperCase()}: </p3>
                                    ) : (
                                        <></>
                                    )}
                                    {box3 == "email" ? (
                                    <div className="col p-0">
                                        <TextField id="v_box3" type="search" InputLabelProps={{
                                            shrink: true,       
                                        }} inputProps={{
                                                style: {
                                                height: "16px",
                                                color: "#000000"
                                            },
                                        }} variant="standard"
                                               name="v_box3" label="" className="w-100" required
                                               value={formDataIn.v_box3} disabled={edit}/>
                                    </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                {/* <div className="col p-0">
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
                                </div> */}
                                
                            </div>
                            <div className="row">
                                <div className="col px-2 d-flex flex-row align-items-center">
                                    <p3 className="txt-hd">Subject: </p3>
                                    <div className="col p-0">
                                        <TextField type="search" onChange={handleChangePro} InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "16px",
                                                color: "#000000"
                                            },
                                        }} variant="standard"
                                                name="subject" label="" className="w-100" required disabled={stateOfN}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4 px-2 d-flex flex-row align-items-center">
                                    <p3 className="txt-hd">Project No.: </p3>
                                    <div className="col p-0 pt-1">
                                        <TextField type="search" onChange={handleChangePro} InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "16px",
                                                color: "#000000"
                                            },
                                        }} variant="standard"
                                                name="projectNo" label="" className="w-100" required disabled={stateOfN}
                                        />
                                    </div>
                                </div>
                                <div className="col px-2 d-flex flex-row align-items-center">
                                    <p3 className="txt-hd">Project Name:</p3>
                                    <div className="col p-0 pt-1">
                                        <TextField type="search" onChange={handleChangePro} InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "16px",
                                                color: "#000000"
                                            },
                                        }} variant="standard"
                                                name="projectName" label="" className="w-100" required disabled={stateOfN}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className="row m-2 mt-0 mb-0 wrap-text">
                        <p3 className="p-0">บริษัทฯ ยินดีเสนอราคาสินค้าดังรายการต่อไปนี้</p3>
                    </div>
                    <div className="container-fluid p-0">
                        <div className="row m-2 pt-1 mb-0 mt-0 table-responsive">

                            <table className="qa-table splitForPrint">
                            <thead className="bg-dark text-light">
                                    <tr>
                                        <th scope="col" rowspan="2" className="w-45">No.</th>
                                        <th scope="col" rowspan="2" className="w-desc">Description</th>
                                        <th scope="col" rowspan="2" className="w-price">Quantity</th>
                                        <th scope="col" rowspan="2" className="w-price">Unit</th>
                                        <th scope="col" colspan="2" className="">Unit Price</th>
                                        <th scope="col" rowspan="2" className="w-12">Total <br/>Unit Price</th>
                                        <th scope="col" rowspan="2" className="w-12">Total</th>
                                    </tr>
                                    <tr>
                                        <th scope="col" className="w-1">Labour</th>
                                        <th scope="col" className="w-1">Material</th>
                                    </tr>
                                </thead>
                                <FormC roomCode={genQo} reOpen={openTwo} func={pull_total}/>
                                <tbody className="min-h">
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </tbody>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td className="ta-r px-2">Total</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td  className="ta-r px-2">{listenTotal.toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                                    </tr> 
                                    <tr>
                                        <td></td>
                                        <td className="ta-r px-2">Overhead</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className="ta-r px-2"> %</td>
                                        <td className="ta-r px-2"></td>
                                    </tr> 
                                    <tr>
                                        <td></td>
                                        <td className="ta-r px-2">Special discount</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className="ta-r px-2">-</td>
                                        <td className="ta-r px-2"></td>
                                    </tr> 
                                    <tr>
                                        <td></td>
                                        <td className="ta-r px-2">Total before VAT (7%)</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className="ta-r px-2"></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td className="ta-r px-2">VAT (7%)</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className="ta-r px-2"></td>
                                        <td></td>
                                    </tr> 
                                    <tr className="hs-border">
                                        <td colspan="2" className="ta-border"></td>
                                        <td colspan="5" className="ta-border"></td>
                                        <td colspan="1" className="ta-border"></td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                        <div className="row m-2 justify-content-end mt-0" id="no-print">
                            <div className="col-2 p-0 mx-md-1 col-md-1 mx-2">
                                <Button variant="outlined" className="w-100" color="primary" onClick={handleCreateTwo}
                                        size="small"><AddIcon/>
                                </Button>
                            </div>
                        </div>
                        <div className="row mx-2 mb-5 wrap-text">
                            <p3>Validity: 30 Days From qouted</p3>
                            <p3>Delivery: 90 Days after confirmation by purchase order</p3>
                            <div className="col px-1 d-flex flex-row align-items-end">
                                    <p3 className="mx-2">Payment: </p3>
                                    <div className="col p-0">
                                        <TextField name="payment" type="text" variant="standard" onChange={handleChangePro} InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "10px",
                                            },
                                        }}
                                                   label=""
                                                   className="px-1 w-100"
                                                   required
                                                   />
                                    </div>
                                </div>
                        </div>
                        <div className="row wrap-text sign-namebox d-flex justify-content-center">
                            <div className="line"></div>
                            <p3 className="txt-sty">(อธีร์ศิรินภาพันธ์)</p3>
                            <p3 className="txt-sty">Project Director</p3>
                        </div>
                        <div className="row m-2 pb-4">
                            <p2>บริษัท เอ สแควร์จํากัด</p2>
                            <p2>A SQUARE LIMITED.</p2>
                            <p2>26 ซอยนวมินทร์86 แขวงรามอินทรา เขตคันนายาว กรุงเทพฯ 10230</p2>
                            <p2>26 Soi Nawamin 86 Ram Intra, Khan Na Yao, BANGKOK 10230</p2>
                            <p2>Tel: (662) 0-2542-2108-9 ;Email: pracha.imail@gmail.com; www.asquare.co.th</p2>
                        </div>
                    </div>
                </div>
                    <div className="row justify-content-end mx-900 pb-4" id="no-print">
                        <div className="col-4 p-0 mt-2 col-md-2 mx-1">
                            <Button variant="contained" className="w-100 cs-add-btn confirm" color="primary" onClick={createPDF}
                                size="small">Save pdf
                            </Button>
                        </div>
                    </div>
                    {stateOfN?(
                    <div className="row m-1 mt-0 justify-content-end" id="no-print">
                        <div className="col-4 p-0 mt-2 col-md-2 mx-1">
                            <Button variant="contained" className="w-100 cs-add-btn confirm" color="primary" onClick={handleGoNext}
                                size="small">Finish
                            </Button>
                        </div>
                    </div>)
                    :(<></>)}

            </div>
            <Modal
                open={openTwo}
                onClose={handleCloseTwo}
                className="d-flex justify-content-center align-items-center"

            >

                <form className="border border-secondary p-2 m-2 rounded-2 row bg-white py-4 " style={{maxWidth: "900px"}}>
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
            <Modal
                open={open}
                onClose={handleClose}
                className="d-flex justify-content-center align-items-center"

            >

                <form className="border border-secondary p-4 m-2 rounded-2 row bg-white" style={{maxWidth: "900px"}}>
                    <div className="heading-container mt-2 d-flex justify-content-start">
                        <h3>Customer</h3>
                        <Button type="submit" variant="outlined" color="warning" className="mx-2 m"
                                onClick={handleChangeToOrg}>
                            Org
                        </Button>
                        <Button type="submit" variant="outlined" color="success" className="mx-1 m"
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
