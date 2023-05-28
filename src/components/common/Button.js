import {Button, makeStyles} from "@mui/material"
import * as React from 'react';

const useStyles = makeStyles({
    root: {
        background: transparent,
        border: none,
    }
});

function BasicButtons({title}, {color}) {
    const classes = useStyles();
    return (
        <Button variant="contained" className={classes.root} color={color}>{title}</Button>
    );
}

export default BasicButtons