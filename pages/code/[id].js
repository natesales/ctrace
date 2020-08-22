import {useRouter} from "next/router"
import {fetchUser} from "../../lib/user"
import {useEffect} from "react";

const CodeHandler = () => {
    const router = useRouter()
    const {id} = router.query

    useEffect(() => {
        fetchUser().then(data => {
            if (data === null) {
                window.location.href = "/api/login";
            }

            if (data["current_location"] !== null) { // If checked in
                if (data["current_location"]["_id"] === id) {
                    fetch("/api/checkin",
                        {method: "post"})
                        .then(rsp => console.log(rsp));
                } else { // TODO: Display this on screen
                    console.log("You are trying to check out from a location that you aren't checked into.")
                }
            } else { // If not checked in
                fetch("/api/checkin", {
                    method: "POST",
                    credentials: "include",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        "location": id,
                    })
                }).then(resp => console.log(resp));
            }
        });
    }, []);

    return (
        <div>
            <p>{id}</p>
        </div>
    )
}

export default CodeHandler
