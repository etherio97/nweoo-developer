const router = require("express").Router();

router.get('/', (req, res) => {
  const verified = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  res.send(challenge).end();
});

module.exports = router;
