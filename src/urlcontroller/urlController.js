const urlModel = require('../modules/urlModel')
const validUrl = require('valid-url')

const urlshortner = async (req, res) => {
    try {
        let inurl = req.body
        let { originalUrl } = inurl
        //checking for empty body
        if (Object.keys(inurl).length == 0) return res.status(400).send({ status: false, message: "Enter url in body" })

        //validating url
        if (!validUrl.isUri(originalUrl)) return res.status(400).send({ status: false, message: "Enter a valid url" })
        //creating short url
        let short = "http://localhost:3000/" + originalUrl.replace(/[^a-z]/g, '').slice(-4);
        let code = originalUrl.replace(/[^a-z]/g, '').slice(-4)
        let output = {
            longUrl: originalUrl,
            shortUrl: short,
            urlCode: code
        }
        let search = await urlModel.findOne({ shortUrl: short, urlCode: code })
        //console.log(search)
        //searching for Urlcode and shorturl in DB
        if (search) {
            if (search.urlCode == code) return res.status(400).send({ status: false, message: "urlcode  already exits" })
            if (search.shortUrl == short) return res.status(400).send({ status: false, message: "Shorturl already exits" })
        }
        const result = await urlModel.create(output)
        if (result) {
            res.status(201).send({ status: true, data: output })
        }
    }
    catch (er) {
        res.status(500).send({ status: false, message: er.message })
    }
}
// function for urlshortner
// const urlconverter = (longURL) => {
//     let obj = {}
//     let shortURL = "http://localhost:3000/" + longURL.replace(/[^a-z]/g, '').slice(-4);
//     if (!obj[shortURL]) {
//         obj[shortURL] = longURL;
//     };
//     return shortURL
// }

module.exports = { urlshortner }