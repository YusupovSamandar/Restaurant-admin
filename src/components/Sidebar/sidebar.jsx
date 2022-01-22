import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import PersonIcon from '@material-ui/icons/Person';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import axios from 'axios';
import clsx from 'clsx';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

function ResponsiveDrawer(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const [current, setCurrent] = React.useState("category");
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon style={{ color: "#707070" }} />
                    </IconButton>
                    <Typography variant="h6" style={{ justifyContent: "space-between", display: "flex", width: "100%", alignItems: "center" }} noWrap >
                        <Link style={{ color: "#000", textDecoration: "none", fontSize: "40px", fontFamily: "Bebas Neue" }} to="/">
                            RESTAURANTLY
                        </Link>
                        <Button
                            style={{
                                backgroundColor: "#fff", borderRadius: "50px", fontSize: "16px", fontWeight: "bold", textTransform: "capitalize", width: "120px"
                            }}
                            onClick={() => {
                                axios.delete("http://192.168.43.206:4000/status").then((msg) => {
                                    alert(msg.data);
                                })
                            }}>
                            free up
                        </Button>
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div>
                    <div className={classes.toolbar}>
                        <IconButton onClick={handleDrawerClose} style={{ display: open ? "block" : "none" }}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        <Link style={{ color: "#333", textDecoration: "none", position: "relative" }} to="/add-category">
                            <ListItem style={{ padding: "20px" }} button >
                                <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
                                <ListItemText primary={"Add Category"} />
                            </ListItem>
                        </Link>
                        <Link style={{ color: "#333", textDecoration: "none" }} to="/daily-income">
                            <ListItem style={{ padding: "20px" }} button >
                                <ListItemIcon><AttachMoneyIcon /></ListItemIcon>
                                <ListItemText primary={"Daily Income"} />
                            </ListItem>
                        </Link>
                        <Link style={{ color: "#333", textDecoration: "none" }} to="/stats">
                            <ListItem style={{ padding: "20px" }} button >
                                <ListItemIcon><EqualizerIcon /></ListItemIcon>
                                <ListItemText primary={"Stats"} />
                            </ListItem>
                        </Link>
                        <Link style={{ color: "#333", textDecoration: "none" }} to="/waiters">
                            <ListItem style={{ padding: "20px" }} button >
                                <ListItemIcon><PersonIcon /></ListItemIcon>
                                <ListItemText primary={"Waiters"} />
                            </ListItem>
                        </Link>

                    </List>
                </div>
            </Drawer>
            <main style={{ marginTop: "50px" }} className={classes.content}>
                {props.contents}
            </main>
        </div >
    );
}

ResponsiveDrawer.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default ResponsiveDrawer;