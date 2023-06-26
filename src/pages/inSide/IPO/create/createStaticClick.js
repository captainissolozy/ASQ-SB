import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "../../../../context/UserContexts";
import {Button, TextField} from "@mui/material";
import db from "../../../../config/firebase-config"
import {doc, getDoc} from "firebase/firestore"
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CustomerWrapper from "./CustomerWrapper";
import FormPStatic2 from "./formPStatic2";



export default function Customer(props) {

    const navigate = useNavigate()
    const {user} = useUserContext()
    const [formDataIn, setFormDataIn] = useState([])
    const [formDataIn2, setFormDataIn2] = useState([])
    const [edit] = useState(true)
    const [box2, setBox2] = useState("Taxpayer-num")
    const [box3, setBox3] = useState("Register-capital")
    const [boxLa, setBoxLa] = useState("Agent")
    const [count, setCount] = useState(0)
    const [listenC, setListen] = useState("");

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
    }, [])

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

    const handleGoNext = async () => {
        navigate("/insideQuotation")
        sessionStorage.setItem("projectID", formDataIn.genQo)
    };

    return (
        <CustomerWrapper>
            <div className="wrapper-box">
                <h4 className="pt-1 pt-md-1 px-2 mb-4">Quotation: {formDataIn2.genQo}</h4>
                <div className="container pt-5 mb-3">
                    <div className="wrapper-header d-flex justify-content-between align-items-start px-4 mb-3">
                        <div className="img-box"><img src="../../asq-logo.png" width="80"/></div>
                        <div className="wrap-text d-flex flex-column">
                            <p3>ใบเสนอราคา/ใบสั่งซื้อ</p3>
                            <p3>Quotation/Purchase Order</p3>
                            <div className="wrap-input d-flex align-items-end justify-content-between">
                                <p3>เลขที่/No. :</p3>
                                <TextField inputProps={{
                                    style: {
                                        height: "16px",
                                    },
                                }} variant="standard"
                                    name="qu_number" className="inp-box" value=""
                                />
                            </div>
                            <div className="wrap-input d-flex align-items-end">
                                <p3>วันที่/Date :</p3>
                                <TextField inputProps={{
                                    style: {
                                        height: "16px",
                                    },
                                }} variant="standard"
                                    name="qu_number" className="inp-box" value=""
                                />
                            </div>
                        </div>
                    </div>
                    <form>
                        <div className="row mt-3 d-flex justify-content-center">
                            <div className="col d-flex flex-row mx-2 align-items-center mb-2">
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
                                <div className="col px-2 mb-2 d-flex flex-row align-items-center">
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
                                <div className="col px-2 mb-2 d-flex flex-row align-items-center">
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
                                <div className="col px-2 mb-2 d-flex flex-row align-items-center">
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
                                <div className="row mb-3">
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
                                                    name="subject" label="" className="w-100" value={formDataIn.subject} required disabled={true}
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
                                                    name="projectNo" label="" className="w-100" required disabled={true}
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
                                                    name="projectName" label="" className="w-100" value={formDataIn.projectName} required disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className="container-fluid p-0">
                        <div className="row m-2 pt-1 mb-0">

                            <table className="qa-table">
                                <thead className="bg-dark text-light">
                                <tr>
                                    <th scope="col" rowspan="2" className="t-stick px-2 py-2 w-45">No.</th>
                                    <th scope="col" rowspan="2" className="t-stick px-2 py-2 w-desc">Description</th>
                                    <th scope="col" rowspan="2" className="t-stick px-2 py-2 w-price">Quantity</th>
                                    <th scope="col" rowspan="2" className="t-stick px-2 py-2 w-price">Unit</th>
                                    <th scope="col" colspan="2" className="t-stick px-2 py-2">Unit Price</th>
                                    <th scope="col" rowspan="2" className="t-stick px-2 py-2 w-12">Total <br/>Unit Price</th>
                                    <th scope="col" rowspan="2" className="t-stick px-2 py-2 w-12">Total</th>
                                </tr>
                                <tr>
                                    <th scope="col" className="t-stick px-2 py-2 w-1">Labour</th>
                                    <th scope="col" className="t-stick px-2 py-2 w-1">Material</th>
                                </tr>
                                </thead>
                                <FormPStatic2/>
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
                                        <td className="ta-r px-2 py-2">Total</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td  className="ta-r px-2 py-2"></td>
                                    </tr> 
                                    <tr>
                                        <td></td>
                                        <td className="ta-r px-2 py-2">Overhead</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className="ta-r px-2 py-2"> %</td>
                                        <td className="ta-r px-2 py-2"></td>
                                    </tr> 
                                    <tr>
                                        <td></td>
                                        <td className="ta-r px-2 py-2">Special discount</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className="ta-r px-2 py-2">
                                            <TextField name="special-discount" type="text" variant="standard" 
                                            inputProps={{
                                                style: {
                                                    color: "#000000",
                                                    height: "16px",
                                                    textAlign: "right"
                                                }
                                            }}
                                            className="w-100 ta-r">

                                            </TextField>
                                        </td>
                                        <td className="ta-r px-2 py-2"></td>
                                    </tr> 
                                    <tr>
                                        <td></td>
                                        <td className="ta-r px-2 py-2">Total before VAT (7%)</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className="ta-r px-2 py-2"></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td className="ta-r px-2 py-2">VAT (7%)</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className="ta-r px-2 py-2"></td>
                                        <td></td>
                                    </tr> 
                                    <tr className="hs-border">
                                        <td colspan="2" className="ta-border"></td>
                                        <td colspan="5" className="ta-border"></td>
                                        <td colspan="1" className="ta-border"></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="row p-0 mb-5 wrap-text">
                                <p3>Validity: 30 Days From qouted</p3>
                                <p3>Delivery: 90 Days after confirmation by purchase order</p3>
                                <div className="col px-1 d-flex flex-row align-items-end">
                                        <p3 className="mx-2">Payment: </p3>
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
                                                    className="w-100 px-1"
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
                            <div className="row p-0 pb-4">
                                <p2>บริษัท เอ สแควร์จํากัด</p2>
                                <p2>A SQUARE LIMITED.</p2>
                                <p2>26 ซอยนวมินทร์86 แขวงรามอินทรา เขตคันนายาว กรุงเทพฯ 10230</p2>
                                <p2>26 Soi Nawamin 86 Ram Intra, Khan Na Yao, BANGKOK 10230</p2>
                                <p2>Tel: (662) 0-2542-2108-9 ;Email: pracha.imail@gmail.com; www.asquare.co.th</p2>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
                <div className="row m-1 mt-0 justify-content-end mb-4">
                    <div className="col-4 p-0 mt-2 col-md-2 mx-1">
                        <Button variant="contained" className="w-100 cs-add-btn confirm" color="secondary" onClick={handleGoNext}
                                size="small">Back
                        </Button>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </CustomerWrapper>

    );
}
