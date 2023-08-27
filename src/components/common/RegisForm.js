import * as React from "react";
import {Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import {MdOutlineArrowBackIos} from 'react-icons/md'
import FormWrapper from "./FormWrapper";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";

const BasicTextFieldsRegis = ({setPassword, setEmail, setRole, setName, handleAction}) => {

    const [roleValue, setRoleValue] = useState("")


    const handleSubmit = e => {
        e.preventDefault();

    };

    const handleChange = (e) => {
        setRole(e.target.value)
        setRoleValue(e.target.value)
    };

    return (
        <FormWrapper>
            <div className="box">
                <form className="regis-b c-box border border-primary p-4 rounded-2 w-100 bg-white" onSubmit={handleSubmit}>
                    <div>
                    </div>
                    <div className="heading-container mt-2 d-flex flex-row-reverse justify-content-center">
                        <h3>Sign up</h3>
                    </div>
                    <TextField className="my-3"
                               label="Email"
                               variant="filled"
                               type="email"
                               required
                               onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField className="my-3"
                               label="name"
                               variant="filled"
                               type="name"
                               required
                               onChange={(e) => setName(e.target.value)}
                    />
                    <TextField className="my-3 mb-4"
                               label="Password"
                               variant="filled"
                               type="password"
                               required
                               onChange={(e) => setPassword(e.target.value)}
                    />
                    <FormControl size="small" className="w-100 mxw">
                                            <InputLabel id="demo-simple-select-label">Role</InputLabel>
                                            <Select     id="demo-simple-select" labelId="demo-simple-select-label"
                                                        name="status" label="Status" className="w-100"
                                                        value={roleValue} onChange={handleChange}>
                                                <MenuItem value={"Admin"}>Admin</MenuItem>
                                                <MenuItem value={"Accountant"}>Accountant</MenuItem>
                                                <MenuItem value={"Sales"}>Sales</MenuItem>
                                                <MenuItem value={"Others"}>Others</MenuItem>
                                            </Select>
                                        </FormControl>
                    <div className="pt-2 d-flex justify-content-center wrap-btnsubmit mt-3">
                        <Button type="submit" variant="contained" color="primary" className="mx-3"
                                onClick={handleAction}>
                            Signup
                        </Button>
                    </div>
                </form>
            </div>
        </FormWrapper>
    );
};
export default BasicTextFieldsRegis;
