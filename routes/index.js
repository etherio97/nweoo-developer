const router = require("express").Router();
const Auth = require("../middlewares/Auth");
const Guest = require("../middlewares/Guest");

router.get("/", Auth.guard("/auth"), (req, res) =>
  res.render("pages/Home.ejs", {
    title: "Home",
  })
);

router.use("/auth", require("./auth"));

router.use("/deaths", Auth.guard("/auth"), require("./deaths"));

// router.use('/prisoners', Auth.guard('/auth'), require('./prisoners'));

router.use("/webhook", require("./webhook"));

router.use("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
