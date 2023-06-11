import * as React from "react";
import {Button, TextField} from "@mui/material";
import {MdOutlineArrowBackIos} from 'react-icons/md';
import FormWrapper from "./FormWrapper";
import {Link} from "react-router-dom";

const BasicTextFields = ({setPassword, setEmail, handleAction}) => {

    const handleSubmit = e => {
        e.preventDefault();
    };

    return (
        <FormWrapper>
            <div className="box">
                <form className="regis-b c-box border border-primary p-4 rounded-2 w-100 bg-white" onSubmit={handleSubmit}>
                    <div>
                    </div>
                    <div className="heading-container mt-2 d-flex flex-row-reverse justify-content-center">
                        <h3>ASQuare</h3>
                    </div>
                    <TextField className="my-3"
                               label="Email"
                               variant="filled"
                               type="email"
                               required
                               onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField className="my-3 mb-4"
                               label="Password"
                               variant="filled"
                               type="password"
                               required
                               onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="pt-2">


                        <Button type="submit" variant="contained" color="primary" fullWidth="true" className="mx-3"
                                onClick={handleAction}>
                            Login
                        </Button>
                    </div>
                </form>
            </div>
        </FormWrapper>
    );
};
export default BasicTextFields;
