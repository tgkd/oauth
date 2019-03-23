module.exports = {
    client: {
        clientId: String,
        clientSecret: String,
        grants: [String],
        redirectUris: [String],
    },

    token: {
        accessToken: String,
        accessTokenExpiresAt: Date,
        refreshToken: String,
        refreshTokenExpiresAt: Date,
        client: Object,
        user: Object
    },

    user: {
        username: String,
        password: String,
    }
};
