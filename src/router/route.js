const express=require('express')
const urlcontrol=require('../controller/urlController')
const router=express.Router();

router.post("/url/shorten",urlcontrol.urlshortner)
router.get("/:urlCode",urlcontrol.getUrl)

module.exports = router;