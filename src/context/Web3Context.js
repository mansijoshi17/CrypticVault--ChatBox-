import React, { useState, createContext, useEffect, useCallback } from "react";
import { crypticVaultContract } from "../config";
import crypticVault from "../abi/CrypticVault.json";
import crypticVaultToken from "../abi/CrypticVaultToken.json";
import { ethers } from "ethers";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import emailjs from "@emailjs/browser";

export const Web3Context = createContext(undefined);

export const Web3ContextProvider = (props) => {
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [accounts, setAccount] = useState("");
  const [aLoading, setaLoading] = useState(false);
  const [mLoading, setmLoading] = useState(false);
  const [crypticVaultcontractobj, setCrypticVaultcontract] = useState();
  const [signer, setSigner] = useState();
  const [members, setMembers] = useState([]);
  const [emergencyAlert, setEmergencyAlert] = useState();

  useEffect(async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const crypticVaultCon = new ethers.Contract(
      crypticVaultContract,
      crypticVault.abi,
      signer
    );
    setCrypticVaultcontract(crypticVaultCon);
    setSigner(signer);
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    setAddress(accounts[0]);
  }, []);

  const connectWallet = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install the Metamask Extension!");
    }
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Found an account! Address: ", accounts[0]);
      console.log(accounts);
      setAddress(accounts[0]);
    } catch (err) {
      console.log(err);
      if (err.code === 4902) {
        try {
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          console.log(accounts);
          setAddress(accounts[0]);
        } catch (err) {
          alert(err.message);
        }
      }
    }
  };

  const signInAsAdmin = async (data) => {
    let transactionMint;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setAddress(accounts[0]);
    setaLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const crypticVaultCon = new ethers.Contract(
        crypticVaultContract,
        crypticVault.abi,
        signer
      );
      console.log(crypticVaultCon);
      let status = await crypticVaultCon.getLoginStatus(accounts[0]);
      console.log(status);
      if (status) {
        setaLoading(false);
        localStorage.setItem("admin", accounts[0]);
        toast.success("Successfully Signed In as a Admin!!");
        navigate("/dashboard/drive");
      } else {
        let createTokenTransaction = await crypticVaultCon.createToken(
          data.tName,
          data.symbol
        );
        let tx = await createTokenTransaction.wait();
        if (tx) {
          let event = await tx.events[0];
          let tokenContractAddress = event?.args[1];
          console.log(tokenContractAddress);
          transactionMint = await crypticVaultCon.bulkMintERC721(
            tokenContractAddress,
            0,
            6
          );
          let tx1 = await transactionMint.wait();
          const tokenContract = new ethers.Contract(
            tokenContractAddress,
            crypticVaultToken.abi,
            signer
          );
          if (tx1) {
            await tokenContract.setApprovalForAll(crypticVaultContract, true);
            setaLoading(false);
            localStorage.setItem("admin", accounts[0]);
            toast.success("Successfully Signed In as a Admin!!");
            navigate("/dashboard/drive");
          }
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Something want wrong!!", err);
      setaLoading(false);
    }
  };

  const signInAsMember = async (data) => {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setAddress(accounts[0]);
    setaLoading(true);
    try {
      let tokenAddress = await crypticVaultcontractobj.getTokenAddress(
        data.address
      );

      const tokenContract = new ethers.Contract(
        tokenAddress,
        crypticVaultToken.abi,
        signer
      );
      let balance = await tokenContract.balanceOf(accounts[0]);
      if (balance.toString() !== "0") {
        toast.success("Successfully Signed In as a Member!!");
        localStorage.setItem("admin", data.address);
        navigate("/dashboard/drive");
      } else {
        toast.error("You are not member!!");
      }

      setaLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Something want wrong!!", err);
      setaLoading(false);
    }
  };

  const getMembers = async () => {
    try {
      let arr = [];

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const crypticVaultCon = new ethers.Contract(
        crypticVaultContract,
        crypticVault.abi,
        signer
      );

      let cids = await crypticVaultCon.getMembers(
        localStorage.getItem("admin")
      );

      for (var i = 0; i < cids.length; i++) {
        const meta = await axios.get(
          `https://${cids[i]}.ipfs.infura-ipfs.io//member.json`
        );
        arr[i] = meta.data;
      }
      console.log(arr);
      setMembers(arr);
    } catch (err) {
      console.log(err);
    }
  };

  const createEmergencyAlert = async (data) => {
    try {
      let transactionAlert = await crypticVaultcontractobj.createEmergencyAlert(
        localStorage.getItem("admin"),
        data.subject,
        data.message
      );
      let tx = transactionAlert.wait();
      return tx;
    } catch (err) {
      console.log(err);
    }
  };

  const getEmergencyAlert = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const crypticVaultCon = new ethers.Contract(
        crypticVaultContract,
        crypticVault.abi,
        signer
      );
      let emergencyalert = await crypticVaultCon.getEmergencyAlert(
        localStorage.getItem("admin")
      );
      setEmergencyAlert(emergencyalert);
    } catch (err) {
      console.log(err);
    }
  };

  const sendEmail = async (values) => {
    emailjs
      .send(
        process.env.REACT_APP_EMAIL_JS_SERVICE_ID,
        process.env.REACT_APP_EMAIL_JS_TEMPLATE_ID,
        values,
        process.env.REACT_APP_EMAIL_JS_USER_ID
      )
      .then(
        (result) => {
          toast.success("Message Sent!!");
        },
        (error) => {
          toast.error("Something want wrong!!", err);
        }
      );
  };

  const transferToken = async (address) => {
    const admin = localStorage.getItem("admin");
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const crypticVaultCon = new ethers.Contract(
        crypticVaultContract,
        crypticVault.abi,
        signer
      );
      let tokenAddress = await crypticVaultCon.getTokenAddress(admin);
      console.log(tokenAddress);
      const tokenContract = new ethers.Contract(
        tokenAddress,
        crypticVaultToken.abi,
        signer
      );

      let tokenId = await crypticVaultCon.getTokenId(admin);

      let approveTransaction = await tokenContract.approve(
        address,
        parseInt(tokenId.toString())
      );
      let atx = await approveTransaction.wait();
      if (atx) {
        await crypticVaultCon.transferToken(
          admin,
          address,
          tokenAddress,
          parseInt(tokenId.toString())
        );
        let tx = await crypticVaultCon.setTokenId(
          parseInt(tokenId.toString()) - 1
        );
        return tx;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Web3Context.Provider
      value={{
        connectWallet,
        signInAsAdmin,
        signInAsMember,
        getMembers,
        createEmergencyAlert,
        getEmergencyAlert,
        sendEmail,
        transferToken,
        emergencyAlert,
        members,
        address,
        accounts,
        aLoading,
      }}
      {...props}
    >
      {props.children}
    </Web3Context.Provider>
  );
};
