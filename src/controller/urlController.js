const urlModel = require('../models/urlModel')
const validUrl = require('valid-url');
const shortid = require('shortid');

const redis = require('redis');
const { promisify } = require("util");



//Connect to redis=================================================
const redisClient = redis.createClient(
    17425,
    "redis-17425.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("zjPKzUaStEUId0o23JdDoM8IF5SLaJtQ", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});
//connection established😮😮😮=================================================



//=======================================================[CREATE SHORT URL]=============================================================

const urlshortner = async (req, res) => {
    try {
        let inurl = req.body
        //checking for empty body
        if (Object.keys(inurl).length == 0) return res.status(400).send({ status: false, message: "Enter url in body" })
        let { originalUrl } = inurl

        //validating url
        if (!validUrl.isUri(originalUrl)) return res.status(400).send({ status: false, message: "Enter a valid url" })
        //creating short url
        let code=shortid.generate().toLowerCase()
        let short = "http://localhost:3000/" + code
        let output = {
            longUrl: originalUrl,
            shortUrl: short,
            urlCode: code
        }

        let findlongurl = await urlModel.findOne({ longUrl: originalUrl }).select({ __v: 0, _id: 0, createdAt: 0, updatedAt: 0 })
        if (findlongurl) {
            return res.status(201).send({ status: true, message: "Url already exits in DB", data: findlongurl })
        }

        if(await urlModel.create(output)) res.status(201).send({ status: true, data: output })
    }
    catch (er) {
        res.status(500).send({ status: false, message: er.message })
    }
}


//======================================================[GET URL API]===========================================================================
//🛰🛰🛰Redis calls
const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const getUrl = async function (req,res) {
    try {
        let code = req.params.urlCode
        let Url = await GET_ASYNC(`${req.params.urlCode}`)
        //console.log(Url)
        if (!Url) {

            let checkdb = await urlModel.findOne({ urlCode: code });
            
            if (!checkdb) return res.status(404).send({ status: false, message: `No url found with ${code}  code` })
            await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(checkdb.longUrl))
            
            return res.redirect(301,checkdb.longUrl)
            
        }
        
        return res.redirect(301,Url)
        
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { urlshortner , getUrl }