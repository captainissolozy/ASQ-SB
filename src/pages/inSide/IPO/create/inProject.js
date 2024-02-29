import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "../../../../context/UserContexts";
import {Button, IconButton, TextField,  Select, MenuItem, FormControl, InputLabel} from "@mui/material";
import Modal from "@material-ui/core/Modal";
import db, {storage} from "../../../../config/firebase-config"
import {collection, doc, getDoc, setDoc, getDocs, deleteDoc} from "firebase/firestore"
import FormP from "./formP";
import FormP2 from "./formP2";
import FormIncome from "./formIncome";
import FormExpense from "./formExpense";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CustomerWrapper from "./CustomerWrapper";
import AddIcon from "@mui/icons-material/Add";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import ComboBox2 from "./combobox2";
import ComboBox3 from "./combobox3";


export default function Customer() {

    const initialDocData = Object.freeze({
        status: "Pending",
    });

    const initialIncome = Object.freeze({
        name: "",
        mode:"Income",
        cus: sessionStorage.getItem("CustomerProj"),
        amount: "",
        form: sessionStorage.getItem("projectID"),
        day: "",
        month: "",
        year: "",
        bank: ""
    });

    const initialExpense = Object.freeze({
        name: "",
        mode:"Expense",
        cus: sessionStorage.getItem("CustomerProj"),
        amount: "",
        supplier: "",
        form: sessionStorage.getItem("projectID"),
        day: "",
        month: "",
        year: "",
        bank: ""
    });

    const navigate = useNavigate()
    const {user} = useUserContext()
    const [open, setOpen] = useState(false)
    const [openTwo, setOpenTwo] = useState(false)
    const [openThree, setOpenThree] = useState(false)
    const [openFour, setOpenFour] = useState(false)
    const [formDataIn, setFormDataIn] = useState(initialDocData)
    const [edit] = useState(true)
    const [box2, setBox2] = useState("Taxpayer-num")
    const [box3, setBox3] = useState("Register-capital")
    const [boxLa, setBoxLa] = useState("Agent")
    const [count, setCount] = useState(0)
    const [docName, setDocName] = useState(initialDocData)
    const [inComeDoc, setIncomeDoc] = useState(initialIncome)
    const [exPenseDoc, setExpenseDoc] = useState(initialExpense)
    const [file, setFile] = useState("");
    const [state, setState] = useState(false);

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
    }, [count, navigate])

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

    }, [count, formDataIn.type])

    useEffect(() => {
        if (!user) {
            navigate('/')
        }
        window.scrollTo(0, 0)
    }, [navigate, user])

    const handleCreate = () => {
        setOpen(true)
        navigate('/StaticQuotation')
    }

    const handleCreateTwo = () => {
        setOpenTwo(true)
    }

    const handleCreateThree = () => {
        setOpenThree(true)
    }

    const handleCreateFour = () => {
        setOpenFour(true)
    }

    const handleChangePro = (e) => {
        setFormDataIn({
            ...formDataIn,
            [e.target.name]: e.target.value
        })
    }

    const listenChange = (data) => {
        setExpenseDoc({
            ...exPenseDoc,
            supplier: data
        })
    }

    const listenChangeBox = (data) => {
        handleBank(data)
    }

    const handleBank = async (data) => {
        setIncomeDoc({
            ...inComeDoc,
            "bank": data
        });
    }

    const listenChangeBox2 = (data) => {
        handleBank2(data)
    }

    const handleBank2 = async (data) => {
        setExpenseDoc({
            ...exPenseDoc,
            "bank": data
        });
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
        setFile()
    }

    const handleCloseThree = () => {
        setOpenThree(false)
        setIncomeDoc(initialIncome)
        setFile()
    }

    const handleCloseFour = () => {
        setOpenFour(false)
        setExpenseDoc(initialExpense)
        setFile()
    }

    const handleChangeUploadFile = (e) => {
        setFile(e.target.files[0])
    }

    const handleChangeUpload = (e) => {
        setDocName({
            ...docName,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeIncome = (e) => {
        setIncomeDoc({
            ...inComeDoc,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeExpense = (e) => {
        setExpenseDoc({
            ...exPenseDoc,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeData = async (e) => {
        e.preventDefault()
        const docRef1 = doc(db, "PO", sessionStorage.getItem("projectID"));
        const docSnap = await setDoc(docRef1, formDataIn);
        setState(true)
    }

    const handleEdit = (e) => {
        e.preventDefault()
        setState(false)
    }

    const handleSubmitUpload = (e) => {
        e.preventDefault()
        if (!file) {
            alert("Please choose a file first!")
        }
        const storageRef = ref(storage, `/media/PO/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                    const docRef1 = doc(db, "PO", sessionStorage.getItem("projectID"), "media", docName.name);
                    await setDoc(docRef1, {docName, url});
                });
            }
        );
        setOpenTwo(false)
        setDocName("")
        setFile()
    }

    const handleSubmitIncome = async (e) => {
        e.preventDefault()
        if (!file) {
            const docRef1 = doc(db, "PO", sessionStorage.getItem("projectID"), "income", inComeDoc.name+inComeDoc.form);
            await setDoc(docRef1, {inComeDoc, url:""});
        }else{
            const storageRef = ref(storage, `/media/PO/${file.name}`)
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                },
                (err) => console.log(err),
                () => {
                    // download url
                    getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                        const docRef1 = doc(db, "PO", sessionStorage.getItem("projectID"), "income", inComeDoc.name+inComeDoc.form);
                        await setDoc(docRef1, {inComeDoc, url});
                    });
                }
            );
        }
        
        if(inComeDoc.amount != "" || inComeDoc.day != "" || inComeDoc.month != ""|| inComeDoc.year != ""){
            const docRef1 = doc(db, "accounting", "IncomeExpenseO", "record", sessionStorage.getItem("projectID"));
            await setDoc(docRef1, inComeDoc);
        }
        setOpenThree(false)
        setIncomeDoc(initialIncome)
        setFile()
    }

    const handleSubmitExpense = async (e) => {
        e.preventDefault()
        if (!file) {
            const docRef1 = doc(db, "PO", sessionStorage.getItem("projectID"), "expense", exPenseDoc.name+exPenseDoc.form);
            await setDoc(docRef1, {exPenseDoc, url:""});
        }else{
            const storageRef = ref(storage, `/media/PO/${file.name}`)
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                },
                (err) => console.log(err),
                () => {
                    // download url
                    getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                        const docRef1 = doc(db, "PO", sessionStorage.getItem("projectID"), "expense", exPenseDoc.name+exPenseDoc.form);
                        await setDoc(docRef1, {exPenseDoc, url});
                    });
                }
            );
        }
        if(exPenseDoc.amount != "" || exPenseDoc.day != "" || exPenseDoc.month != ""|| exPenseDoc.year != ""){
            const docRef1 = doc(db, "accounting", "IncomeExpenseO", "record", sessionStorage.getItem("projectID"));
            await setDoc(docRef1, exPenseDoc);
        }
        setOpenFour(false)
        setIncomeDoc(initialExpense)
        setFile()
    }

    return (
        <CustomerWrapper>
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
                                               onChange={handleChangePro}
                                               name="projectName" 
                                               label="Name" 
                                               className="w-100" 
                                               disabled={state} 
                                               value={formDataIn.projectName}
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
                                                onChange={handleChangePro}
                                                disabled={state}
                                                value={formDataIn.subject}/>
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
                                            height: "7px",
                                        },
                                    }}
                                               label="sales"
                                               className="w-100"
                                               required
                                               onChange={handleChangePro}
                                               disabled={true}
                                               value={formDataIn.sales}/>
                                </div>
                            </div>
                            <div className="col p-0">
                                <div className="col p-0 pt-1 mb-2 mx-2">
                                <FormControl size="small" className="w-100">
                                                <InputLabel id="demo-simple-select-outlined">Status</InputLabel>
                                                <Select 
                                                            name="status" label="Status" className="w-100" defaultValue={formDataIn.status}
                                                            inputProps={{ 'aria-label': 'Without label' }} disabled={state}
                                                            value={formDataIn.status || "Pending"} onChange={handleChangePro}>
                                                    <MenuItem value="Pending">Pending</MenuItem>
                                                    <MenuItem  value={"Completed"}>Completed</MenuItem>
                                                    <MenuItem value={"Cancelled"}>Cancelled</MenuItem>
                                                    <MenuItem value={"Denied"}>Denied</MenuItem>
                                                </Select>
                                        </FormControl>
                                </div>
                            </div>
                            <div className="row p-0 mx-0 pe-2">
                            <div className="col p-0 mb-3">
                                <div className="col p-0 pt-1 mt-2 d-flex flex-row-reverse">
                                    <Button variant="contained" className="btn-save" color="primary"
                                    onClick={handleChangeData} disabled={state}
                                            type="submit"
                                            size="small">Save
                                    </Button>
                                    {state?(<Button variant="outlined" className="mx-1" color="primary"
                                    onClick={handleEdit}
                                            type="submit"
                                            size="small">Edit
                                    </Button>):(<></>)}
                                </div>
                                
                            </div>
                        </div>
                        </div>
                        <div className="row mt-1 d-flex justify-content-center">
                            <div className="row">
                                <h6 className="">Customer-info:</h6>
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
                    </form>
                    <div className="container-fluid p-0">
                        <div className="row m-2 pt-1 mb-0">
                            <table className="table table-sm border-bottom-0 common-table">
                                <thead className="bg-dark text-light">
                                <tr>
                                    <th style={{width: 60+'%'}} className="">Quotation</th>
                                    <th scope="col-4" className="">Status</th>
                                </tr>
                                </thead>
                                <FormP roomCode={sessionStorage.getItem("projectID")}/>
                            </table>
                        </div>
                        <div className="row m-2 justify-content-end mt-0">
                            <div className="col-2 p-0 mx-md-1 col-md-1 mx-2">
                                <Button variant="outlined" className="w-100" color="primary" onClick={handleCreate}
                                        size="small"><AddIcon/>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="container-fluid p-0">
                        <div className="row m-2 pt-1 mb-0 mt-4">
                            <table className="table table-sm border-bottom-0">
                                <thead className="bg-dark text-light">
                                <tr>
                                    <th style={{width: 60+'%'}} className="">Description</th>
                                    <th scope="col-2" className="">Document</th>
                                </tr>
                                </thead>
                                <FormP2 roomCode={sessionStorage.getItem("projectID")}/>
                            </table>
                        </div>
                        <div className="row m-2 justify-content-end mt-0">
                            <div className="col-2 p-0 mx-md-1 col-md-1 mx-2">
                                <Button variant="outlined" className="w-100" color="primary" onClick={handleCreateTwo}
                                        size="small"><AddIcon/>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="container-fluid p-0">
                        <div className="row m-2 pt-1 mb-0 mt-4">
                        <h6 className="">Income:</h6>
                            <table className="table table-sm border-bottom-0">
                                <thead className="bg-dark text-light">
                                <tr>
                                    <th style={{width: 20+'%'}} className="">Income</th>
                                    <th style={{width: 20+'%'}} className="">Bank</th>
                                    <th style={{width: 20+'%'}} className="">Amount</th>
                                    <th style={{width: 20+'%'}} className="">Date</th>
                                    <th style={{width: 20+'%'}} className="">File</th>
                                </tr>
                                </thead>
                                <FormIncome roomCode={sessionStorage.getItem("projectID")}/>
                            </table>
                        </div>
                        <div className="row m-2 justify-content-end mt-0">
                            <div className="col-2 p-0 mx-md-1 col-md-1 mx-2">
                                <Button variant="outlined" className="w-100" color="primary" onClick={handleCreateThree}
                                        size="small"><AddIcon/>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="container-fluid p-0">
                        <div className="row m-2 pt-1 mb-0 mt-4">
                        <h6 className="">Expense:</h6>
                            <table className="table table-sm border-bottom-0">
                                <thead className="bg-dark text-light">
                                <tr>
                                    <th style={{width: 20+'%'}} className="">Expense</th>
                                    <th style={{width: 20+'%'}} className="">Bank</th>
                                    <th style={{width: 20+'%'}} className="">Suplier</th>
                                    <th style={{width: 15+'%'}} className="">Amount</th>
                                    <th style={{width: 15+'%'}} className="">Date</th>
                                    <th style={{width: 10+'%'}} className="">file</th>
                                </tr>
                                </thead>
                                <FormExpense roomCode={sessionStorage.getItem("projectID")}/>
                            </table>
                        </div>
                        <div className="row m-2 justify-content-end mt-0">
                            <div className="col-2 p-0 mx-md-1 col-md-1 mx-2">
                                <Button variant="outlined" className="w-100" color="primary" onClick={handleCreateFour}
                                        size="small"><AddIcon/>
                                </Button>
                            </div>
                        </div>
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
                        <h4 className="col d-flex justify-content-center">Add new-document</h4>
                        <div className="col d-flex justify-content-center">

                            <TextField className="m-3"
                                       label="Name"
                                       name="name"
                                       required
                                       size="small"
                                       onChange={handleChangeUpload}
                            />
                            <input name="path" className="row d-flex justify-content-center px-2 mb-3 pt-4"
                                   type="file" accept="image/*" onChange={handleChangeUploadFile}/>
                        </div>

                        <div className="col d-flex justify-content-center">

                            <Button type="submit" variant="contained" color="error" className="mx-3 col"
                                    onClick={handleCloseTwo}>
                                Close
                            </Button>

                            <Button type="submit" variant="contained" color="primary" className="mx-3 col"
                                    onClick={handleSubmitUpload}>
                                Add
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>
            <Modal
                open={openThree}
                onClose={handleCloseThree}
                className="d-flex justify-content-center align-items-center"

            >
                <form className="border border-secondary p-4 m-2 rounded-2 row bg-white" style={{maxWidth: "600px"}}>
                    <div className="heading-container mt-2 mb-2 p-0 d-flex justify-content-start">
                        <h3>Income</h3>
                    </div>
                            <TextField className="my-2"
                                    label="Description"
                                    name="name"
                                    required
                                    onChange={handleChangeIncome}
                            />
                            <TextField className="my-2"
                                    label="Amount"
                                    name="amount"
                                    type="text"
                                    required
                                    onChange={handleChangeIncome}
                            />
                            <ComboBox3 className="w-100" func={listenChangeBox}/>
                            <div className="px-0 mb-2">
                                <div className="col d-flex justify-content-between w-100">
                                <InputLabel id="demo-simple-select-label1" >Day</InputLabel>
                        <Select id="demo-simple-select1" labelId="demo-simple-select-label1" name="day" label="day" className="w-100 mb-2"
                            value={inComeDoc.day} onChange={handleChangeIncome} size="small">
                                <MenuItem value={"01"}>01</MenuItem>
                                <MenuItem value={"02"}>02</MenuItem>
                                <MenuItem value={"03"}>03</MenuItem>
                                <MenuItem value={"04"}>04</MenuItem>
                                <MenuItem value={"05"}>05</MenuItem>
                                <MenuItem value={"06"}>06</MenuItem>
                                <MenuItem value={"07"}>07</MenuItem>
                                <MenuItem value={"08"}>08</MenuItem>
                                <MenuItem value={"09"}>09</MenuItem>
                                <MenuItem value={"10"}>10</MenuItem>
                                <MenuItem value={"11"}>11</MenuItem>
                                <MenuItem value={"12"}>12</MenuItem>
                                <MenuItem value={"13"}>13</MenuItem>
                                <MenuItem value={"14"}>14</MenuItem>
                                <MenuItem value={"15"}>15</MenuItem>
                                <MenuItem value={"16"}>16</MenuItem>
                                <MenuItem value={"17"}>17</MenuItem>
                                <MenuItem value={"18"}>18</MenuItem>
                                <MenuItem value={"19"}>19</MenuItem>
                                <MenuItem value={"20"}>20</MenuItem>
                                <MenuItem value={"21"}>21</MenuItem>
                                <MenuItem value={"22"}>22</MenuItem>
                                <MenuItem value={"23"}>23</MenuItem>
                                <MenuItem value={"24"}>24</MenuItem>
                                <MenuItem value={"25"}>25</MenuItem>
                                <MenuItem value={"26"}>26</MenuItem>
                                <MenuItem value={"27"}>27</MenuItem>
                                <MenuItem value={"28"}>28</MenuItem>
                                <MenuItem value={"29"}>29</MenuItem>
                                <MenuItem value={"30"}>30</MenuItem>
                                <MenuItem value={"31"}>31</MenuItem>
                        </Select>
                        <InputLabel id="demo-simple-select-label2" >Month</InputLabel>
                        <Select id="demo-simple-select2" labelId="demo-simple-select-label2" name="month" label="month" className="w-100 mb-2"
                            value={inComeDoc.month} onChange={handleChangeIncome}>
                                <MenuItem value={"01"}>01</MenuItem>
                                <MenuItem value={"02"}>02</MenuItem>
                                <MenuItem value={"03"}>03</MenuItem>
                                <MenuItem value={"04"}>04</MenuItem>
                                <MenuItem value={"05"}>05</MenuItem>
                                <MenuItem value={"06"}>06</MenuItem>
                                <MenuItem value={"07"}>07</MenuItem>
                                <MenuItem value={"08"}>08</MenuItem>
                                <MenuItem value={"09"}>09</MenuItem>
                                <MenuItem value={"10"}>10</MenuItem>
                                <MenuItem value={"11"}>11</MenuItem>
                                <MenuItem value={"12"}>12</MenuItem>
                        </Select>
                        <InputLabel id="demo-simple-select-label3" >Year</InputLabel>
                        <Select id="demo-simple-select3" labelId="demo-simple-select-label3" name="year" label="year" className="w-100 mb-2"
                            value={inComeDoc.year} onChange={handleChangeIncome}>
                                <MenuItem value={"2019"}>2019</MenuItem>
                                <MenuItem value={"2020"}>2020</MenuItem>
                                <MenuItem value={"2021"}>2021</MenuItem>
                                <MenuItem value={"2022"}>2022</MenuItem>
                                <MenuItem value={"2023"}>2023</MenuItem>
                                <MenuItem value={"2024"}>2024</MenuItem>
                                <MenuItem value={"2025"}>2025</MenuItem>
                                <MenuItem value={"2026"}>2026</MenuItem>
                                <MenuItem value={"2027"}>2027</MenuItem>
                                <MenuItem value={"2028"}>2028</MenuItem>
                                <MenuItem value={"2029"}>2029</MenuItem>
                                <MenuItem value={"2030"}>2030</MenuItem>
                        </Select>
                                </div>
                            </div>
                            <input name="path" className="row d-flex justify-content-center p-2 mb-3"
                                   type="file" accept="image/*" onChange={handleChangeUploadFile}/>
                        
                        <div className="pt-2">
                        <div className="col d-flex justify-content-center">
                            <Button type="submit" variant="contained" color="secondary" className="mx-3 m"
                                    onClick={handleCloseThree}>
                                Close
                            </Button>

                            <Button type="submit" variant="contained" color="primary" className="mx-3"
                                    onClick={handleSubmitIncome}>
                                Add
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>
            <Modal
                open={openFour}
                onClose={handleCloseFour}
                className="d-flex justify-content-center align-items-center"

            >
                <form className="border border-secondary p-4 m-2 rounded-2 row bg-white" style={{maxWidth: "600px"}}>
                    <div className="heading-container mt-2 mb-2 p-0 d-flex justify-content-start">
                        <h3>Expense</h3>
                    </div>
                            <ComboBox2 className="w-100" func={listenChange}/>
                            <TextField className="my-2"
                                    label="Description"
                                    name="name"
                                    required
                                    onChange={handleChangeExpense}
                            />
                            <TextField className="my-2"
                                    label="Amount"
                                    name="amount"
                                    type="text"
                                    required
                                    onChange={handleChangeExpense}
                            />

                            <ComboBox3 className="w-100" func={listenChangeBox2}/>
                            <div className="px-0 mb-2">
                                <div className="col d-flex justify-content-between w-100">
                                <InputLabel id="demo-simple-select-label1" >Day</InputLabel>
                        <Select id="demo-simple-select1" labelId="demo-simple-select-label1" name="day" label="day" className="w-100 mb-2"
                            value={exPenseDoc.day} onChange={handleChangeExpense}>
                                <MenuItem value={"01"}>01</MenuItem>
                                <MenuItem value={"02"}>02</MenuItem>
                                <MenuItem value={"03"}>03</MenuItem>
                                <MenuItem value={"04"}>04</MenuItem>
                                <MenuItem value={"05"}>05</MenuItem>
                                <MenuItem value={"06"}>06</MenuItem>
                                <MenuItem value={"07"}>07</MenuItem>
                                <MenuItem value={"08"}>08</MenuItem>
                                <MenuItem value={"09"}>09</MenuItem>
                                <MenuItem value={"10"}>10</MenuItem>
                                <MenuItem value={"11"}>11</MenuItem>
                                <MenuItem value={"12"}>12</MenuItem>
                                <MenuItem value={"13"}>13</MenuItem>
                                <MenuItem value={"14"}>14</MenuItem>
                                <MenuItem value={"15"}>15</MenuItem>
                                <MenuItem value={"16"}>16</MenuItem>
                                <MenuItem value={"17"}>17</MenuItem>
                                <MenuItem value={"18"}>18</MenuItem>
                                <MenuItem value={"19"}>19</MenuItem>
                                <MenuItem value={"20"}>20</MenuItem>
                                <MenuItem value={"21"}>21</MenuItem>
                                <MenuItem value={"22"}>22</MenuItem>
                                <MenuItem value={"23"}>23</MenuItem>
                                <MenuItem value={"24"}>24</MenuItem>
                                <MenuItem value={"25"}>25</MenuItem>
                                <MenuItem value={"26"}>26</MenuItem>
                                <MenuItem value={"27"}>27</MenuItem>
                                <MenuItem value={"28"}>28</MenuItem>
                                <MenuItem value={"29"}>29</MenuItem>
                                <MenuItem value={"30"}>30</MenuItem>
                                <MenuItem value={"31"}>31</MenuItem>
                        </Select>
                        <InputLabel id="demo-simple-select-label2" >Month</InputLabel>
                        <Select id="demo-simple-select2" labelId="demo-simple-select-label2" name="month" label="month" className="w-100 mb-2"
                            value={exPenseDoc.month} onChange={handleChangeExpense}>
                                <MenuItem value={"01"}>01</MenuItem>
                                <MenuItem value={"02"}>02</MenuItem>
                                <MenuItem value={"03"}>03</MenuItem>
                                <MenuItem value={"04"}>04</MenuItem>
                                <MenuItem value={"05"}>05</MenuItem>
                                <MenuItem value={"06"}>06</MenuItem>
                                <MenuItem value={"07"}>07</MenuItem>
                                <MenuItem value={"08"}>08</MenuItem>
                                <MenuItem value={"09"}>09</MenuItem>
                                <MenuItem value={"10"}>10</MenuItem>
                                <MenuItem value={"11"}>11</MenuItem>
                                <MenuItem value={"12"}>12</MenuItem>
                        </Select>
                        <InputLabel id="demo-simple-select-label3" >Year</InputLabel>
                        <Select id="demo-simple-select3" labelId="demo-simple-select-label3" name="year" label="year" className="w-100 mb-2"
                            value={exPenseDoc.year} onChange={handleChangeExpense}>
                                <MenuItem value={"2019"}>2019</MenuItem>
                                <MenuItem value={"2020"}>2020</MenuItem>
                                <MenuItem value={"2021"}>2021</MenuItem>
                                <MenuItem value={"2022"}>2022</MenuItem>
                                <MenuItem value={"2023"}>2023</MenuItem>
                                <MenuItem value={"2024"}>2024</MenuItem>
                                <MenuItem value={"2025"}>2025</MenuItem>
                                <MenuItem value={"2026"}>2026</MenuItem>
                                <MenuItem value={"2027"}>2027</MenuItem>
                                <MenuItem value={"2028"}>2028</MenuItem>
                                <MenuItem value={"2029"}>2029</MenuItem>
                                <MenuItem value={"2030"}>2030</MenuItem>
                        </Select>
                                </div>
                            </div>
                            <input name="path" className="row d-flex justify-content-center p-2 mb-3"
                                   type="file" accept="image/*" onChange={handleChangeUploadFile}/>
                        
                        <div className="pt-2">
                        <div className="col d-flex justify-content-center">
                            <Button type="submit" variant="contained" color="secondary" className="mx-3 m"
                                    onClick={handleCloseFour}>
                                Close
                            </Button>

                            <Button type="submit" variant="contained" color="primary" className="mx-3"
                                    onClick={handleSubmitExpense}>
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
