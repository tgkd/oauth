const mongoose = require("mongoose");

const models = require("./db/model");

const fakeData = () => {
    const cli1 = new models.client({
        clientId: "application",
        clientSecret: "secret",
        grants: ["password"],
        redirectUris: [],
    });

    const cli2 = new models.client({
        clientId: "confidentialApplication",
        clientSecret: "topSecret",
        grants: ["password", "client_credentials"],
        redirectUris: [],
    });

    const user = new models.user({
        id: "4533",
        username: "user",
        password: "password",
    });

    cli1.save((err, res) => {
        if (err) {
            return console.error(err);
        }
        console.log("created", res);
    });

    cli2.save((err, res) => {
        if (err) {
            return console.error(err);
        }
        console.log("created", res);
    });

    user.save((err, res) => {
        if (err) {
            return console.error(err);
        }
        console.log("created", res);
    });
};

const dump = () => {
    models.client.find((err, clients) => {
        if (err) {
            return console.error(err);
        }
        console.log("clients", clients);
    });

    models.token.find((err, tokens) => {
        if (err) {
            return console.error(err);
        }
        console.log("tokens", tokens);
    });

    models.user.find((err, users) => {
        if (err) {
            return console.error(err);
        }
        console.log("users", users);
    });
};

/*
 * Methods used by all grant types.
 */

const getAccessToken = token => {
    return models.token.findOne({
        accessToken: token,
    });
};

const getClient = (clientId, clientSecret) => {
    return models.client.findOne({
        clientId: clientId,
        clientSecret: clientSecret,
    });
};

const saveToken = (token, client, user) => {
    token.client = {
        id: client.clientId,
    };
    token.user = {
        id: user.username || user.clientId,
    };
    const tokenInstance = new models.token(token);
    tokenInstance.save();

    return token;
};

const getUser = (username, password) => {
    return models.user.findOne({
        username: username,
        password: password,
    });
};

const getUserFromClient = client => {
    return models.client.findOne({
        clientId: client.clientId,
        clientSecret: client.clientSecret,
        grants: "client_credentials",
    });
};

module.exports = {
    getAccessToken,
    getClient,
    saveToken,
    getUser,
    getUserFromClient,
};
