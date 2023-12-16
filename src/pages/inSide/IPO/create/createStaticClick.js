import * as React from "react";
import {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "../../../../context/UserContexts";
import {Button, TextField, InputAdornment} from "@mui/material";
import db from "../../../../config/firebase-config"
import {collection, doc, getDoc, setDoc, updateDoc} from "firebase/firestore"
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CustomerWrapper from "./CustomerWrapper";
import FormPStatic2 from "./formPStatic2";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@material-ui/core/Modal";
import { ToWords } from 'to-words';


export default function Customer(props) {

    const initialFormDataProject = Object.freeze({
        genQo: "",
        payment: "",
        payment2: "",
        payment3: "",
        payment4: "",
        payment5: "",
        overhead: 0,
        specialdiscount: 0,
        validity: "",
        delivery: ""
    });

    const initialDocData = Object.freeze({
        description: "",
        quantity: 1,
        unit: "",
        labor: 0,
        material: 0
    });

    const navigate = useNavigate()
    const {user} = useUserContext()
    const [formDataIn, setFormDataIn] = useState([])
    const [formDataIn2, setFormDataIn2] = useState(initialFormDataProject)
    const [edit] = useState(true)
    const [box2, setBox2] = useState("Taxpayer-num")
    const [box3, setBox3] = useState("email")
    const [boxLa, setBoxLa] = useState("Agent")
    const [numWord, setNumword] = useState("Zero")
    const [count, setCount] = useState(0)
    const [listenC, setListen] = useState("");
    const [listenTotal, setListenTotal] = useState(0);
    const myTable = useRef(null);
    const myAllTable = useRef(null);
    const [height, setHeight] = useState({});
    const [t_height, setTHeight] = useState({});
    const [openTwo, setOpenTwo] = useState(false)
    const [docName, setDocName] = useState(initialDocData)
    const [stateOfAD, setStateOfAD] = useState(false)
    const [stateOfDA, setStateOfDA] = useState(false)
    const role = sessionStorage.getItem("role")

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

    useEffect(async () => {
        const docRef1 = doc(db, "PO", sessionStorage.getItem("projectID"), "Quotation", sessionStorage.getItem("quotationID"));
        const docSnap = await getDoc(docRef1);
        if (docSnap.exists()) {
            setFormDataIn2(docSnap.data())
        }
        if(formDataIn2.status === "Approved"){
            setStateOfAD(true)
            setStateOfDA(false)
        }else if(formDataIn2.status === "Denied"){
            setStateOfAD(false)
            setStateOfDA(true)
        }
    }, [])

    useEffect(() => {
        if (formDataIn.type === "Private") {
            setBox2("surname")
            setBox3("email")
            setBoxLa("nickname")
        } else {
            setBoxLa("nickname")
            setBox3("email")
            setBox2("taxpayerNum")
        }

    }, [count, formDataIn.type, listenC])

    useEffect(() => {
        if (!user) {
            navigate('/')
        }
        window.scrollTo(0, 0)
    }, [navigate, user])

    const handleGoNext = async () => {
        navigate("/insideQuotation")
        sessionStorage.setItem("projectID", formDataIn.genQo)
        const docRef1 = doc(db, "PO", sessionStorage.getItem("projectID"), "Quotation", sessionStorage.getItem("quotationID"));
        await setDoc(docRef1, formDataIn2);
    };

    const pull_total = async (data) => {
        setListenTotal(data)
        var total = (((listenTotal+(listenTotal*(formDataIn2.overhead/100)||0)||0)-(formDataIn2.specialdiscount||0))*1.07)
        total = Math.round(total*100)/100
        const toWords = new ToWords({localeCode: 'en-US', });
        var words = toWords.convert(parseFloat(total))
        setNumword(words)
    }

    const createPDF = async () => {
        var total_h = myAllTable.current.clientHeight;
        console.log("ni", total_h)
        await handlePrint(total_h);
        var originalTitle = document.title;
        document.title = '\u00A0';
        window.print();
        document.title = originalTitle;
        await handleClosePrint();
      };
    
    const handlePrint = async (total_h) => {
        //11 decrease 10 px
        //
        var heightT_o = myTable.current.clientHeight;
        if(heightT_o <= 337){
            setHeight({
                "height": (325 - heightT_o) + "px"
              });
              setTHeight({
                "height": "500" + "px"
            });
        }else if(heightT_o <= 1373){
            setHeight({
                "height": (1373 - heightT_o) + "px"
              });
              setTHeight({
                "height": "1740" + "px"
            });
        }else if(heightT_o <= 2430){
            setHeight({
                "height": (2425 - heightT_o) + "px"
              });
        }else if(heightT_o <= 3430){
            setHeight({
                "height": (3425 - heightT_o) + "px"
              });
        }else{
            setHeight({
                "height": (heightT_o) + "px"
              });
        }
    }

    const handleClosePrint = async () => {
        setHeight({});
        setTHeight({});
    }

    const handleCreateTwo = () => {
        setOpenTwo(true)
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

    const handleChangeUpload = (e) => {
        setDocName({
            ...docName,
            [e.target.name]: e.target.value
        })
    }

    const handleChangePro2 = (e) => {
        setFormDataIn2({
            ...formDataIn2,
            [e.target.name]: e.target.value
        })
    }

    const handleApprove = async (e) => {
        setStateOfAD(true)
        setStateOfDA(false)
        const docRef1 = doc(db, "PO", formDataIn.genQo, "Quotation", formDataIn2.genQo);
        await updateDoc(docRef1, {"status": "Approved"});
        setFormDataIn2({
            ...formDataIn2,
            "status": "Approved"
        })
    }

    const handleDenied = async (e) => {
        setStateOfAD(false)
        setStateOfDA(true)
        const docRef1 = doc(db, "PO", formDataIn.genQo, "Quotation", formDataIn2.genQo);
        await updateDoc(docRef1, {"status": "Denied"});
        setFormDataIn2({
            ...formDataIn2,
            "status": "Denied"
        })
    }

    const handleSubmitPrice = async (e) => {
        e.preventDefault()
        setOpenTwo(false)
        const docRef1 = doc(db, "PO", formDataIn.genQo, "Quotation", formDataIn2.genQo, "work", docName.description);
        await setDoc(docRef1, docName);
        setOpenTwo(false)
        setDocName({
            ...docName,
            labor: 0,
            material: 0,
            quantity: 1,
        })
    };

    const handleKeypress = e => {
        //it triggers by pressing the enter key
      if (e.keyCode === 13) {
        handleSubmitPrice();
      }
    };
      

    return (
        <CustomerWrapper>
            <div className="wrapper-box pt-4 pb-5">
                <h4 className="pt-1 pt-md-1 px-2 mb-2 mx-900" id="no-print">Quotation: {formDataIn2.genQo}</h4>
                <h4 className="pt-1 pt-md-1 px-2 mb-2 mx-900" id="no-print">Status: {formDataIn2.status || "Pending"}</h4>
                <div className="container px-3" id="pdf">
                    <div className="wrapper-header d-flex justify-content-between align-items-start mb-1 mx-2">
                        <div className="img-box px-1"><img src="../../asq-logo.png" width="75"/></div>
                        <div className="wrap-text d-flex flex-column">
                            <p3 className="pb-1">ใบเสนอราคา/ใบสั่งซื้อ</p3>
                            <p3 className="pb-1">Quotation/Purchase Order</p3>
                            <div className="wrap-input d-flex align-items-center justify-content-between mb-0">
                                <p3>เลขที่/No. :</p3>
                                <TextField inputProps={{
                                    style: {
                                        height: "16px",
                                    },
                                }} variant="standard"
                                    name="qu_number" className="inp-box wrap-textfield" value={formDataIn2.genQo}
                                />
                            </div>
                            {formDataIn.date ? (
                                    <div className="wrap-input d-flex align-items-center">
                                    <p3>วันที่/Date :</p3>
                                    <TextField inputProps={{
                                        style: {
                                            height: "16px",
                                        },
                                    }} variant="standard"
                                        name="qu_number" className="inp-box wrap-textfield" value={formDataIn.date.toString() + "/" + formDataIn.month.toString().padStart(2, "0") + "/" + formDataIn.year.toString()}
                                    />
                                </div>
                                    ) : (
                                        <></>
                                    )}
                            
                        </div>
                    </div>
                    <form>
                        <div className="row d-flex justify-content-center">
                            <div className="col d-flex flex-row mx-2 align-items-center">
                                {/* <h6 className="pt-1 pt-md-1">Customer-info:</h6> */}
                                <p3 className="txt-hd">Attn.: </p3>
                                <div className="col p-0">
                                    <div className="col col-md-12">
                                        <TextField id="v_box1" type="search" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "16px",
                                                color: "#000000"
                                            },
                                        }} variant="standard"
                                                   name="v_box1" label="" className="w-100 wrap-textfield" required
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
                                                    name="v_box7" label="" className="w-100 wrap-textfield" required
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
                                                   name="v_box5" label="" className="w-100 wrap-textfield" required
                                                   value={formDataIn.v_box5} disabled={edit}/>
                                    </div>
                                </div>
                                {/* <div className="col p-0">
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
                                </div> */}
                            </div>
                            <div className="row">
                                <div className="col px-2 d-flex flex-row align-items-center">
                                
                                    <p3 className="txt-hd">{box3.toUpperCase()}: </p3>
                                    
                                    
                                    <div className="col p-0">
                                        <TextField id="v_box3" type="search" InputLabelProps={{
                                            shrink: true,       
                                        }} inputProps={{
                                                style: {
                                                height: "16px",
                                                color: "#000000"
                                            },
                                        }} variant="standard"
                                               name="v_box3" label="" className="w-100 wrap-textfield" required
                                               value={formDataIn.v_box3} disabled={edit}/>
                                    </div>
                                    
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
                                <div className="row">
                                    <div className="col px-2 d-flex flex-row align-items-center">
                                        <p3 className="txt-hd">Subject: </p3>
                                        <div className="col p-0">
                                            <TextField type="search" InputLabelProps={{
                                                shrink: true,
                                            }} inputProps={{
                                                style: {
                                                    height: "16px",
                                                    color: "#000000"
                                                },
                                            }} variant="standard"
                                                    name="subject" label="" className="w-100 wrap-textfield" value={formDataIn.subject} required disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-4 px-2 d-flex flex-row align-items-center">
                                        <p3 className="txt-hd">Project No.: </p3>
                                        <div className="col p-0">
                                            <TextField type="search" InputLabelProps={{
                                                shrink: true,
                                            }} inputProps={{
                                                style: {
                                                    height: "16px",
                                                    color: "#000000"
                                                },
                                            }} variant="standard"
                                                    name="projectNo" label="" className="w-100 wrap-textfield" required disabled={true} value={formDataIn.genQo}
                                            />
                                        </div>
                                    </div>
                                    <div className="col px-2 d-flex flex-row align-items-center">
                                        <p3 className="txt-hd">Project Name:</p3>
                                        <div className="col p-0">
                                            <TextField type="search" InputLabelProps={{
                                                shrink: true,
                                            }} inputProps={{
                                                style: {
                                                    height: "16px",
                                                    color: "#000000"
                                                },
                                            }} variant="standard"
                                                    name="projectName" label="" className="w-100 wrap-textfield" value={formDataIn.projectName} required disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className="row mx-2 mt-1 wrap-text">
                        <p3 className="p-0">บริษัทฯ ยินดีเสนอราคาสินค้าดังรายการต่อไปนี้</p3>
                    </div>
                    <div className="container-fluid p-0" ref={myAllTable} style={t_height}>
                        <div className="row m-2 pt-1 mb-0 mt-0"  >

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
                                        <th scope="col" rowspan="2" className="w-45 dlt-icon"></th>
                                    </tr>
                                    <tr>
                                        <th scope="col" className="w-1">Labour</th>
                                        <th scope="col" className="w-1">Material</th>
                                    </tr>
                                </thead>
                                <tbody ref={myTable}>
                                    <FormPStatic2 func={pull_total} reOpen={openTwo}/>
                                </tbody>
                                <tbody className="min-h" style={height}>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th className="dlt-icon"></th>
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
                                        <td className="dlt-icon"></td>
                                    </tr> 
                                    <tr>
                                        <td></td>
                                        <td className="ta-r px-2">Overhead</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className="ta-r px-2"> 
                                        <TextField name="overhead" type="text" variant="standard" onChange={handleChangePro2}
                                            InputProps={{
                                                endAdornment: <InputAdornment className="p-0 m-0 wrap-textfield" position="end">%</InputAdornment>
                                            }}
                                            inputProps={{
                                                style: {
                                                    color: "#000000",
                                                    height: "10px",
                                                    textAlign: "right"
                                                }
                                            }}
                                            className="w-100 ta-r wrap-textfield" value={formDataIn2.overhead || 0}>
                                            </TextField>
                                        </td>
                                        <td className="ta-r px-2">{((((formDataIn2.overhead/100)*listenTotal) || 0) + listenTotal).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                                        <td className="dlt-icon"></td>
                                    </tr> 
                                    <tr>
                                        <td></td>
                                        <td className="ta-r px-2">Special discount</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className="ta-r px-2">
                                            <TextField name="specialdiscount" type="text" variant="standard" onChange={handleChangePro2}
                                            inputProps={{
                                                style: {
                                                    color: "#000000",
                                                    height: "10px",
                                                    textAlign: "right"
                                                }
                                            }}
                                            className="w-100 ta-r wrap-textfield" value={formDataIn2.specialdiscount}>

                                            </TextField>
                                        </td>
                                        <td className="ta-r px-2">{(((((formDataIn2.overhead/100)*listenTotal) || 0 )+ listenTotal) - (formDataIn2.specialdiscount || 0)).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                                        <td className="dlt-icon"></td>
                                    </tr> 
                                    <tr>
                                        <td></td>
                                        <td className="ta-r px-2">Total before VAT (7%)</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className="ta-r px-2"></td>
                                        <td className="ta-r px-2">{(((((formDataIn2.overhead/100)*listenTotal) || 0 )+ listenTotal) - (formDataIn2.specialdiscount || 0)).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                                        <td className="dlt-icon"></td>
                                    </tr>
                                    <tr className="py-2">
                                        <td></td>
                                        <td className="ta-r px-2">VAT (7%)</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className="ta-r px-2">{((((((formDataIn2.overhead/100)*listenTotal) || 0 )+ listenTotal) - (formDataIn2.specialdiscount || 0))*0.07).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                                        <td className="ta-r px-2">{((((((formDataIn2.overhead/100)*listenTotal) || 0 )+ listenTotal) - (formDataIn2.specialdiscount || 0))*1.07).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                                        <td className="dlt-icon"></td>
                                    </tr> 
                                    <tr className="hs-border">
                                        <td colspan="2" className="ta-border px-2"></td>
                                        <td colspan="5" className="ia ta-border text-center px-2">{numWord} THB</td>
                                        <td colspan="1" className="ta-border ta-r px-2">{((((((formDataIn2.overhead/100)*listenTotal) || 0 )+ listenTotal) - (formDataIn2.specialdiscount || 0))*1.07).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                                        <td className="dlt-icon"></td>
                                    </tr>
                                </tbody>
                            </table>
                            
                        </div>
                        <div className="row mx-2 justify-content-end mt-0" id="no-print">
                            <div className="col-2 p-0 mx-md-1 col-md-1 mx-2">
                                <Button variant="outlined" className="w-100" color="primary" onClick={handleCreateTwo}
                                        size="small"><AddIcon/>
                                </Button>
                            </div>
                        </div>
                        <div className="row p-0 wrap-text t-left mx-2">
                        <div className="col-12 p-0 d-flex flex-row align-items-center">
                                <p3 className="mr-2">Validity: </p3>
                                <div className="col p-0">
                                    <TextField name="validity" type="text" variant="standard" InputLabelProps={{
                                        shrink: true,
                                    }} inputProps={{
                                        style: {
                                            height: "8px",
                                        },
                                    }}
                                            onChange={handleChangePro2}
                                            value={formDataIn2.validity}
                                            disabled={false}
                                            className="w-100 px-1 wrap-textfield py-0"
                                            required
                                    />
                                </div>
                            </div>
                            <div className="col-12 p-0 d-flex flex-row align-items-center">
                                <p3 className="mr-2">Delivery: </p3>
                                <div className="col p-0">
                                    <TextField name="delivery" type="text" variant="standard" InputLabelProps={{
                                        shrink: true,
                                    }} inputProps={{
                                        style: {
                                            height: "8px",
                                        },
                                    }}
                                            onChange={handleChangePro2}
                                            value={formDataIn2.delivery}
                                            disabled={false}
                                            className="w-100 px-1 wrap-textfield"
                                            required
                                    />
                                </div>
                            </div>
                            <div className="col-12 p-0 d-flex flex-row align-items-center">
                                <p3 className="mr-2">Payment: </p3>
                                <div className="col p-0">
                                    <TextField name="payment" type="text" variant="standard" InputLabelProps={{
                                        shrink: true,
                                    }} inputProps={{
                                        style: {
                                            height: "8px",
                                        },
                                    }}
                                            onChange={handleChangePro2}
                                            value={formDataIn2.payment}
                                            disabled={false}
                                            className="w-100 px-1 wrap-textfield"
                                            required
                                    />
                                </div>
                            </div>
                            <div className="col-12 p-0 d-flex flex-row align-items-center">
                                <p3 className="mr-2"></p3>
                                <div className="col p-0">
                                    <TextField name="payment2" type="text" variant="standard" InputLabelProps={{
                                        shrink: true,
                                    }} inputProps={{
                                        style: {
                                            height: "8px",
                                        },
                                    }}
                                            onChange={handleChangePro2}
                                            value={formDataIn2.payment2}
                                            disabled={false}
                                            className="w-100 px-1 wrap-textfield"
                                            required
                                    />
                                </div>
                            </div>
                            <div className="col-12 p-0 d-flex flex-row align-items-center">
                                <p3 className="mr-2"></p3>
                                <div className="col p-0">
                                    <TextField name="payment3" type="text" variant="standard" InputLabelProps={{
                                        shrink: true,
                                    }} inputProps={{
                                        style: {
                                            height: "8px",
                                        },
                                    }}
                                            onChange={handleChangePro2}
                                            value={formDataIn2.payment3}
                                            disabled={false}
                                            className="w-100 px-1 wrap-textfield"
                                            required
                                    />
                                </div>
                            </div>
                            <div className="col-12 p-0 d-flex flex-row align-items-center">
                                <p3 className="mr-2"></p3>
                                <div className="col p-0">
                                    <TextField name="payment4" type="text" variant="standard" InputLabelProps={{
                                        shrink: true,
                                    }} inputProps={{
                                        style: {
                                            height: "8px",
                                        },
                                    }}
                                            onChange={handleChangePro2}
                                            value={formDataIn2.payment4}
                                            disabled={false}
                                            className="w-100 px-1 wrap-textfield"
                                            required
                                    />
                                </div>
                            </div>
                            <div className="col-12 p-0 d-flex flex-row align-items-center">
                                <p3 className="mr-2"></p3>
                                <div className="col p-0">
                                    <TextField name="payment5" type="text" variant="standard" InputLabelProps={{
                                        shrink: true,
                                    }} inputProps={{
                                        style: {
                                            height: "8px",
                                        },
                                    }}
                                            onChange={handleChangePro2}
                                            value={formDataIn2.payment5}
                                            disabled={false}
                                            className="w-100 px-1 wrap-textfield"
                                            required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="row wrap-text sign-namebox d-flex justify-content-center">
                                <div className="line"></div>
                                <p3 className="txt-sty">(อธีร์ ศิรินภาพันธ์)</p3>
                                <p3 className="txt-sty">Project Director</p3>
                            </div>
                            <div className="row p-0 mx-2">
                                <p2 className="p-0">บริษัท เอ สแควร์จํากัด</p2>
                                <p2 className="p-0">A SQUARE LIMITED.</p2>
                                <p2 className="p-0">26 ซอยนวมินทร์86 แขวงรามอินทรา เขตคันนายาว กรุงเทพฯ 10230</p2>
                                <p2 className="p-0">26 Soi Nawamin 86 Ram Intra, Khan Na Yao, BANGKOK 10230</p2>
                                <p2 className="p-0">Tel: (662) 0-2542-2108-9 ;Email: pracha.imail@gmail.com; www.asquare.co.th</p2>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
                
            </div>
            <footer className="footer mb-2" id="no-print">
                
            <div className="row justify-content-end wrap-box" id="no-print">
                <div className="row p-0 justify-content-end" id="no-print">
                        {role === "Admin"?(<div className="col-4 wrap-btnfooter p-0 col-md-2">
                            <Button variant="contained" className="w-100 confirm mx-wbtn" color="primary" onClick={handleApprove}
                                size="small" disabled={stateOfAD}>Approve
                            </Button>
                        </div>):(<></>)}
                        {role === "Admin"?(<div className="col-4 wrap-btnfooter p-0 col-md-2 mx-1">
                            <Button variant="outlined" className="w-100 confirm mx-wbtn" color="error" onClick={handleDenied}
                                size="small" disabled={stateOfDA}>Deny
                            </Button>
                        </div>):(<></>)}
                        <div className="col-4 wrap-btnfooter p-0 col-md-2 ms-auto">
                            <Button variant="contained" className="w-100 cs-add-btn confirm mx-wbtn" color="primary" onClick={createPDF}
                                size="small">Save pdf
                            </Button>
                        </div>
                        <div className="col-4 wrap-btnfooter p-0 col-md-2 mx-1">
                        <Button variant="contained" className="w-100 cs-add-btn confirm mx-wbtn" color="primary" onClick={handleGoNext}
                                size="small">Finish
                        </Button>
                        </div>
                        
                    </div>
                </div>
            </footer>
            <Modal
                open={openTwo}
                onClose={handleCloseTwo}
                className="d-flex justify-content-center align-items-center"
                onKeyDown={handleKeypress}
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
                                                   onKeyDown={handleKeypress}
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
                                                   onKeyDown={handleKeypress}
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
                            <Button type="button" variant="contained" color="error" className="mx-3 col-3"
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
