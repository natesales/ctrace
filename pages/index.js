import React from "react";
import {useEffect} from "react";

export default function Index() {
    
    useEffect(() => {
        window.location.href = "/home"
    }, [])
    
    return (
        <div className="login-body">
        </div>
    )
}