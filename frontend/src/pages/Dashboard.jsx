import { Appbar } from "../components/Appbar";
import { Users } from "../components/User";
import { Balance } from "../components/balance";
import {useState,useEffect} from "react";
import axios  from "axios";
import { set } from "mongoose";
export function Dashboard(){
    const [balance,setBalance] = useState("");
    useEffect(()=>{
        axios.get("http://localhost:3000/api/v1/account/balance",{
            headers:{
                Authorization:"Bearer "+localStorage.getItem("token")
            }
        })
            .then((response)=>{
                console.log(response.data.balance);
                setBalance(response.data.balance);
            })
    },[])
    return <div>
        <Appbar></Appbar>
        <div className="m-8">
            <Balance value={balance}></Balance>
            <Users/>
        </div>

    </div>
}