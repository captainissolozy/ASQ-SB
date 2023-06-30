import * as React from "react";
import {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "../../../../context/UserContexts";
import {Button, TextField, InputAdornment} from "@mui/material";
import db from "../../../../config/firebase-config"
import {collection, doc, getDoc, setDoc} from "firebase/firestore"
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CustomerWrapper from "./CustomerWrapper";
import FormPStatic2 from "./formPStatic2";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@material-ui/core/Modal";



export default function Customer(props) {

    const initialFormDataProject = Object.freeze({
        genQo: "",
        payment: "",
        overhead: 0,
        specialdiscount: 0,
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
    const [count, setCount] = useState(0)
    const [listenC, setListen] = useState("");
    const [listenTotal, setListenTotal] = useState(0);
    const myTable = useRef(null);
    const [height, setHeight] = useState({});
    const [openTwo, setOpenTwo] = useState(false)
    const [docName, setDocName] = useState(initialDocData)

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
        var heightT_o = myTable.current.clientHeight;
        if(heightT_o > 500 && heightT_o <= 700){
            setHeight({
                "min-height": 700 + "px"
              });
        }else if(heightT_o > 700 && heightT_o <= 1450){
            setHeight({
                "min-height": 1450 + "px"
              });
           
        }else if(heightT_o > 1450 && heightT_o <= 2150){
            setHeight({
                "min-height": 2150 + "px"
              });
        }else if(heightT_o > 2290 && heightT_o <= 3230){
            setHeight({
                "min-height": 3230 + "px"
              });
        }
    }, [count])

    useEffect(async () => {
        const docRef1 = doc(db, "PO", sessionStorage.getItem("projectID"), "Quotation", sessionStorage.getItem("quotationID"));
        const docSnap = await getDoc(docRef1);
        if (docSnap.exists()) {
            setFormDataIn2(docSnap.data())
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
    }, [navigate, user])

    const handleGoNext = async () => {
        navigate("/insideQuotation")
        sessionStorage.setItem("projectID", formDataIn.genQo)
    };

    const pull_total = async (data) => {
        setListenTotal(data)
    };

    const createPDF = async () => {
        var originalTitle = document.title;
        document.title = '\u00A0';
        window.print();
        document.title = originalTitle;
      };
    
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
        
        var heightT_o = myTable.current.clientHeight;
        if(heightT_o > 500 && heightT_o <= 800){
            setHeight({
                "min-height": 700 + "px"
              });
        }else if(heightT_o > 900 && heightT_o <= 1450){
            setHeight({
                "min-height": 1450 + "px"
              });
           
        }else if(heightT_o > 1450 && heightT_o <= 2150){
            setHeight({
                "min-height": 2150 + "px"
              });
        }else if(heightT_o > 2150 && heightT_o <= 3230){
            setHeight({
                "min-height": 3230 + "px"
              });
        }
    };
      

    return (
        <CustomerWrapper>
            <div className="wrapper-box pt-4">
                <h4 className="pt-1 pt-md-1 px-2 mb-4 mx-900" id="no-print">Quotation: {formDataIn2.genQo}</h4>
                <div className="container" id="pdf">
                    <div className="wrapper-header d-flex justify-content-between align-items-start mb-3 mx-2">
                        <div className="img-box"><img src="../../asq-logo.png" width="80"/></div>
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
                                                    name="projectNo" label="" className="w-100 wrap-textfield" required disabled={true}
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
                    <div className="container-fluid p-0">
                        <div className="row m-2 pt-1 mb-0 mt-0">

                            <table className="qa-table splitForPrint" ref={myTable} style={height}>
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
                                <FormPStatic2 func={pull_total} reOpen={openTwo}/>
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
                                        <td  className="ta-r px-2">{listenTotal}</td>
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
                                            className="w-100 ta-r wrap-textfield" value={formDataIn2.overhead}>
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
                                    <tr>
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
                                        <td colspan="2" className="ta-border"></td>
                                        <td colspan="5" className="ta-border"></td>
                                        <td colspan="1" className="ta-border ta-r px-2">{((((((formDataIn2.overhead/100)*listenTotal) || 0 )+ listenTotal) - (formDataIn2.specialdiscount || 0))*1.07).toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                                        <td className="dlt-icon"></td>
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
                        <div className="row p-0 mb-5 wrap-text t-left mt-1 mx-2">
                            <p3 className="p-0">Validity: 30 Days From qouted</p3>
                            <p3 className="p-0">Delivery: 90 Days after confirmation by purchase order</p3>
                            <div className="col p-0 d-flex flex-row align-items-center">
                                    <p3 className="mr-2 p-0">Payment: </p3>
                                    <div className="col p-0">
                                        <TextField name="payment" type="text" variant="standard" InputLabelProps={{
                                            shrink: true,
                                        }} inputProps={{
                                            style: {
                                                height: "10px",
                                            },
                                        }}
                                                label=""
                                                value={formDataIn2.payment}
                                                disabled={true}
                                                className="w-100 px-1 wrap-textfield"
                                                required
                                        />
                                    </div>
                                </div>
                        </div>
                        <div className="row wrap-text sign-namebox d-flex justify-content-center">
                            <div className="line"></div>
                            <p3 className="txt-sty">(อธีร์ ศิรินภาพันธ์)</p3>
                            <p3 className="txt-sty">Project Director</p3>
                        </div>
                        <div className="row p-0 pb-2 m-1 mx-2">
                            <p2 className="p-0">บริษัท เอ สแควร์จํากัด</p2>
                            <p2 className="p-0">A SQUARE LIMITED.</p2>
                            <p2 className="p-0">26 ซอยนวมินทร์86 แขวงรามอินทรา เขตคันนายาว กรุงเทพฯ 10230</p2>
                            <p2 className="p-0">26 Soi Nawamin 86 Ram Intra, Khan Na Yao, BANGKOK 10230</p2>
                            <p2 className="p-0">Tel: (662) 0-2542-2108-9 ;Email: pracha.imail@gmail.com; www.asquare.co.th</p2>
                        </div>
                    </div>
                    
                </div>
                <div className="row p-1 pt-0 justify-content-end mx-900" id="no-print">
                        <div className="col-4 p-0 mt-2 col-md-2 mx-1">
                            <Button variant="contained" className="w-100 cs-add-btn confirm" color="primary" onClick={createPDF}
                                size="small">Save pdf
                            </Button>
                        </div>
                    </div>
                <div className="row p-1 pt-0 justify-content-end pb-4 mx-900" id="no-print">
                    <div className="col-4 p-0 mt-2 col-md-2 mx-1">
                        <Button  variant="contained" className="w-100 cs-add-btn confirm" color="secondary" onClick={handleGoNext}
                                size="small">Back
                        </Button>
                    </div>
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
