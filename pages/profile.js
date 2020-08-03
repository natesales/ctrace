//This page is for testing auth connections. We can delete this when we have integrated it into the main page.

import {useFetchUser} from '../lib/user'
import {useEffect} from "react";

function ProfileCard({ user }) {
    return (
        <>
            <h1>Profile</h1>

            <div>
                <h3>Profile (client rendered)</h3>
                <img src={user.picture} alt="user picture" />
                <p>nickname: {user.nickname}</p>
                <p>name: {user.name}</p>
            </div>
        </>
    )
}

function Profile() {
    const {user, loading} = useFetchUser({required: true});

    async function testApi() {
        const testcall = await fetch('http://localhost:3000/api/checkout', {
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

    useEffect(() => {
        testApi();
    }, []);

    return (
        <div>
            {loading ? <>Loading...</> : <ProfileCard user={user.google_info}/>}
        </div>
    )
}

export default Profile