import React from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import Fade from '@material-ui/core/Fade';
import "./category.css";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));
export default function Category() {

    const [allCollections, setallCollections] = React.useState([]);

    const updateGlobalCategory = () => {
        (async function () {
            const { data } = await axios.get("http://localhost:4000/collections");
            let maped = Object.keys(data);
            setallCollections(maped);
        })();
    }

    React.useEffect(() => {
        updateGlobalCategory()
    }, []);

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false)
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function onSubmit() {
        setLoading(true);
        let inputVal = document.getElementById("outlined-basic").value;
        axios.get(`http://localhost:4000/newCollection/${inputVal}`).then((result) => {
            setLoading(false)
            let maped = Object.keys(result.data);
            setallCollections(maped);
            handleClose();

        });
    }

    return (
        <div>
            <Paper style={{ width: "95%", padding: "50px", height: "80vh", overflow: "auto", margin: "4vh auto 0", backgroundColor: "rgba(255,255,255,0.8)", borderRadius: "5px", boxShadow: "0px 0px 37px 5px rgba(34, 60, 80, 0.2)" }}>
                <div className='hover-effects' style={{ display: "flex", flexWrap: "wrap" }}>
                    {allCollections.map((name) => (
                        <Link style={{ margin: "30px", minWidth: "20%", boxSizing: "border-box", textDecoration: "none" }} to="/add-product">
                            <Paper style={{
                                padding: "30px 20px", fontFamily: "Roboto",
                                fontStyle: "normal",
                                background: "transparent",
                                border: "1px solid #eee",
                                fontWeight: "500",
                                textTransform: "capitalize"
                            }} onClick={() => {
                                localStorage.setItem('currentCollection', name);
                            }}>
                                {name}
                            </Paper>
                        </Link>
                    ))}
                    {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
                    <a href="#" style={{ marginTop: "45px", marginLeft: "20px" }} className='addNewCategory' onClick={handleOpen}>
                        <AddCircleOutlineIcon style={{ fontSize: "2.7rem", color: "#D8A86D", marginTop: "5px" }} />
                    </a>
                </div>
            </Paper>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <form className={classes.root} noValidate autoComplete="off">
                            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
                            <Button type='submit' disabled={loading ? true : false} onClick={() => onSubmit()} style={{ backgroundColor: "#FCDE60", marginLeft: "20px", marginTop: "20px", borderRadius: "50px", fontSize: "0.8rem", width: "100px", fontWeight: "bold", textTransform: "capitalize" }}>
                                {loading ? "loading..." : "Confirm"}
                            </Button>
                        </form>
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}

