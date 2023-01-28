import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "../../../../context/UserContexts";
import {Button, IconButton, TextField} from "@mui/material";
import Modal from "@material-ui/core/Modal";
import db, {storage} from "../../../../config/firebase-config"
import {collection, doc, getDoc, setDoc, getDocs, deleteDoc} from "firebase/firestore"
import FormP from "./formP";
import FormP2 from "./formP2";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CustomerWrapper from "./CustomerWrapper";
import AddIcon from "@mui/icons-material/Add";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";


export default function Customer() {

    const initialDocData = Object.freeze({
        name: "",
    });

    const navigate = useNavigate()
    const {user} = useUserContext()
    const [open, setOpen] = useState(false)
    const [openTwo, setOpenTwo] = useState(false)
    const [formDataIn, setFormDataIn] = useState([])
    const [edit] = useState(true)
    const [box2, setBox2] = useState("Taxpayer-num")
    const [box3, setBox3] = useState("Register-capital")
    const [boxLa, setBoxLa] = useState("Agent")
    const [count, setCount] = useState(0)
    const [docName, setDocName] = useState(initialDocData)
    const [file, setFile] = useState("");

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

    }, [count, formDataIn.type])

    useEffect(() => {
        if (!user) {
            navigate('/')
        }
    }, [navigate, user])

    const handleCreate = () => {
        setOpen(true)
        navigate('/StaticQuotation')
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

    const handleChangeUploadFile = (e) => {
        setFile(e.target.files[0])
    }

    const handleChangeUpload = (e) => {
        setDocName({
            ...docName,
            [e.target.name]: e.target.value
        })
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
    }

    return (
        <CustomerWrapper>
            <div className="wrapper-box pt-4">
                <div className="container pt-5 mb-3">
                    <h4 className="pt-1 pt-md-1 px-2 mb-0">Project: {formDataIn.projectName}</h4>
                    <form>
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
                                               name="subject" label="Subject" className="w-100" disabled={true} value={formDataIn.subject}
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
                                               label="sales"
                                               className="w-100"
                                               required
                                               disabled={true}
                                               value={formDataIn.sales}/>
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
                            <table className="table table-sm border-bottom-0">
                                <thead className="bg-dark text-light">
                                <tr>
                                    <th scope="col" className="t-stick">Quotation</th>
                                    <th scope="col" className="t-stick">File</th>
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
                                    <th scope="col" className="t-stick">Description</th>
                                    <th scope="col" className="t-stick">Document</th>
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
            <ToastContainer/>
        </CustomerWrapper>

    );
}
