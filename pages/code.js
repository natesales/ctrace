import {fetchUser} from "../lib/user";
import {useEffect} from "react";
import {useRouter} from "next/router";

const CodeHandler = () => {
    const router = useRouter();
    console.log(router.query)

    useEffect(() => {
        fetchUser().then(data => {
            const id = router.query.id;

            if (id !== undefined) {
                if (data === null) {
                    window.location.href = "/api/login";
                }

                if (data["current_location"]["time_out"] === undefined) { // If checked in
                    console.log("You are trying to check out from " + id)
                    if (data["current_location"]["_id"] === id) {
                        fetch("/api/checkin", {
                            method: "POST",
                            credentials: "include",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({
                                "location": id,
                            })
                        }).then(response => console.log(response))
                    } else { // TODO: Display this on screen
                        console.log("You are trying to check out from a location that you aren't checked into.")
                    }
                } else { // If not checked in
                    fetch("/api/checkout", {
                        method: "POST",
                        credentials: "include",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            "location": id,
                        })
                    }).then(response => console.log(response))
                }
            }
        });
    });

    return (
        <div>
            <p>Test</p>
        </div>
    )
}

export default CodeHandler
