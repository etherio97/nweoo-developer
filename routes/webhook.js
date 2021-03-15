const router = require("express").Router();
const Message = require("../src/Message");
const storage = [];

let lastUpdated;

router.get('/', (req, res) => {
    const verified = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (process.env.APP_SECRET === verified) {
        res.send(challenge).end();
    } else {
        if (req.session['loggedIn']) {
            res.json({
                count: storage.total,
                messages: storage,
                lastUpdated: new Date(lastUpdated),
            });
        } else {
            res.status(403).end();
        }
    }
});

router.post('/', (req, res) => {
    const verified = req.query["hub.verify_token"];
    if (process.env.APP_SECRET === verified) {
        lastUpdated = Date.now();
        // Message.create({
        //   message: '',
        // });
        console.log(req.query, req.body);
        storage.push({
            q: req.query,
            d: req.body,
        })
        res.status(200).end();
    } else {
        res.status(403).end();
    }
});

module.exports = router;