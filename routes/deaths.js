const { default: axios } = require("axios");
const router = require("express").Router();

router.get("/", (req, res) =>
  res.render("pages/Deaths", {
    title: "Deaths",
  })
);

router.get("/create", (req, res) =>
  res.render("pages/DeathUpdate", {
    title: "Add new deceased",
  })
);

router.get("/total", (req, res) =>
  res.render("pages/DeathTotal", {
    title: "Update Death Total",
  })
);

router.post("/total", (req, res) => {
  const { date, death } = req.body;
  axios
    .patch(
      `https://nwe-oo-default-rtdb.firebaseio.com/v0/public/prisoners/${date}`,
      { death }
    )
    .then(() => res.status(201).redirect("/deaths"))
    .catch((e) => res.status(400).end({ error: e.message }));
});

module.exports = router;
