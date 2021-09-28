import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Link } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(4),
        boxShadow: "1px 4px 10px #707070",
        textAlign: 'center',
        color: "#0000ff94",
        fontSize: "1.1rem",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        justifyContent: "center",
        transition: "0.3s",
        cursor: "pointer",
        "&:hover": {
            opacity: "0.7"
        }
    }
}));

export default function AutoGrid() {
    const classes = useStyles();

    return (
        <div style={{ marginTop: "50px" }} className={classes.root}>
            <Grid container spacing={5}>
                <Grid item xs={3}>
                    <Link style={{ textDecoration: "none" }} to="/add-product">
                        <Paper className={classes.paper}>
                            <p>Add Product</p> <AddCircleIcon />
                        </Paper>
                    </Link>
                </Grid>
                <Grid item xs={3}>
                    <Link style={{ textDecoration: "none" }} to="/add-category">
                        <Paper className={classes.paper}>
                            <p>Add Category</p>
                            <AddCircleIcon />
                        </Paper>
                    </Link>
                </Grid>
            </Grid>
        </div>
    );
}
