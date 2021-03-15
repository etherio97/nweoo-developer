const router = require("express").Router();
const storage = require("../src/storage");

router.get('/', (req, res) => {
  const verified = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  res.send(challenge).end();
});

router.post('/', (req, res) => {
  storage.push(req.body);
  res.end();
});

module.exports = router;
