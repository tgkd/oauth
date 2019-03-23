const mongoose = require("mongoose");
const schema = require("../schema/index");

const MODEL_NAMES = ["client", "user", "token"];

const instanses = {};

MODEL_NAMES.forEach(n => {
    const def = schema[n];
    const inst = mongoose.Schema(def);

    if (n === "token") {
        inst.index({ accessTokenExpiresAt: 1 }, { expireAfterSeconds: 0 });
    }

    instanses[n] = mongoose.model(n, inst);
});

console.log(instanses);

module.exports = instanses;
