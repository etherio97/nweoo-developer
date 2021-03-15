const router = require("express").Router();
const Message = require("../src/Message");
const storage = [];

router.get('/', (req, res) => {
    const verified = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (process.env.APP_SECRET === verified) {
        res.send(challenge).end();
    } else {
        res.status(403).end();
    }
});

router.post('/', (req, res) => {
    const verified = req.query["hub.verify_token"];
    if (process.env.APP_SECRET === verified) {
        // Message.create({
        //   message: '',
        // });

    } else {
        res.status(403).end();
    }
});

module.exports = router;