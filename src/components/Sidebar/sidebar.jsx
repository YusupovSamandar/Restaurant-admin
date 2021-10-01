import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
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
import HomeIcon from '@material-ui/icons/Home';
import Avatar from '@material-ui/core/Avatar';
import { Link } from "react-router-dom";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import axios from 'axios';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

function ResponsiveDrawer(props) {
    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
            <div>
                <h1 style={{ color: "#7272ff" }}>CRM</h1>
            </div>
            <div style={{ margin: "20px", display: "flex", alignItems: "center" }}>
                <Avatar style={{ marginRight: "20px" }} alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg" />
                <span>Administator</span>
            </div>
            <List>
                <Divider />
                <Link style={{ color: "#333", textDecoration: "none" }} to="/add">
                    <ListItem style={{ padding: "20px" }} button >
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText primary={"Home"} />
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
                <br />
                <Divider />
                <Link style={{ color: "#333", textDecoration: "none" }} to="/add-product">
                    <ListItem style={{ padding: "20px" }} button >
                        <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
                        <ListItemText primary={"Add Product"} />
                    </ListItem>
                </Link>
                <Link style={{ color: "#333", textDecoration: "none" }} to="/add-category">
                    <ListItem style={{ padding: "20px" }} button >
                        <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
                        <ListItemText primary={"Add Category"} />
                    </ListItem>
                </Link>

            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography style={{ justifyContent: "space-between", display: "flex", width: "100%" }} variant="h6" noWrap >
                        <Link style={{ color: "#fff", textDecoration: "none" }} to="/">
                            RESTAURANTLY
                        </Link>
                        <Button
                            variant='contained'
                            onClick={() => {
                                axios.delete("http://localhost:4000/status").then((msg) => {
                                    alert(msg.data);
                                })
                            }}>
                            free up
                        </Button>
                    </Typography>
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
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