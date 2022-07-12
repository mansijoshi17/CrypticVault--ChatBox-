import { Send } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Button,
    Container,
    Divider,
    Fab,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
    Typography,
} from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useEffect, useState } from "react";
// import Page from "src/components/Page";
// import { AppWeeklySales } from "src/sections/@dashboard/app";
import { makeStyles } from "@mui/styles";
// import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import { useParams } from "react-router-dom";
// import moment from "moment";
import { identity } from "lodash";
import UserList from "./UserList";
import { Client } from '@xmtp/xmtp-js'
import { Wallet } from 'ethers'




const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    chatSection: {
        width: "100%",
        height: "75vh",
        backgroundColor: '#fff',
        boxShadow: "0 1px 2px 0 rgb(145 158 171 / 24%)",
        borderRight: "1px solid #e0e0e0",
        borderLeft: "1px solid #e0e0e0",
        borderBottom: "1px solid #e0e0e0",
        borderRadius: "16px",
    },
    headBG: {
        backgroundColor: "#e0e0e0",
    },
    borderRight500: {
        borderRight: "1px solid #e0e0e0",
    },
    messageArea: {
        height: "60vh",
        overflowY: "auto",
    },
    senderMsgBox: {
        borderRadius: "0px 15px 15px 20px",
        background: "#eee",
        padding: "10px",
    },
    recieveMsgBox: {
        borderRadius: "20px 15px 0 15px",
        background: "aliceblue",
        padding: "10px",
    },
});

function ChatBox() {
    const { id } = useParams();
    const classes = useStyles();
    const [message, setMessage] = useState("");
    const [isUpdate, setIsUpdate] = useState(false);
    const [allUser, setAllUser] = useState([]);
    const [udata, setData] = useState([]);
    const [handleId, setHandleId] = useState("");

    const [open, setOpen] = React.useState(false);
    const [userAddress, setUserAddress] = useState("");


 
   

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddUser = async() => {
        const wallet = Wallet.createRandom();
        const xmtp = await Client.create(wallet)
        console.log(userAddress, "userAddress");
        const conversation = await xmtp.conversations.newConversation(userAddress);
        console.log(conversation,"conversation");
    }



    return (
        <Container maxWidth="xl"> 
            <Dialog open={open}
                onClose={handleClose}
                fullWidth="fullWidth"
                maxWidth="sm">
                <DialogTitle>Add New User</DialogTitle>
                <DialogContent>
                    <DialogContentText>

                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="address"
                        label="Wallet Address"
                        type="text"
                        value={userAddress}
                        fullWidth
                        onChange={(e) => setUserAddress(e.target.value)}
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="error">Cancel</Button>
                    <Button onClick={handleAddUser} variant="contained" color="primary">Add user</Button>
                </DialogActions>
            </Dialog>


            <Box sx={{ pb: 2 }}>
                <Typography variant="h4" component="h2">Messages</Typography>
            </Box>
            <Grid container className={classes.chatSection}>
                <Grid item xs={3} className={classes.borderRight500}>
                    <List >
                        <ListItem button key="RemySharp" onClick={handleClickOpen}>
                            <ListItemIcon>
                                <Avatar
                                    // alt={user ? user.attributes.username : "user"}
                                    src={"/images/lg.png"}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary={"username"}
                            ></ListItemText>
                        </ListItem>

                    </List>
                    <Divider />
                    <Grid item xs={12} style={{ padding: "10px" }}>
                        <TextField
                            id="outlined-basic-email"
                            label="Search"
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                    <Divider />
                    <List>
                        <UserList />
                    </List>
                </Grid>
                <Grid item xs={9}>
                    <List className={classes.messageArea}>
                        {/* {udata &&
                handleId !== "" &&
                udata
                  .sort((a, b) => (a.updatedAt < b.updatedAt ? -1 : 1))
                  .map((msg) => {
                    return ( */}
                        <ListItem  >
                            <Grid container>
                                <Grid item xs={12}>
                                    <ListItemText
                                        className={
                                            // handleId == msg.reciever &&
                                            // user?.id == msg.sender.objectId
                                            //   ? classes.recieveMsgBox
                                            classes.senderMsgBox
                                        }
                                        align={
                                            "right"
                                        }
                                    //   primary={msg.text}
                                    ></ListItemText>
                                </Grid>
                                <Grid item xs={12}>
                                    {/* <ListItemText
                              align={
                                "left"
                              }
                            //   secondary={moment(msg.updatedAt).format(
                                "h:mm:ss a"
                              )}
                            ></ListItemText> */}
                                </Grid>
                            </Grid>
                        </ListItem>
                        {/* );
                  })} */}
                    </List>
                    <Divider />
                    <Grid container style={{ padding: "20px" }}>
                        <Grid item xs={11} align="left">
                            <TextField
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                id="outlined-basic-email"
                                label="Type Something"
                                fullWidth
                            />
                        </Grid>
                        <Grid xs={1} align="right">
                            <Fab color="primary" aria-label="add">
                                <Send />
                            </Fab>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
        // </Page>
    );
}

export default ChatBox;
