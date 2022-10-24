const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const needle = require("needle");

const app = express();
const router = express.Router();

router.all("/xbl", cors({ origin: process.env.ORIGIN }), async (req, res) => {
  if (!req.header('Target-URL') || !req.header('X-Authorization')) {
    return res.json(
      {
        "message": "A value is missing",
        "status": "400"
      }
    );
  };

  let data;

  await needle(req.method, req.header('Target-URL'), {
    headers: {
      "X-Authorization": req.header('X-Authorization'),
    }
  }
  )
    .then(res => data = data = res.body)
    .catch(err => res.json(err))

  res.json(data);
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
