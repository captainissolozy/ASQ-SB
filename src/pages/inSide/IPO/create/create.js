import * as React from "react";
import {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "../../../../context/UserContexts";
import {Button, IconButton, TextField, InputAdornment,  Select, MenuItem, FormControl, InputLabel} from "@mui/material";
import Modal from "@material-ui/core/Modal";
import db from "../../../../config/firebase-config"
import {collection, doc, getDoc, setDoc, getDocs, deleteDoc} from "firebase/firestore"
import FormC from "./formC";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CustomerWrapper from "./CustomerWrapper";
import AddIcon from "@mui/icons-material/Add";
import ComboBox from "./combobox";


export default function Customer() {

    const current = new Date();

    const initialFormData2 = Object.freeze({
        type: "Organization",
        v_box1: "",
        v_box2: "",
        v_box3: "",
        v_box4: "",
        v_box5: "",
        v_box6: "Pending",
        v_box7: ""
    });

    const initialFormData = Object.freeze({
        type: "Private",
        v_box1: "",
        v_box2: "",
        v_box3: "",
        v_box4: "",
        v_box5: "",
        v_box6: "Pending",
        v_box7: ""
    });

    const initialFormDataProject = Object.freeze({
        subject: "",
        projectName: "",
        sales: sessionStorage.getItem("email"),
        date: current.getDate(),
        month: current.getMonth() + 1,
        year: current.getFullYear(),
        payment: "",
        overhead: 0,
        specialdiscount: 0,
        status: "Pending"
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
    const [box3, setBox3] = useState("E-Mail")
    const [boxLa, setBoxLa] = useState("Contact-Person")
    const [sendTo, setSendTo] = useState(2)
    const [count, setCount] = useState(0)
    const [docName, setDocName] = useState(initialDocData)
    const [listenC, setListen] = useState("");
    const [genQo, setGenQo] = useState("");
    const [countQo, setCountQo] = useState(0);
    const [overHead, serOverHead] = useState(0);
    const [listenTotal, setListenTotal] = useState(0);
    const [height, setHeight] = useState({});
    const myTable = useRef(null);

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
            setBox3("email")
            setBox2("taxpayerNum")
        }
    }, [count, formDataIn.type, listenC])

    useEffect(() => {
        if (!user) {
            navigate('/lobby')
        }
        window.scrollTo(0, 0)
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
        setBox3("email")
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
            const docRef2 = doc(db, "PO", genQo, "Quotation", genQo);
            await setDoc(docRef2);
        }else {
            toast.error('Please Fill in all the value', {position: toast.POSITION.BOTTOM_CENTER});
        }
    };

    const handleSubmitPrice = async (e) => {
        e.preventDefault();
        const docRef1 = doc(db, "PO", genQo, "Quotation", genQo);
        await setDoc(docRef1, {genQo, "payment": formDataProject.payment, "specialdiscount": formDataProject.specialdiscount, "overhead": formDataProject.overhead});
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
        if (formDataProject.projectName !== "" && formDataProject.subject !== "") {
            const docRef1 = doc(db, "PO", genQo, "Quotation", genQo);
            await setDoc(docRef1, {genQo, "payment": formDataProject.payment, "specialdiscount": formDataProject.specialdiscount, "overhead": formDataProject.overhead, "status": "Pending"});
            navigate("/insideQuotation")
            sessionStorage.setItem("projectID", genQo)
        }else {
            toast.error('Please Fill in all the value', {position: toast.POSITION.BOTTOM_CENTER});
        }
        
    };

    return (
        <CustomerWrapper>
            <div className="wrapper-box pt-3" id="pdf">
            <div className="wrapper-box pt-4">
                <div className="container pt-5 mb-3">
                    <h4 className="pt-1 pt-md-1 px-2 mb-0">Project</h4>
                    <form>
                        <div className="row pt-2 pt-md-1 px-3 mb-0 mt-2">
                            <div className="col px-2">
                                <div className="col pt-1 col-md-12">
                                    <TextField type="search" InputLabelProps={{
                                        shrink: true,
                                    }} inputProps={{
                                        style: {
                                            height: "5px",
                                        },
                                    }}
                                               name="projectName" 
                                               label="Name" 
                                               className="w-100" 
                                               disabled={false}
                                               onChange={handleChangePro}
                                               value={formDataProject.projectName}
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
                                                name="subject"
                                                label="Subject"
                                                className="w-100"
                                                required
                                                disabled={false}
                                                onChange={handleChangePro}
                                                value={formDataProject.subject}/>
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
                                               label="sales"
                                               className="w-100"
                                               required
                                               disabled={true}
                                               onChange={handleChangePro}
                                               value={formDataProject.sales}/>
                                </div>
                            </div>
                            <div className="col p-0">
                                <div className="col p-0 pt-1 mb-2">
                                        <FormControl size="small" className="w-100">
                                                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                                <Select     id="demo-simple-select" labelId="demo-simple-select-label"
                                                            name="status" label="Status" className="w-100"
                                                            value={formDataProject.status} onChange={handleChangePro}>
                                                    <MenuItem value="Pending">
                                                        <em>Pending</em>
                                                    </MenuItem>
                                                    <MenuItem value={"Completed"}>Completed</MenuItem>
                                                    <MenuItem value={"Cancelled"}>Cancelled</MenuItem>
                                                    <MenuItem value={"Denied"}>Denied</MenuItem>
                                                </Select>
                                        </FormControl>
                                </div>
                            </div>
                        </div>
                        
                        <div className="row mt-1 d-flex justify-content-center">
                            <div className="row">
                                
                                <h6 className="">Customer-info:</h6>
                                <div className="heading-container mt-1 d-flex justify-content-end pt-1 no-print mb-2" id="no-print">
                                    <div className="col d-flex justify-content-end flex-row-reverse align-items-center customer-box-sl" id="no-print">
                                        <div className="col p-0" id="no-print">
                                            <div className="col p-0 d-flex justify-content-start" id="no-print">
                                                
                                            </div>
                                        </div>
                                        <ComboBox func={listenChange} dis={stateOfN}/>
                                    </div>
                                    <div className="row px-2" id="no-print">
                                        <div className="p-0 d-flex justify-content-between align-items-center">
                                            <IconButton variant="outlined" className="px-3 cs-add-btn" color="error"
                                                    onClick={handleCreate}
                                                    size="small"><p4 className="">Add New Customer</p4></IconButton>
                                        </div>
                                    </div>
                                </div>
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
                                
                            </div>
                            
                        </div>
                        <div className="row m-1 mt-0 justify-content-end">
                                    <div className="col p-0 pt-1 mb-2 pe-1 d-flex justify-content-start flex-row-reverse">
                                        <Button variant="contained" className="px-3 cs-add-btn confirm" color="primary"
                                            onClick={handleSubmitNext} type="submit" disabled={stateOfN}
                                            size="small">Confirm
                                        </Button>
                                        <Button variant="contained" className="px-3 mx-2 cs-add-btn edit" color="secondary"
                                            onClick={handleCancelNext} type="submit" disabled={!stateOfN}
                                            size="small">Edit
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
                    </form>
                </div>
            </div>

                
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
