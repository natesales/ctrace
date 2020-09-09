import {useEffect} from "react";
import {useRouter} from "next/router";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";

const CodeHandler = () => {
    const router = useRouter()
    console.log(router.query)

    useEffect(() => {
        fetch("/api/me", {
            credentials: "include",
        }).then(response => response.json()).then(data => {
            const id = router.query.id

            if (id !== undefined) {
                if (data === null) {
                    window.location.href = "/api/login?redirectTo=/code?id=" + id
                }

                if (data["current_location"] === null) { // If not checked in
                    console.log("Checking you into " + id)

                    fetch("/api/checkin", {
                        method: "POST",
                        credentials: "include",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            "location": id,
                        })
                    }).then(response => {
                        console.log(response)
                        window.location.href = "/home";
                    })
                } else { // If checked in
                    if (data["current_location"]["_id"] === id) {
                        console.log("Checking you out of " + id)

                        fetch("/api/checkout", {
                            method: "POST",
                            credentials: "include",
                            headers: {"Content-Type": "application/json"}
                        }).then(response => {
                            console.log(response)
                            window.location.href = "/home";
                        })
                    } else {
                        console.log("You aren't checked into this location!")
                    }
                }
            }
        });
    });

    return (
        <div>
            <Grid container justify="center">
                <CircularProgress/>
            </Grid>
        </div>
    )
}

export default CodeHandler
