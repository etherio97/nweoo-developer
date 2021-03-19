const router = require("express").Router();
const Message = require("../src/Message");
const Auth = require("../middlewares/Auth");

router.get("/", (req, res) => {
  const verified = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (process.env.APP_SECRET === verified) {
    res.send(challenge).end();
  } else {
    if (req.session["loggedIn"]) {
      Message.find({}).then((messages) =>
        res.json(
          messages
            .map(({ _id, sender, timestamp, text }) => ({
              id: _id,
              sender: "*".repeat(sender.length - 8) + sender.slice(-8),
              text,
              timestamp,
            }))
            .reverse()
        )
      );
    } else {
      res.redirect("/auth");
    }
  }
});

router.post("/", (req, res) => {
  const entries = req.body["entry"] || {};
  const userAgent = req.headers["user-agent"];
  const signature = req.headers["x-hub-signature"];

  if (!signature || userAgent !== "facebookexternalua") {
    return res.status(403).end();
  }

  new Promise(async (resolve, reject) => {
    for (const entry of entries) {
      const messages = entry.messaging || [];
      for (const message of messages) {
        const sender = message.sender && message.sender["id"];
        const recipient = message.recipient && message.recipient["id"];
        const text = message.message && message.message["text"];
        if (!sender || !recipient) {
          return res.status(400).json({
            code: 400,
            error: "required fields: sender.id, recipient.id, text",
          });
        }
        await Message.create({
          sender,
          recipient,
          text,
          timestamp: message.timestamp || Date.now(),
        })
          .then(() => resolve())
          .catch((e) => reject(e));
      }
    }
  })
    .then(() => res.status(201).end())
    .catch(
      (e) =>
        console.log(e) |
        res.status(500).json({
          code: 500,
          error: e.message,
        })
    );
});

router.get("/:id", Auth.guard("/"), (req, res) => {
  const { action } = req.query;
  if (!action)
    return res.status(400).json({ error: "query parameter: action required" });
  switch (action) {
    case "approved":
      res.redirect("/?action=approved&status=0");
      break;
    case "remove":
      Message.deleteOne({ _id: req.params["id"] }).then((done) =>
        res.redirect("/?action=remove&status=1")
      );
      break;
    default:
      res.status(400).json({
        error: "unexcepted action: " + action,
      });
  }
});

module.exports = router;
