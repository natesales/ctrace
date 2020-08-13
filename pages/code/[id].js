import {useRouter} from 'next/router'
import {useFetchUser} from '../../lib/user'
import {useEffect} from "react";

const CodeHandler = () => {
    const router = useRouter()
    const {id} = router.query
    const {user, loading} = useFetchUser({required: true});

    async function testApi() {
        const testcall = await fetch('/api/checkin', {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "uid": "knightss",
                "location": "5f27b02471019f2f46a9c819"
            }),
        }).then(response => response.json())
            .then(data => console.log(data))
            .catch(error => {
                console.log(error);
            });
    }

    // useEffect(() => {
    //     testApi();
    // }, []);

    // console.log(user.locations[user.locations.length - 1]);
    console.log(user);

    return (
        <div>
            <p>{id}</p>
        </div>
    )
}

export default CodeHandler
