const chalk = require("chalk");
const fs = require("fs");

//########### BOT SETTING ###########//
global.owner = "6283122028438"
global.namaOwner = "Jeeyhosting⚡"
global.wa = "https://wa.me/6283122028438"
global.telegram = "https://t.me/Jeeyhosting"
global.mode_public = false
global.linkChannel = "https://whatsapp.com/channel/0029Vb6uESDISTkLnzSn1G3l"
global.idChannel = "120363420310260542@newsletterr"
global.linkGrup = "https://chat.whatsapp.com/IdXBeGq1DqRBDkdz7YbEam"
global.thumbnail = "https://img1.pixhost.to/images/10874/670984471_ochobot.jpg"
// ==================== NOKOS CONFIG ====================
global.apiRumahOTP = "nanti gue isi" // API RumahOTP
global.UNTUNG_NOKOS = 1000 // Keuntungan per transaksi nokos
global.UNTUNG_DEPOSIT = 500 // Fee deposit QRIS
//######### PAYMENT SETTING #########//
global.dana = "083834186945"
global.ovo = ""
global.gopay = "083122028438"
global.qris = "https://files.catbox.moe/fexrgm.jpg"

//####### PUSHKONTAK SETTING ########//
global.JedaPushkontak = 10000
global.JedaJpm = 20000

//########## PANEL SETTING ##########//
global.egg = "15" // Isi id egg
global.nestid = "5" // Isi id nest
global.loc = "1" // Isi id location
global.domain = ""
global.apikey = "" // Isi api ptla
global.capikey = "" // Isi api ptlc

//######### SUBDOMAIN SETTING ########//
global.subdomain = {
  "skypedia.qzz.io": {
    "zone": "59c189ec8c067f57269c8e057f832c74",
    "apitoken": "mZd-PC7t7PmAgjJQfFvukRStcoWDqjDvvLHAJzHF"
  }, 
  "pteroweb.my.id": {
    "zone": "714e0f2e54a90875426f8a689f782d0",
    "apitoken": "vOn3NN5HJut8laSwCjzY-gBO0cxeEdgSLH9WBEH"
  },
  "panelwebsite.biz.id": {
    "zone": "2d6aab40136299392d66eed4a7b1122",
    "apitoken": "CcavVSmQZcGSrTnOos-oXnawq4yf86TUhmQW29S"
  },
  "privatserver.my.id": {
    "zone": "699bb9eb65046a8863991daacb1968",
    "apitoken": "CcavVSmQ6ZcGSrTnOos-oXnawq4yf86TUhmW29S"
  },
  "serverku.biz.id": {
    "zone": "4e4feaba70b41ed78295d2dc090dd3a",
    "apitoken": "CcavVSmQ6ZcGSrTnOos-oXnawq4yf86TUmQW29S"
  },
  "vipserver.web.id": {
    "zone": "e305b750127749c9b80f41a9f4a3a53",
    "apitoken": "cpny6vwi620Tfq4vTF4KGjeJIXdCax3dZArCqnT"
  }, 
  "mypanelstore.web.id": {
    "zone": "c61c442d70392500611499caf816532",
    "apitoken": "uaw-48Yb5tPqhh5HdhNQSJ6dPAcauPL_qKkC-Oa"
  }
}


let file = require.resolve(__filename) 
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.blue(">> Update File :"), chalk.black.bgWhite(`${__filename}`))
delete require.cache[file]
require(file)
})