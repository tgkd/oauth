const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const OAuth2Server = require("oauth2-server");
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const mongoUri = "mongodb://localhost/oauth";
const model = require("./model.js");

mongoose.connect(
    mongoUri,
    {
        useCreateIndex: true,
        useNewUrlParser: true,
    },
    (err, res) => {
        if (err) {
            return console.error('Error connecting to "%s":', mongoUri, err);
        }
        console.log('Connected successfully to "%s"', mongoUri);
    }
);

app.oauth = new OAuth2Server({
    model,
    accessTokenLifetime: 60 * 60,
    allowBearerTokensInQueryString: true,
});

app.all("/oauth/token", (req, res) => {
    const request = new Request(req);
    const response = new Response(res);

    return app.oauth
        .token(request, response)
        .then(token => {
            res.json(token);
        })
        .catch(err => {
            res.status(err.code || 500).json(err);
        });
});

app.get("/", authenticateRequest, (req, res) => {
    res.send("this is private route");
});

app.listen(3000);

function authenticateRequest(req, res, next) {
    const request = new Request(req);
    const response = new Response(res);

    return app.oauth
        .authenticate(request, response)
        .then(token => {
            next();
        })
        .catch(err => {
            res.status(err.code || 500).json(err);
        });
}
