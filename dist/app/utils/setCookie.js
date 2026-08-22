"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = void 0;
const setAuthCookie = (res, tokenInfo) => {
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
    }
    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
    }
    // if (tokenInfo.accessToken) {
    //     res.cookie("accessToken", tokenInfo.accessToken, {
    //         httpOnly: true,
    //         // Force these to false/lax for HTTP IP testing
    //         secure: false,
    //         sameSite: "lax",
    //         maxAge: 15 * 60 * 1000
    //     });
    // }
    // if (tokenInfo.refreshToken) {
    //     res.cookie("refreshToken", tokenInfo.refreshToken, {
    //         httpOnly: true,
    //         // Force these to false/lax for HTTP IP testing
    //         secure: false,
    //         sameSite: "lax",
    //         maxAge: 7 * 24 * 60 * 60 * 1000
    //     });
    // }
};
exports.setAuthCookie = setAuthCookie;
