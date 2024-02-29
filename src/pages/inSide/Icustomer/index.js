import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "../../../context/UserContexts";
import {Button, TextField} from "@mui/material";
import Modal from "@material-ui/core/Modal";
import db, {storage} from "../../../config/firebase-config"
import {doc, getDoc, setDoc, updateDoc} from "firebase/firestore"
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage"
import FormC from "./formC";
import Form1 from "./form1";
import Form2 from "./form2";
import Form3 from "./form3";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CustomerWrapper from "./CustomerWrapper";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from "@mui/icons-material/Add";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import BlockIcon from '@mui/icons-material/Block';
import UndoIcon from '@mui/icons-material/Undo';


export default function Customer() {

    const initialFormData = Object.freeze({
        v_box1: "",
        v_box2: "",
        v_box3: "",
        v_box4: "",
        v_box5: "",
        v_box6: "",
        v_box7: "",
        type: ""
    });

    const initialDocData = Object.freeze({
        name: ""
    });

    const navigate = useNavigate()
    const {user} = useUserContext()
    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [open3, setOpen3] = useState(false)
    const [open4, setOpen4] = useState(false)
    const [formDataIn, setFormDataIn] = useState([])
    const [formData, updateFormData] = useState(initialFormData)
    const [edit, setEdit] = useState(true)
    const [textEdit, setTextEdit] = useState("Edit")
    const [textColor, setTextColor] = useState("warning")
    const [box2, setBox2] = useState("Taxpayer-num")
    const [box3, setBox3] = useState("Register-capital")
    const [boxLa, setBoxLa] = useState("Agent")
    const [count, setCount] = useState(0)
    const [docName, setDocName] = useState(initialDocData)
    const [file, setFile] = useState("");
    const [percent, setPercent] = useState(0);
    const [boxIP, setBoxIP] = useState("ID")
    const [boxIMP, setBoxIMP] = useState("Bookbank")
    const [listenTotal, setListenTotal] = useState(0);
    const [listen20, setListen20] = useState(0);
    const [listenAid, setListenAid] = useState(0);
    const [listenBB, setListenBB] = useState(0);
    const [blockState, setBlockState] = useState(0);
    const [userInfo, setUserInfo] = useState(sessionStorage.getItem("role"));



    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        async function fetchData() {
            const docRef1 = doc(db, "CustomersDetail", sessionStorage.getItem("roomKeyCus"));
            const docSnap = await getDoc(docRef1);
            if (docSnap.exists()) {
                setFormDataIn(docSnap.data())
                if (count <= 1) {
                    setCount(count + 1)
                }
            }
        }
        if(formDataIn.v_box6 === "BlackList"){
            setBlockState(1)
        }
        await fetchData()
        
    }, [count, listen20, listenAid, listenBB])

    useEffect(() => {
        if (formDataIn.type === "Private") {
            setBox2("surname")
            setBox3("email")
            setBoxLa("nickname")
            setBoxIP("ID")
            setBoxIMP("BookBank")
            setListenTotal(2)
        } else {
            setBoxLa("nickname")
            setBox3("email")
            setBox2("taxpayerNum")
            setBoxIP("หนังสือรับรองบริษัท")
            setBoxIMP("BookBank")
            setListenTotal(3)
        }
        updateFormData({
            v_box1: formDataIn.v_box1,
            v_box2: formDataIn.v_box2,
            v_box3: formDataIn.v_box3,
            v_box4: formDataIn.v_box4,
            v_box5: formDataIn.v_box5,
            v_box6: formDataIn.v_box6,
            v_box7: formDataIn.v_box7
        })
    }, [count])

    useEffect(() => {
        if (!user) {
            navigate('/')
        }
        window.scrollTo(0, 0)
    }, [navigate, user])

    const handleCreate = () => {
        setOpen(true)
    }

    const handleCreate2 = () => {
        setOpen2(true)
    }

    const handleCreate3 = () => {
        setOpen3(true)
    }

    const handleCreate4 = () => {
        setOpen4(true)
    }

    const handleSubmitUpload = (e) => {
        e.preventDefault()
        if (!file) {
            alert("Please choose a file first!")
        }
        const storageRef = ref(storage, `/media/Customer/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                // update progress
                setPercent(percent);
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                    const docRef1 = doc(db, "CustomersDetail", formData.v_box1 + formData.v_box2, "media", docName.name);
                    await setDoc(docRef1, {docName, url});
                });
            }
        );
        setOpen(false)
        setDocName("")
    }

    const handleSubmitUpload2 = (e) => {
        e.preventDefault()
        if (!file) {
            alert("Please choose a file first!")
        }
        const storageRef = ref(storage, `/media/Customer/20/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                // update progress
                setPercent(percent);
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                    const docRef1 = doc(db, "CustomersDetail", formData.v_box1 + formData.v_box2, "20", docName.name);
                    await setDoc(docRef1, {docName, url});
                });
            }
        );
        setOpen2(false)
        setDocName("")
    }

    const handleSubmitUpload3 = (e) => {
        e.preventDefault()
        if (!file) {
            alert("Please choose a file first!")
        }
        const storageRef = ref(storage, `/media/Customer/aid/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                // update progress
                setPercent(percent);
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                    const docRef1 = doc(db, "CustomersDetail", formData.v_box1 + formData.v_box2, "aid", docName.name);
                    await setDoc(docRef1, {docName, url});
                });
            }
        );
        setOpen3(false)
        setDocName("")
    }

    const handleSubmitUpload4 = (e) => {
        e.preventDefault()
        if (!file) {
            alert("Please choose a file first!")
        }
        const storageRef = ref(storage, `/media/Customer/bb/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                // update progress
                setPercent(percent);
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                    const docRef1 = doc(db, "CustomersDetail", formData.v_box1 + formData.v_box2, "bb", docName.name);
                    await setDoc(docRef1, {docName, url});
                });
            }
        );
        setOpen4(false)
        setDocName("")
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

    const handleClose = () => {
        setOpen(false)
        setFile("")
    }

    const handleClose2 = () => {
        setOpen2(false)
        setFile("")
    }

    const handleClose3 = () => {
        setOpen3(false)
        setFile("")
    }

    const handleClose4 = () => {
        setOpen4(false)
        setFile("")
    }

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const pull_total = async (data) => {
        if(blockState === 0){
            if(data === "21"){
                setListen20(1)
            }else if(data === "20"){
                setListen20(0)
            }else if(data === "aid1"){
                setListenAid(1)
            }else if(data === "aid0"){
                setListenAid(0)
            }else if(data === "bb1"){
                setListenBB(1)
            }else if(data === "bb0"){
                setListenBB(0)
            }
        }

        if(blockState === 0){
            if(listenTotal === (listen20 + listenAid + listenBB)){
                const docRef1 = doc(db, "CustomersDetail", formData.v_box1 + formData.v_box2);
                await updateDoc(docRef1, {"v_box6": "Completed"});
            }else{
                const docRef1 = doc(db, "CustomersDetail", formData.v_box1 + formData.v_box2);
                await updateDoc(docRef1, {"v_box6": "Incompleted"});
            }
        }
    };

    const handleBlock = async (e) => {
        setBlockState(1)
        const docRef1 = doc(db, "CustomersDetail", sessionStorage.getItem("roomKeyCus"));
        await updateDoc(docRef1, {"v_box6": "BlackList"});
        setCount(count+1)
        console.log(blockState)
    };

    const handleUnBlock = async (e) => {
        setBlockState(0)
        const docRef1 = doc(db, "CustomersDetail", sessionStorage.getItem("roomKeyCus"));
        await updateDoc(docRef1, {"v_box6": "Incompleted"});
        setCount(count-1)
        
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!edit) {
            setEdit(true)
            setTextEdit("Edit")
            setTextColor("warning")
            const docRef1 = doc(db, "CustomersDetail", formData.v_box1 + formData.v_box2);
            await updateDoc(docRef1, formData);
        } else {
            setEdit(false)
            setTextEdit("Confirm")
            setTextColor("primary")
        }
    };

    return (
        <CustomerWrapper>
            <div className="wrapper-box pt-4">
                <div className="container pt-1 px-2 mb-5 pb-4">
                    <div className="heading-container mt-2 d-flex justify-content-start px-2 pt-1">
                        <h4 className="pt-1 pt-md-1">Customer-Info:</h4>
                        <Button variant="outlined" color={textColor} className="mx-2 " onClick={handleSubmit}>
                            {textEdit} <EditIcon className="p-0"/>
                        </Button>
                        {(formDataIn.v_box6 !== "BlackList" && (userInfo === "Admin" || userInfo === "Accountant"))?(
                        <Button variant="outlined" color="error" className="mx-2 " onClick={handleBlock}>
                            Blacklist <BlockIcon className="p-0"/>
                        </Button>):(<></>)}
                        
                        {(formDataIn.v_box6 === "BlackList"&& (userInfo === "Admin" || userInfo === "Accountant"))?(
                        <Button variant="outlined" color="error" className="mx-2 " onClick={handleUnBlock}>
                            Whitelist <UndoIcon className="p-0"/>
                        </Button>):(<></>)}
                        
                    </div>
                    <div className="row mt-3 d-flex justify-content-center">
                        <div className="row pt-1">
                            <div className="col px-2">
                                <div className="col pt-1 col-md-12 mb-2">
                                    <TextField id="v_box1" type="search" InputLabelProps={{
                                        shrink: true,
                                    }} inputProps={{
                                        style: {
                                            height: "5px",
                                        },
                                    }}
                                               name="v_box1" label="Name" className="w-100" onChange={handleChange}
                                               value={formData.v_box1} disabled={true}/>
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
                                               name="v_box2" label={box2} className="w-100" onChange={handleChange}
                                               value={formData.v_box2} disabled={true}/>
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
                                               name="v_box3" label={box3} className="w-100" onChange={handleChange}
                                               value={formData.v_box3} disabled={edit}/>
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
                                               name="v_box4" label={boxLa} className="w-100" onChange={handleChange}
                                               value={formData.v_box4} disabled={edit}/>
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
                                               name="v_box5" label="Tel." className="w-100" onChange={handleChange}
                                               value={formData.v_box5} disabled={edit}/>
                                </div>
                            </div>
                            <div className="col p-0">
                                <div className="col p-0 pt-1 mb-2 mx-2">
                                    <TextField id="v_box6" type="search" InputLabelProps={{
                                        shrink: true,
                                    }} inputProps={{
                                        style: {
                                            height: "5px",
                                        },
                                    }}
                                               name="v_box6" label="Status" className="w-100" onChange={handleChange}
                                               value={formDataIn.v_box6} disabled={true}/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col p-0">
                                <div className="col p-0 pt-1 mb-2 mx-2">
                                    <TextField id="v_box7" type="search" InputLabelProps={{
                                        shrink: true,
                                    }} inputProps={{
                                        style: {
                                            height: "5px",
                                        },
                                    }}
                                               name="v_box7" label="Address" className="w-100" onChange={handleChange}
                                               value={formData.v_box7} disabled={edit}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    {formDataIn.type === "Organization"?(
                    <div className="row m-2 pt-4 justify-content-end">
                        <table className="table table-sm border-bottom-0">
                            <thead className="bg-dark text-light">
                            <tr>
                                <th scope="col" className="t-stick w-25">ภ.พ.20</th>
                                <th scope="col" className="t-stick w-35">Description</th>
                                <th scope="col" className="t-stick w-25">File</th>
                                <th scope="col" className="t-stick w-15 text-center"><FontAwesomeIcon icon={faTrashCan}/></th>
                            </tr>
                            </thead>
                            <Form1 func={pull_total} docname={formData.v_box1 + formData.v_box2} name={docName.name}/>
                        </table>
                        <div className="col-2 p-0 mx-2">
                            <Button variant="outlined" className="w-50" color="primary" onClick={handleCreate2}
                                    size="small"><AddIcon/>
                            </Button>
                        </div>
                    </div>):(<></>)}
                    
                    <div className="row m-2 pt-4 justify-content-end">
                        <table className="table table-sm border-bottom-0">
                            <thead className="bg-dark text-light">
                            <tr>
                            <th scope="col" className="t-stick w-25">{boxIP}</th>
                                <th scope="col" className="t-stick w-35">Description</th>
                                <th scope="col" className="t-stick w-25">File</th>
                                <th scope="col" className="t-stick w-15 text-center"><FontAwesomeIcon icon={faTrashCan}/></th>
                            </tr>
                            </thead>
                            <Form2 func={pull_total} docname={formData.v_box1 + formData.v_box2} name={docName.name}/>
                        </table>
                        <div className="col-2 p-0 mx-2">
                            <Button variant="outlined" className="w-50" color="primary" onClick={handleCreate3}
                                    size="small"><AddIcon/>
                            </Button>
                        </div>
                    </div>
                    
                    <div className="row m-2 pt-4 justify-content-end">
                        <table className="table table-sm border-bottom-0">
                            <thead className="bg-dark text-light">
                            <tr>
                            <th scope="col" className="t-stick w-25">{boxIMP}</th>
                                <th scope="col" className="t-stick w-35">Description</th>
                                <th scope="col" className="t-stick w-25">File</th>
                                <th scope="col" className="t-stick w-15 text-center"><FontAwesomeIcon icon={faTrashCan}/></th>
                            </tr>
                            </thead>
                            <Form3 func={pull_total} docname={formData.v_box1 + formData.v_box2} name={docName.name}/>
                        </table>
                        <div className="col-2 p-0 mx-2">
                            <Button variant="outlined" className="w-50" color="primary" onClick={handleCreate4}
                                    size="small"><AddIcon/>
                            </Button>
                        </div>
                    </div>
                    <div className="row m-2 pt-4">

                        <table className="table table-sm border-bottom-0">
                            <thead className="bg-dark text-light">
                            <tr>
                                <th scope="col" className="t-stick w-60">Related Document</th>
                                <th scope="col" className="t-stick w-25">File</th>
                                <th scope="col" className="t-stick w-15 text-center"><FontAwesomeIcon icon={faTrashCan}/></th>
                            </tr>
                            </thead>
                            <FormC docname={formData.v_box1 + formData.v_box2} name={docName.name}/>
                        </table>

                    </div>
                    <div className="row m-1 pt-2 justify-content-end">
                        <div className="col-2 p-0 mx-2">
                            <Button variant="outlined" className="w-50" color="secondary" onClick={handleCreate}
                                    size="small"><AddIcon/>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            
            <Modal
                open={open}
                onClose={handleClose}
                className="d-flex justify-content-center align-items-center"

            >

                <form className="border border-secondary p-2 m-2 rounded-2 row bg-white py-4">
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

                            <Button type="button" variant="contained" color="error" className="mx-3 col"
                                    onClick={handleClose}>
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
                open={open2}
                onClose={handleClose2}
                className="d-flex justify-content-center align-items-center"

            >

                <form className="border border-secondary p-2 m-2 rounded-2 row bg-white py-4">
                    <div className="pt-2">
                        <h4 className="col d-flex justify-content-center">Add new-document</h4>
                        <div className="col d-flex justify-content-center">

                            <TextField className="m-3"
                                       label="Description"
                                       name="name"
                                       required
                                       size="small"
                                       onChange={handleChangeUpload}
                            />
                            <input name="path" className="row d-flex justify-content-center px-2 mb-3 pt-4"
                                   type="file" accept="image/*" onChange={handleChangeUploadFile}/>
                        </div>

                        <div className="col d-flex justify-content-center">

                            <Button type="button" variant="contained" color="error" className="mx-3 col"
                                    onClick={handleClose2}>
                                Close
                            </Button>

                            <Button type="submit" variant="contained" color="primary" className="mx-3 col"
                                    onClick={handleSubmitUpload2}>
                                Add
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>
            <Modal
                open={open3}
                onClose={handleClose3}
                className="d-flex justify-content-center align-items-center"

            >

                <form className="border border-secondary p-2 m-2 rounded-2 row bg-white py-4">
                    <div className="pt-2">
                        <h4 className="col d-flex justify-content-center">Add new-document</h4>
                        <div className="col d-flex justify-content-center">

                            <TextField className="m-3"
                                       label="Description"
                                       name="name"
                                       required
                                       size="small"
                                       onChange={handleChangeUpload}
                            />
                            <input name="path" className="row d-flex justify-content-center px-2 mb-3 pt-4"
                                   type="file" accept="image/*" onChange={handleChangeUploadFile}/>
                        </div>

                        <div className="col d-flex justify-content-center">

                            <Button type="button" variant="contained" color="error" className="mx-3 col"
                                    onClick={handleClose3}>
                                Close
                            </Button>

                            <Button type="submit" variant="contained" color="primary" className="mx-3 col"
                                    onClick={handleSubmitUpload3}>
                                Add
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>
            <Modal
                open={open4}
                onClose={handleClose4}
                className="d-flex justify-content-center align-items-center"

            >

                <form className="border border-secondary p-2 m-2 rounded-2 row bg-white py-4">
                    <div className="pt-2">
                        <h4 className="col d-flex justify-content-center">Add new-document</h4>
                        <div className="col d-flex justify-content-center">

                            <TextField className="m-3"
                                       label="Description"
                                       name="name"
                                       required
                                       size="small"
                                       onChange={handleChangeUpload}
                            />
                            <input name="path" className="row d-flex justify-content-center px-2 mb-3 pt-4"
                                   type="file" accept="image/*" onChange={handleChangeUploadFile}/>
                        </div>

                        <div className="col d-flex justify-content-center">

                            <Button type="button" variant="contained" color="error" className="mx-3 col"
                                    onClick={handleClose4}>
                                Close
                            </Button>

                            <Button type="submit" variant="contained" color="primary" className="mx-3 col"
                                    onClick={handleSubmitUpload4}>
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
