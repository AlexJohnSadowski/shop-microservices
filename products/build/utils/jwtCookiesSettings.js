"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessTokenCookieOptions = exports.minutesAccessTokenExpiresIn = exports.cookiesOptions = void 0;
exports.cookiesOptions = {
    httpOnly: true,
    sameSite: "lax",
};
exports.minutesAccessTokenExpiresIn = 15;
if (process.env.NODE_ENV === "production")
    exports.cookiesOptions.secure = true;
exports.accessTokenCookieOptions = Object.assign(Object.assign({}, exports.cookiesOptions), { expires: new Date(Date.now() + exports.minutesAccessTokenExpiresIn * 60 * 1000), maxAge: exports.minutesAccessTokenExpiresIn * 60 * 1000 });
