import LobbyWrapper from "./LobbyWrapper";
import * as React from "react";
import { useEffect, useState } from "react";
import { useUserContext } from "../../context/UserContexts";
import db from "../../config/firebase-config";
import { toast, ToastContainer } from "react-toastify";
import {Link, useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

export default function Accounting() {

    const navigate = useNavigate();
    const { user } = useUserContext();

    useEffect(() => {
        if (!user) {
            navigate('/')
        }
        if (sessionStorage.getItem('role') !== "Admin") {
            navigate('/')
        }
        if (sessionStorage.getItem('role') !== "Accountant") {
            navigate('/')
        }
        window.scrollTo(0, 0)
    }, [navigate, user, sessionStorage.getItem('role')])

    return (
        <LobbyWrapper>
            <div className="wrapper-box pt-4">
                <div
                    className="container mb-5 py-4 px-3 shadow-sm"
                    style={{ height: "auto" }}
                >
                    <div className="">
                        <div className="col px-2 d-flex align-items-center justify-content-center mb-5">
                            <h4 className="mb-0">Accounting</h4>
                        </div>
                    </div>
                    <div className="mt-4 d-flex mb-2 justify-content-center row">
                        <div className="mb-2 col-11">
                            <Link to={"/balanceProj"} className="nav-link d-flex justify-content-center">
                                <Button className="p-2 w-50" color="primary" variant="contained">Project Balance</Button>
                            </Link>
                        </div>
                        <div className="pt-4 mb-2 col-11">
                            <Link to={"/balance"} className="nav-link d-flex justify-content-center">
                                <Button className="p-2 w-50" color="primary" variant="contained">Income & Expense</Button>
                            </Link>
                        </div>
                        <div className="pt-4 col-11 mb-2">
                            <Link to={"/record"} className="nav-link d-flex justify-content-center">
                                <Button className="p-2 w-50" color="primary" variant="contained">Accounting Record</Button>
                            </Link>
                        </div>
                        <div className="pt-4 col-11 mb-2">
                            <Link to={"/taxes"} className="nav-link d-flex justify-content-center">
                                <Button className="p-2 w-50" color="primary" variant="contained">Taxes</Button>
                            </Link>
                        </div>
                        <div className="pt-4 col-11">
                            <Link to={"/lent"} className="nav-link d-flex justify-content-center">
                                <Button className="p-2 w-50" color="primary" variant="contained">Credit</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </LobbyWrapper>
    );
}
