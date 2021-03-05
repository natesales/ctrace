import {initAuth0} from "@auth0/nextjs-auth0"

export default initAuth0({
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    secret: process.env.SESSION_COOKIE_SECRET,
    authorizationParams: {
        scope: process.env.AUTH0_SCOPE,
    },
    issuerBaseURL: process.env.AUTH0_DOMAIN,
    routes: {
        callback: process.env.REDIRECT_URI,
        postLogoutRedirect: process.env.POST_LOGOUT_REDIRECT_URI
    },
    session: {
        rollingDuration: 60 * 60 * 24 * 7,
    },
})