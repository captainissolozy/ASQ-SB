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
import db, {storage} from "../../../config/firebase-config"
import {doc, getDoc, setDoc, deleteDoc } from "firebase/firestore"
import AddTable from "./AddTable";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Modal from "@material-ui/core/Modal";
import ComboBox from "./combobox";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";


export default function Lobby() {

    const initialFormData = Object.freeze({
        mode: "",
        amount: "",
        bank: "",
        day: "",
        month: "",
        year: "",
        url: "",
    });

    const initialSearchKey = Object.freeze({
        mode: "",
        bank: "",
        day: "",
        month: "",
        year: ""
    });
    const initialFormData2 = Object.freeze({
        bank: "",
        number: ""
    });

    const navigate = useNavigate()
    const {user} = useUserContext()
    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [formData, updateFormData] = useState(initialFormData)
    const [formData2, updateFormData2] = useState(initialFormData2)
    const [formData3, updateFormData3] = useState(initialFormData)
    const [searchKey, setSearchKey] = useState(initialSearchKey)
    const [edit, setEdit] = useState(false)
    const [file, setFile] = useState("");

    useEffect(() => {
        if (!user) {
            navigate('/')
        }
        if (sessionStorage.getItem('role') !== "Admin" && sessionStorage.getItem('role') !== "Accountant") {
            navigate('/')
        }
        window.scrollTo(0, 0)
    }, [navigate, user, sessionStorage.getItem('role')])


    const handleCreate = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleCreate2 = () => {
        setOpen2(true)
    }

    const handleClose3 = () => {
        setEdit(false)
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

    const handleChange3 = (e) => {
        updateFormData3({
            ...formData3,
            [e.target.name]: e.target.value
        })
    }

    const listenChange = (data) => {
        handleBank(data)
    }

    const handleBank = async (data) => {
        setSearchKey({
            ...searchKey,
            "bank": data,
        });
    }

    const listenChange2 = (data) => {
        handleBank2(data)
    }

    const handleBank2 = async (data) => { 
        updateFormData({
            ...formData,
            "bank": data,
        });
    }

    const listenChange3 = (data) => {
        handleBank3(data)
    }

    const handleBank3 = async (data) => { 
        updateFormData3({
            ...formData3,
            "bank": data,
        });
    }

    const handleChangeUploadFile = (e) => {
        setFile(e.target.files[0])
    }

    const listenEdit = async (data) => {
        const docRef1 = doc(db, "accounting", "taxes", "record", sessionStorage.getItem("taxesID"));
        const docSnap = await getDoc(docRef1);
        updateFormData3(docSnap.data())
        setEdit(data)
    }

    const joinChange = (e) => {
        setSearchKey({
            ...searchKey,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const storageRef = ref(storage, `/media/taxes/${file.name}`)
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
                    if(formData.amount == "" || formData.mode == "" || formData.month == ""|| formData.day == ""){
                        
                    }else{
                        formData.url = url;
                        const docRef1 = doc(db, "accounting", "taxes", "record", formData.mode+formData.bank+formData.amount+formData.day+formData.month);
                        await setDoc(docRef1, formData);
                        setOpen(false);
                        updateFormData({});
                    }
                });
            }
        )
    };

    const handleSubmit2 = async (e) => {
        e.preventDefault()
        const docRef1 = doc(db, "bank", formData2.number);
        await setDoc(docRef1, formData2);
        setOpen2(false)
    };

    const handleSubmit3 = async (e) => {
        e.preventDefault()
        if(formData3.bank != ""){
            const docRef2 = doc(db, "accounting", "taxes", "record", sessionStorage.getItem("taxesID"));
            await deleteDoc(docRef2);
            const docRef1 = doc(db, "accounting", "taxes", "record", formData3.mode+formData3.bank+formData3.amount+formData3.day+formData3.month);
            await setDoc(docRef1, formData3);
            setEdit(false)
        }
    };

    return (
        <LobbyWrapper>
            <div className="wrapper-box pt-4">
                <div className="container mb-5 py-4 px-3 shadow-sm" style={{height: "auto"}}>
                    <div className=''>
                    <div className="col px-2 d-flex align-items-center justify-content-between">
                        <h4 className="mb-0">Taxes</h4>
                        <div>
                        <IconButton variant="outlined" className="px-3 rounded-2 sty-addbtn" color="primary" onClick={handleCreate}
                                    size="small"><p3 className="mb-0">+ Taxes</p3></IconButton>
                        <IconButton variant="outlined" className="px-3 rounded-2" color="secondary" onClick={handleCreate2}
                                    size="small"><p3 className="mb-0">+ Bank</p3></IconButton>
                        </div>
                    </div>
                    <div className="row mt-3 d-flex justify-content-center">
                        <div className="row">
                            <div className="col-12 px-2">
                                <div className="col pt-1 col-md-12 mb-2">
                                <ComboBox className="w-100" func={listenChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-8">
                            <div className="row d-flex">
                                    <div className="col p-0 pt-1 col-md mb-2 mx-2">
                                        <FormControl fullWidth size="small">
                                        <InputLabel id="demo-simple-select-label">Day</InputLabel>
                                        <Select id="demo-simple-select1" name="day" label="day" className="w-100 mb-2" labelId="demo-simple-select-label"
                                            value={searchKey.day} onChange={joinChange} size="small">
                                                <MenuItem value={""}>All</MenuItem>
                                                <MenuItem value={"1"}>01</MenuItem>
                                                <MenuItem value={"2"}>02</MenuItem>
                                                <MenuItem value={"3"}>03</MenuItem>
                                                <MenuItem value={"4"}>04</MenuItem>
                                                <MenuItem value={"5"}>05</MenuItem>
                                                <MenuItem value={"6"}>06</MenuItem>
                                                <MenuItem value={"7"}>07</MenuItem>
                                                <MenuItem value={"8"}>08</MenuItem>
                                                <MenuItem value={"9"}>09</MenuItem>
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
                                        </FormControl>
                                
                                    </div>
                                    <div className="col p-0 pt-1 col-md mb-2 mx-2">
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="demo-simple-select-label">Month</InputLabel>
                                        <Select id="demo-simple-select1" name="month" label="Month" className="w-100 mb-2" labelId="demo-simple-select-label"
                                            value={searchKey.month} onChange={joinChange} size="small">
                                                <MenuItem value={""}>All</MenuItem>
                                                <MenuItem value={"1"}>01</MenuItem>
                                                <MenuItem value={"2"}>02</MenuItem>
                                                <MenuItem value={"3"}>03</MenuItem>
                                                <MenuItem value={"4"}>04</MenuItem>
                                                <MenuItem value={"5"}>05</MenuItem>
                                                <MenuItem value={"6"}>06</MenuItem>
                                                <MenuItem value={"7"}>07</MenuItem>
                                                <MenuItem value={"8"}>08</MenuItem>
                                                <MenuItem value={"9"}>09</MenuItem>
                                                <MenuItem value={"10"}>10</MenuItem>
                                                <MenuItem value={"11"}>11</MenuItem>
                                                <MenuItem value={"12"}>12</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col p-0 pt-1 col-md mb-2 mx-2">
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="demo-simple-select-label">Year</InputLabel>
                                        <Select id="demo-simple-select1" name="year" label="Year" className="w-100 mb-2" labelId="demo-simple-select-label"
                                            value={searchKey.year} onChange={joinChange} size="small">
                                                <MenuItem value={""}>All</MenuItem>
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
                                        </FormControl>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row d-flex justify-content-center">
                                    <div className="col p-0">
                                        <div className="col p-0 pt-1 mb-2 mx-2">
                                        <FormControl size="small" className="w-100">
                                            <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                            <Select     id="demo-simple-select" labelId="demo-simple-select-label"
                                                        name="mode" label="Type" className="w-100"
                                                        value={searchKey.mode} onChange={joinChange}>
                                                <MenuItem value="">
                                                    <em>All</em>
                                                </MenuItem>
                                                <MenuItem value={"Coporate Taxes"}>Coporate Tax</MenuItem>
                                                <MenuItem value={"Half-year Corporate lncome Tax"}>Half-year Corporate lncome Tax</MenuItem>
                                                <MenuItem value={"VAT"}>VAT</MenuItem>
                                                <MenuItem value={"ค่าธรรมเนียมธนาคาร"}>ค่าธรรมเนียมธนาคาร</MenuItem>
                                                <MenuItem value={"ภาษีหัก ณ ที่จ่าย"}>ภาษีหัก ณ ที่จ่าย</MenuItem>
                                                <MenuItem value={"ประกันสังคม"}>ประกันสังคม</MenuItem>
                                                <MenuItem value={"ภาษีเงินเดือน"}>ภาษีเงินเดือน</MenuItem>
                                                <MenuItem value={"อื่นๆ"}>อื่นๆ</MenuItem>
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
                                    <th scope="col" className="t-stick th px-3">Type</th>
                                    <th scope="col" className="t-stick th px-3">From</th>
                                    <th scope="col" className="t-stick th px-3">Date</th>
                                    <th scope="col" className="t-stick th px-3 text-end">Amount</th>
                                    <th scope="col" className="t-stick th px-3 text-center">File</th>
                                </tr>
                                </thead>
                                <AddTable bank={searchKey.bank} mode={searchKey.mode}
                                          day={searchKey.day} month={searchKey.month} year={searchKey.year}
                                          truth={listenEdit}
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
                        <h3>Taxes</h3>
                    </div>
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                            <Select     id="demo-simple-select" labelId="demo-simple-select-label"
                                                        name="mode" label="Type" className="w-100 mb-4"
                                                        value={formData.mode} onChange={handleChange}>
                                                <MenuItem value="">
                                                    <em>All</em>
                                                </MenuItem>
                                                <MenuItem value={"Coporate Taxes"}>Coporate Tax</MenuItem>
                                                <MenuItem value={"Half-year Corporate lncome Tax"}>Half-year Corporate lncome Tax</MenuItem>
                                                <MenuItem value={"VAT"}>VAT</MenuItem>
                                                <MenuItem value={"ค่าธรรมเนียมธนาคาร"}>ค่าธรรมเนียมธนาคาร</MenuItem>
                                                <MenuItem value={"ภาษีหัก ณ ที่จ่าย"}>ภาษีหัก ณ ที่จ่าย</MenuItem>
                                                <MenuItem value={"ประกันสังคม"}>ประกันสังคม</MenuItem>
                                                <MenuItem value={"ภาษีเงินเดือน"}>ภาษีเงินเดือน</MenuItem>
                                                <MenuItem value={"อื่นๆ"}>อื่นๆ</MenuItem>
                                            </Select>
                    <ComboBox className="w-100" func={listenChange2}/>
                    <TextField className="my-2"
                               label="Amount"
                               name="amount"
                               type="text"
                               required
                               onChange={handleChange}
                    />

                    <div className="px-0 mb-2 mt-3">
                        <div className="col d-flex justify-content-between w-100">
                        <InputLabel id="demo-simple-select-label1" >Day</InputLabel>
                        <Select id="demo-simple-select1" labelId="demo-simple-select-label1" name="day" label="day" className="w-100 mb-2"
                            value={formData.day} onChange={handleChange}>
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
                            value={formData.month} onChange={handleChange}>
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
                            value={formData.year} onChange={handleChange}>
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
                    <input name="path" className="row d-flex justify-content-center px-2 mb-3 pt-4 mx-2"
                            type="file" accept="image/*" onChange={handleChangeUploadFile}/>
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
                        <h3>Bank</h3>
                    </div>
                    <InputLabel id="demo-simple-select-label" >Bank</InputLabel>
                        <Select id="demo-simple-select" labelId="demo-simple-select-label" name="bank" label="Bank" className="w-100 mb-2"
                            value={formData2.bank} onChange={handleChange2}>
                                <MenuItem value={"Kasikorn"}>Kasikorn</MenuItem>
                                <MenuItem value={"Krungthai"}>Krungthai</MenuItem>
                                <MenuItem value={"TTB"}>TTB</MenuItem>
                                <MenuItem value={"SCB"}>SCB</MenuItem>
                                <MenuItem value={"BB"}>TTB</MenuItem>
                                <MenuItem value={"GSB"}>SCB</MenuItem>
                        </Select>
                        <TextField className="my-2"
                               label="Account number"
                               name="number"
                               type="text"
                               required
                               onChange={handleChange2}/>

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
            <Modal
                open={edit}
                onClose={handleClose3}
                className="d-flex justify-content-center align-items-center"
                disableEnforceFocus
            >

                <form className="border border-secondary p-4 m-2 rounded-2 row bg-white" style={{maxWidth: "600px"}}>
                    <div className="heading-container mt-2 mb-2 p-0 d-flex justify-content-start">
                        <h3>Taxes</h3>
                    </div>
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                            <Select     id="demo-simple-select" labelId="demo-simple-select-label"
                                                        name="mode" label="Type" className="w-100 mb-4"
                                                        value={formData3.mode} onChange={handleChange3}>
                                                <MenuItem value="">
                                                    <em>All</em>
                                                </MenuItem>
                                                <MenuItem value={"Coporate Taxes"}>Coporate Tax</MenuItem>
                                                <MenuItem value={"Half-year Corporate lncome Tax"}>Half-year Corporate lncome Tax</MenuItem>
                                                <MenuItem value={"VAT"}>VAT</MenuItem>
                                                <MenuItem value={"ค่าธรรมเนียมธนาคาร"}>ค่าธรรมเนียมธนาคาร</MenuItem>
                                                <MenuItem value={"ภาษีหัก ณ ที่จ่าย"}>ภาษีหัก ณ ที่จ่าย</MenuItem>
                                                <MenuItem value={"ประกันสังคม"}>ประกันสังคม</MenuItem>
                                                <MenuItem value={"ภาษีเงินเดือน"}>ภาษีเงินเดือน</MenuItem>
                                                <MenuItem value={"อื่นๆ"}>อื่นๆ</MenuItem>
                                            </Select>
                    <ComboBox className="w-100" func={listenChange3}/>
                    <TextField className="my-2"
                               label="Amount"
                               name="amount"
                               type="text"
                               required
                               value={formData3.amount}
                               onChange={handleChange3}
                    />
                    <div className="px-0 mb-2 mt-3">
                        <div className="col d-flex justify-content-between w-100">
                        <InputLabel id="demo-simple-select-label1" >Day</InputLabel>
                        <Select id="demo-simple-select1" labelId="demo-simple-select-label1" name="day" label="day" className="w-100 mb-2"
                            value={formData3.day} onChange={handleChange3}>
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
                            value={formData3.month} onChange={handleChange3}>
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
                            value={formData3.year} onChange={handleChange3}>
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

                    <div className="pt-2">
                        <div className="col d-flex justify-content-center">
                            <Button type="submit" variant="contained" color="secondary" className="mx-3 m"
                                    onClick={handleClose3}>
                                Close
                            </Button>

                            <Button type="submit" variant="contained" color="primary" className="mx-3"
                                    onClick={handleSubmit3}>
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
