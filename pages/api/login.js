import auth0 from "../../lib/auth0"

export default async function login(req, res) {
    try {
        await auth0.handleLogin(req, res, {
            authorizationParams: {
                connection: 'Veracross',
            }
        })
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).end(error.message)
    }
}