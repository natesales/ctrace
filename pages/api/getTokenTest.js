import auth0 from '../../lib/auth0'

export default async function getTokenTest(req, res) {
    try {
        const { accessToken } = await auth0.getSession(req);
        res.json({
            token: accessToken,
        });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).end(error.message)
    }
}