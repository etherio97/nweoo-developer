const router = require("express").Router();
const Message = require("../src/Message");

let lastUpdated;

router.get('/', (req, res) => {
    const verified = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (process.env.APP_SECRET === verified) {
        res.send(challenge).end();
    } else {
        if (req.session['loggedIn']) {
            Message.getAll().then(messages => res.json({
                messages,
                lastUpdated,
            }));
        } else {
            res.status(403).end();
        }
    }
});

router.post('/', async(req, res) => {
    const entries = req.body['entry'] || {};
    // const apiVersion = req.headers['facebook-api-version'];
    const userAgent = req.headers['user-agent'];
    const signature = req.headers['x-hub-signature'];

    if (!signature || userAgent !== 'facebookexternalua') {
        return res.status(403).end();
    }

    lastUpdated = Date.now();

    for (const entry of entries) {
        for (const message of(entry.messaging || [])) {
            const sender = message.sender && message.sender['id'];
            const recipient = message.recipient && message.recipient['id'];
            const text = message.message && message.message['text'];
            if (!sender || !recipient || !text) {
                console.log('unable to update new message from webhook!', message);
                return res.status(200).end()
            }
            await Message.create({
                sender,
                recipient,
                text,
                timestamp: message.timestamp,
            });
        }
    }

    res.status(201).end();
});

module.exports = router;