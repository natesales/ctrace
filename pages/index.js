import React from "react";
import {useEffect} from "react";

export default function Index() {
    
    useEffect(() => {
        fetch("/api/me", {
            credentials: "include",
        }).then(response => response.json()
        ).then(data => {
            data.error === "not_authenticated" ? window.location.href = "/api/login?redirectTo=/home" : window.location.href= "/home"
        }).catch(error => {
            console.log(error)
        })
    }, [])
    
    return (
        <div className="login-body">
        </div>
    )
}