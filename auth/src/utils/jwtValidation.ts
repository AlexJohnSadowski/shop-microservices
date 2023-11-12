import { verifyJwt } from '../service/jwt/jwt.service';
import { client as redisClient } from '../../db/redis';
import { findUniqueUser } from '../service/user/user.service';

// Function to validate the JWT
async function validateJwt(req: any) {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
        return null;
    }

    const refresh_token = req.cookies.refresh_token;
    const message = 'You must log in in order to access this page';

    if (!refresh_token) {
        return null;
    }

    // Validate refresh token
    const decoded = verifyJwt<{
        userId: string;
        iat: number;
        exp: number;
    }>(refresh_token, 'refreshTokenPrivateKey');

    if (!decoded) {
        return null;
    }

    // Check if auth has a valid session
    const session = await redisClient.get(decoded.userId);
    if (!session) {
        return null;
    }

    // Check if auth still exists
    const user = await findUniqueUser({ id: JSON.parse(session).id });
    if (!user) {
        return null;
    }

    return user;
}

export { validateJwt };
