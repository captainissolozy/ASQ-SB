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
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CustomerWrapper from "./CustomerWrapper";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from "@mui/icons-material/Add";


export default function Customer() {

    const initialFormData = Object.freeze({
        v_box1: "",
        v_box2: "",
        v_box3: "",
        v_box4: "",
        v_box5: "",
        v_box6: "",
        v_box7: ""
    });

    const initialDocData = Object.freeze({
        name: ""
    });

    const navigate = useNavigate()
    const {user} = useUserContext()
    const [open, setOpen] = useState(false)
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


    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        async function fetchData() {
            const docRef1 = doc(db, "SuppliersDetail", sessionStorage.getItem("roomKeySup"));
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
            setBox3("email")
            setBox2("taxpayerNum")
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
    }, [navigate, user])

    const handleCreate = () => {
        setOpen(true)
    }

    const handleSubmitUpload = (e) => {
        e.preventDefault()
        if (!file) {
            alert("Please choose a file first!")
        }
        const storageRef = ref(storage, `/media/Supplier/${file.name}`)
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
                    const docRef1 = doc(db, "SuppliersDetail", formData.v_box1 + formData.v_box2, "media", docName.name);
                    await setDoc(docRef1, {docName, url});
                });
            }
        );
        setOpen(false)
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
    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!edit) {
            setEdit(true)
            setTextEdit("Edit")
            setTextColor("warning")
            const docRef1 = doc(db, "SuppliersDetail", formData.v_box1 + formData.v_box2);
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
                <div className="container pt-5 mb-5">
                    <div className="heading-container mt-2 d-flex justify-content-start px-2 pt-3">
                        <h4 className="pt-1 pt-md-1">Supplier-Info:</h4>
                        <Button variant="outlined" color={textColor} className="mx-2 " onClick={handleSubmit}>
                            {textEdit} <EditIcon className="p-0"/>
                        </Button>
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
                                               value={formData.v_box6} disabled={edit}/>
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
                    <div className="row m-2 pt-4">

                        <table className="table table-sm border-bottom-0">
                            <thead className="bg-dark text-light">
                            <tr>
                                <th scope="col" className="t-stick">Document-name</th>
                                <th scope="col" className="t-stick">File</th>
                            </tr>
                            </thead>
                            <FormC docname={formData.v_box1 + formData.v_box2} name={docName.name}/>
                        </table>

                    </div>
                    <div className="row m-2 pt-2 justify-content-end">
                        <div className="col-2 p-0 mx-3">
                            <Button variant="contained" className="w-100" color="secondary" onClick={handleCreate}
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
            <ToastContainer/>
        </CustomerWrapper>

    );
}
