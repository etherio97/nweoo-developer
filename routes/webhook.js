const router = require("express").Router();
const Message = require("../src/Message");

router.get('/', (req, res) => {
    const verified = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (process.env.APP_SECRET === verified) {
        res.send(challenge).end();
    } else {
        if (req.session['loggedIn']) {
            Message
                .find({})
                .then(messages => res.json(messages));
        } else {
            res.status(401).end('/auth');
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

    for (const entry of entries) {
        for (const message of(entry.messaging || [])) {
            const sender = message.sender && message.sender['id'];
            const recipient = message.recipient && message.recipient['id'];
            const text = message.message && message.message['text'];
            if (!sender || !recipient) {
                console.log('unable to update new message from webhook, required: sender.id, recipient.id');
                return res.status(200).end()
            }
            await Message
                .create({
                    sender,
                    recipient,
                    text,
                    timestamp: message.timestamp || Date.now(),
                })
                .then(() => res.status(201).end())
                .catch(() => res.status(400).end());
        }
    }

});

module.exports = router;