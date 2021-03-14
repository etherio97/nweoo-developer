const router = require("express").Router();
const storage = require("../src/storage");

router.get('/', (req, res) => {
  const verified = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (Object.values(req.body).length) {
    storage.push(req.body);
  }
  res.send(challenge).end();
});

module.exports = router;
