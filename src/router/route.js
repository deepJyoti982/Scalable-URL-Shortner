const express=require('express')
const urlcontrol=require('../urlcontroller/urlController')
const router=express.Router();

router.post("/url/shorten",urlcontrol.urlshortner)

module.exports = router;