import {useRouter} from 'next/router'
import {useFetchUser, fetchUser} from '../../lib/user'
import {useEffect, useState} from "react";

const CodeHandler = () => {
    const router = useRouter()
    const {id} = router.query

    const [userState, setUserState] = useState(null)


    useEffect(() => {
        fetchUser().then(data => {
            if (data === null) {
                // redirect
            }
            setUserState(data)
        }).then(() => {
        })
    }, []);

    // useEffect(() => {
    //     testApi();
    // }, []);

    // console.log(user.locations[user.locations.length - 1]);
    console.log(userState);

    return (
        <div>
            <p>{id}</p>
        </div>
    )
}

export default CodeHandler
