const express = require("express");
const serverless = require("serverless-http");
const request = require("request");
const bodyParser = require("body-parser")

const app = express();
const router = express.Router();

let myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
app.use(bodyParser.json({limit: myLimit}));

router.all("/xbl", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        res.send();
    } else {
        let targetURL = req.header('Target-URL');
        if (!targetURL) {
            res.send(500, { error: 'There is no Target-Endpoint header in the request' });
            return;
        }
        request({ url: targetURL + req.url, method: req.method, json: req.body, headers: {'X-Authorization': req.header('X-Authorization')} },
            function (error, response) {
                if (error) {
                    console.error('error: ' + response.statusCode)
                }
            }).pipe(res);
    }
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
