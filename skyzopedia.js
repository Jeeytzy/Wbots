const util = require("util");
const chalk = require("chalk");
const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");
const ssh2 = require("ssh2");
const { exec, spawn, execSync } = require('child_process');
const { prepareWAMessageMedia, generateWAMessageFromContent } = require("baileys");
const LoadDataBase = require("./source/LoadDatabase.js");

//###############################//
module.exports = async (m, sock) => {
try {
await LoadDataBase(sock, m)

// Initialize nokos settings
if (!global.db.settings.nokos) {
    global.db.settings.nokos = {
        enablePrivate: true,
        enableGroup: false,
        autoCheckInterval: 2000
    };
}

const isCmd = m?.body?.startsWith(m.prefix)
// ... lanjutan kode
const quoted = m.quoted ? m.quoted : m
const mime = quoted?.msg?.mimetype || quoted?.mimetype || null
const args = m.body.trim().split(/ +/).slice(1)
const qmsg = (m.quoted || m)
const text = q = args.join(" ")
const command = isCmd ? m.body.slice(m.prefix.length).trim().split(' ').shift().toLowerCase() : ''
const cmd = m.prefix + command
const botNumber = await sock.user.id.split(":")[0]+"@s.whatsapp.net"
const isOwner = global.owner+"@s.whatsapp.net" == m.sender || m.sender == botNumber || db.settings.developer.includes(m.sender)
const isReseller = db.settings.reseller.includes(m.sender)
  m.isGroup = m.chat.endsWith('g.us');
  m.metadata = {};
  m.isAdmin = false;
  m.isBotAdmin = false;
  if (m.isGroup) {
    let meta = await global.groupMetadataCache.get(m.chat)
    if (!meta) meta = await sock.groupMetadata(m.chat).catch(_ => {})
    m.metadata = meta;
    const p = meta?.participants || [];
    m.isAdmin = p?.some(i => (i.id === m.sender || i.jid === m.sender) && i.admin !== null);
    m.isBotAdmin = p?.some(i => (i.id === botNumber || i.jid == botNumber) && i.admin !== null);
  } 
// ==================== NOKOS GLOBAL CACHE ====================
if (!global.cachedServicesNokos) global.cachedServicesNokos = [];
if (!global.cachedCountriesNokos) global.cachedCountriesNokos = {};
if (!global.activeOrdersNokos) global.activeOrdersNokos = {};
if (!global.lastNokosData) global.lastNokosData = {};

//###############################//

if (isCmd) {
console.log(chalk.white("• Sender :"), chalk.blue(m.chat) + "\n" + chalk.white("• Command :"), chalk.blue(cmd) + "\n")
}

//###############################//

if (!isCmd && m.body) {
const responder = db.settings.respon.find(v => v.id.toLowerCase() == m.body.toLowerCase())
if (responder && responder.response) {
await m.reply(responder.response)
}}

//###############################//

const FakeChannel = {
  key: {
    remoteJid: 'status@broadcast',
    fromMe: false,
    participant: '0@s.whatsapp.net'
  },
  message: {
    newsletterAdminInviteMessage: {
      newsletterJid: '123@newsletter',
      caption: `Powered By ${global.namaOwner}.`,
      inviteExpiration: 0
    }
  }
}

//###############################//

const FakeSticker = {
        key: {
            fromMe: false,
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast"
        },
        message: {
            stickerPackMessage: {
                stickerPackId: "\000",
                name: `Powered By ${global.namaOwner}.`,
                publisher: "kkkk"
            }
        }
    }


//###############################//

if (global.db.groups[m.chat]?.antilink === true) {
    const textMessage = m.text || ""
    const groupInviteLinkRegex = /(https?:\/\/)?(www\.)?chat\.whatsapp\.com\/[A-Za-z0-9]+(\?[^\s]*)?/gi
    const links = textMessage.match(groupInviteLinkRegex)
    if (links && !isOwner && !m.isAdmin && m.isBotAdmin) {
        const senderJid = m.sender
        const messageId = m.key.id
        const participantToDelete = m.key.participant || m.sender
        await sock.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: messageId,
                participant: participantToDelete
            }
        })
        await sleep(800)
        await sock.groupParticipantsUpdate(m.chat, [senderJid], "remove")
    }
}

//###############################//

if (global.db.groups[m.chat]?.antilink2 === true) {
    const textMessage = m.text || ""
    const groupInviteLinkRegex = /(https?:\/\/)?(www\.)?chat\.whatsapp\.com\/[A-Za-z0-9]+(\?[^\s]*)?/gi
    const links = textMessage.match(groupInviteLinkRegex)
    if (links && !isOwner && !m.isAdmin && m.isBotAdmin) {
        const messageId = m.key.id
        const participantToDelete = m.key.participant || m.sender
        await sock.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: messageId,
                participant: participantToDelete
            }
        })
    }
}

//###############################//
if (global.topupState && global.topupState[m.sender]?.waiting) {
    const input = m.body.toLowerCase().trim();
    
    if (input === "batal") {
        delete global.topupState[m.sender];
        return m.reply("❌ Topup dibatalkan.");
    }
    
    const amount = parseInt(input);
    if (isNaN(amount) || amount < 2000) {
        return m.reply("🚫 Nominal tidak valid!\n\nMinimal Rp 2.000\nContoh: 5000");
    }
    
    delete global.topupState[m.sender];
    
    // Redirect ke proses deposit
    text = amount.toString();
    args[0] = amount;
    m.body = `.topup_nokos ${amount}`;
    command = "topup_nokos";
}
switch (command) {
case "menu": {
const img = JSON.parse(fs.readFileSync("./source/thumbnail.json"))
const teks = `
Haii @${m.sender.split("@")[0]} 👋
Selamat ${ucapan()}

*# Bot - Information*
- Botmode: ${sock.public ? "Public" : "Self"}
- Runtime: ${runtime(process.uptime())}
- Developer: @${global.owner}

*# Main - Menu*
- .brat
- .tourl
- .sticker
- .cekidch

*# Grup - Menu*
- .welcome
- .hidetag
- .kick
- .open
- .close

*# Store - Menu*
- .pushkontak
- .pushkontak2
- .savekontak
- .stoppush
- .setjeda
- .savenomor
- .jpm
- .jpmht
- .jpmch
- .stopjpm
- .payment
- .proses
- .done

*# Panel - Menu*
- .addseller
- .delseller
- .listseller
- .1gb - unlimited
- .delpanel
- .listpanel
- .cadmin
- .deladmin
- .listadmin
- .subdomain
- .installpanel

*# Owner - Menu*
- .sc
- .addrespon
- .listrespon
- .delrespon
- .bljpm
- .delbljpm
- .addowner
- .listowner
- .delowner
- .resetdb
`;
let msg = await generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
        message: {
            interactiveMessage: {
                header: {
                    ...img,
                    hasMediaAttachment: true
                },
                body: { 
                    text: teks 
                },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: 'cta_url',
                            buttonParamsJson: JSON.stringify({
                                display_text: "Contact Developer",
                                url: global.wa,
                                merchant_url: global.wa
                            })
                        }, 
                        {
                            name: 'cta_url',
                            buttonParamsJson: JSON.stringify({
                                display_text: "Contact Developer",
                                url: global.wa,
                                merchant_url: global.wa
                            })
                        }
                    ],
                    messageParamsJson: JSON.stringify({
                        limited_time_offer: {
                            text: global.telegram,
                            url: global.telegram,
                            copy_code: "1",
                            expiration_time: 0
                        },
                        bottom_sheet: {
                            in_thread_buttons_limit: 2,
                            divider_indices: [1, 2, 3, 4, 5, 999],
                            list_title: "Jeeystore",
                            button_title: "Jeeystore"
                        },
                        tap_target_configuration: {
                            title: "1",
                            description: "bomboclard",
                            canonical_url: global.telegram,
                            domain: "jeey.com",
                            button_index: 0
                        }
                    })
                },
                contextInfo: {
                    mentionedJid: [m.sender]
                }
            }
        }
    }
}, { 
    userJid: m.sender,
    quoted: m
});

await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}
break

//###############################//

case "addrespon": {
if (!isOwner) return m.reply(mess.owner)
if (!text || !text.includes("|")) return m.reply(`*Contoh :* ${cmd} cmd|response`)
let [ id, response ] = text.split("|")
id = id.toLowerCase()
const res = db.settings.respon
if (res.find(v => v.id.toLowerCase() == id)) return m.reply(`Cmd ${id} sudah terdaftar dalam listrespon\nGunakan Cmd lain!`)
db.settings.respon.push({
id, 
response
})
return m.reply(`*Sukses Menambah Listrespon ✅*

- Cmd: ${id}
- Response: ${response}`)
}
break

//###############################//

case "listrespon": {
if (db.settings.respon.length < 1) return m.reply("Tidak ada listrespon.")
let teks = ""
for (let i of db.settings.respon) {
teks += `\n- *Cmd:* ${i.id}
- *Response:* ${i.response}\n`
}
return m.reply(teks)
}
break

//###############################//

case "delrespon": {
if (!isOwner) return m.reply(mess.owner)
if (!text) return m.reply(`*Contoh :* ${cmd} cmdnya`)
if (text.toLowerCase() == "all") {
db.settings.respon = []
return m.reply(`Berhasil menghapus semua Cmd Listrespon ✅`)
}
let res = db.settings.respon.find(v => v.id == text.toLowerCase())
if (!res) return m.reply(`Cmd Respon Tidak Ditemukan!\nKetik *.listrespon* Untuk Melihat Semua Cmd Listrespon`)
const posi = db.settings.respon.indexOf(res)
db.settings.respon.splice(posi, 1)
return m.reply(`Berhasil menghapus Cmd Listrespon *${text}* ✅`)
}
break

//###############################//

case "bljpm": case "bl": {
if (!isOwner) return m.reply(mess.owner);
let rows = []
const a = await sock.groupFetchAllParticipating()
if (a.length < 1) return m.reply("Tidak ada grup chat.")
const Data = Object.values(a)
let number = 0
for (let u of Data) {
const name = u.subject || "Unknown"
rows.push({
title: name,
description: `ID - ${u.id}`, 
id: `.bljpm-response ${u.id}|${name}`
})
}
await sock.sendMessage(m.chat, {
  buttons: [
    {
    buttonId: 'action',
    buttonText: { displayText: 'ini pesan interactiveMeta' },
    type: 4,
    nativeFlowInfo: {
        name: 'single_select',
        paramsJson: JSON.stringify({
          title: 'Pilih Grup',
          sections: [
            {
              title: `© Powered By ${namaOwner}`,
              rows: rows
            }
          ]
        })
      }
      }
  ],
  headerType: 1,
  viewOnce: true,
  text: `\nPilih Salah Grup Chat\n`
}, { quoted: m })
}
break

//###############################//

case "bljpm-response": {
if (!isOwner) return m.reply(mess.owner)
if (!text || !text.includes("|")) return
const [ id, grupName ] = text.split("|")
if (db.settings.bljpm.includes(id)) return m.reply(`Grup ${grupName} sudah terdaftar dalam Blacklist Jpm`)
db.settings.bljpm.push(id)
return m.reply(`Berhasil Blacklist Grup ${grupName} Dari Jpm`)
}
break

//###############################//

case "delbl":
case "delbljpm": {
    if (!isOwner) return m.reply(mess.owner);

    if (db.settings.bljpm.length < 1) 
        return m.reply("Tidak ada data blacklist grup.");

    const groups = await sock.groupFetchAllParticipating();
    const Data = Object.values(groups);

    let rows = [];
    // opsi hapus semua
    rows.push({
        title: "🗑️ Hapus Semua",
        description: "Hapus semua grup dari blacklist",
        id: `.delbl-response all`
    });

    for (let id of db.settings.bljpm) {
        let name = "Unknown";
        // cari nama grup dari daftar grup aktif
        let grup = Data.find(g => g.id === id);
        if (grup) name = grup.subject || "Unknown";

        rows.push({
            title: name,
            description: `ID Grup - ${id}`,
            id: `.delbl-response ${id}|${name}`
        });
    }

    let msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { 
                        text: `Pilih Grup Untuk Dihapus Dari Blacklist\n\nTotal Blacklist: ${db.settings.bljpm.length}` 
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Daftar Blacklist Grup",
                                    sections: [
                                        {
                                            title: "Blacklist Terdaftar",
                                            rows: rows
                                        }
                                    ]
                                })
                            }
                        ]
                    }
                }
            }
        }
    }, { userJid: m.sender, quoted: m });

    await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}
break;

//###############################//

case "delbl-response": {
    if (!isOwner) return m.reply(mess.owner);
    if (!text) return;

    if (text === "all") {
        db.settings.bljpm = [];
        return m.reply("✅ Semua data blacklist grup berhasil dihapus.");
    }

    if (text.includes("|")) {
        const [id, grupName] = text.split("|");
        if (!db.settings.bljpm.includes(id)) 
            return m.reply(`❌ Grup *${grupName}* tidak ada dalam blacklist.`);

        db.settings.bljpm = db.settings.bljpm.filter(g => g !== id);
        return m.reply(`✅ Grup *${grupName}* berhasil dihapus dari blacklist.`);
    }
}
break;

//###############################//

case "payment":
case "pay": {
    let msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    header: {
                    hasMediaAttachment: true, 
                    ...(await prepareWAMessageMedia({ image: { url: global.qris } }, { upload: sock.waUploadToServer })),
                    }, 
                    body: { 
                        text: `*Daftar Payment ${namaOwner} 🔖*`
                    },
                    footer: { 
                        text: "Klik tombol di bawah untuk menyalin nomor e-wallet" 
                    },
                    nativeFlowMessage: {
                        buttons: [
                            { 
                                name: "cta_copy",
                                buttonParamsJson: `{"display_text":"Copy Dana","copy_code":"${global.dana}"}`
                            },
                            { 
                                name: "cta_copy",
                                buttonParamsJson: `{"display_text":"Copy OVO","copy_code":"${global.ovo}"}`
                            },
                            { 
                                name: "cta_copy",
                                buttonParamsJson: `{"display_text":"Copy Gopay","copy_code":"${global.gopay}"}`
                            },
                        { 
                            name: "cta_url",
                            buttonParamsJson: `{"display_text":"Open QRIS","url":"https://qris.zone.id/nfstore"}`
                            }
                        ]
                    }
                }
            }
        }
    }, { userJid: m.sender, quoted: m });

    await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}
break;

//###############################//

case "cekidch":
case "idch": {
    if (!text) return m.reply(`*Contoh :* ${cmd} link channel`); 
    if (!text.includes("https://whatsapp.com/channel/")) {
        return m.reply("Link channel tidak valid");
    }

    let result = text.split("https://whatsapp.com/channel/")[1];
    let res = await sock.newsletterMetadata("invite", result);
    let teks = `*Channel ID Ditemukan ✅*\n\n- ${res.id}`;

    let msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { text: teks },
                    nativeFlowMessage: {
                        buttons: [
                            { 
                                name: "cta_copy",
                                buttonParamsJson: `{"display_text":"Copy Channel ID","copy_code":"${res.id}"}`
                            }
                        ]
                    }
                }
            }
        }
    }, { userJid: m.sender, quoted: m });

    await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}
break;

//###############################//

case "done":
case "don":
case "proses":
case "ps": {
    if (!isOwner) return m.reply(mess.owner);
    if (!text) return m.reply(`*Contoh :* ${cmd} nama barang`);

    const status = /done|don/.test(command) ? "Transaksi Done ✅" : "Dana Telah Diterima ✅";

    const teks = `${status}

📦 Pembelian : ${text}

📢 Cek Testimoni Pembeli:
${global.linkChannel || "-"}

📣 Gabung Grup Share & Promosi:
${global.linkGrup || "-"}`;

    let msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { text: teks },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "cta_url",
                                buttonParamsJson: `{"display_text":"Channel Testimoni","url":"${global.linkChannel}"}`
                            },
                            {
                                name: "cta_url",
                                buttonParamsJson: `{"display_text":"Grup Marketplace","url":"${global.linkGrup}"}`
                            }
                        ]
                    }, 
                    contextInfo: {
                     isForwarded: true
                    }
                }
            }
        }
    }, {});

    await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}
break;

//###############################//

case "tourl": {
    if (!/image|video|audio|application/.test(mime)) 
        return m.reply(`Media tidak ditemukan!\nKetik *${cmd}* dengan reply/kirim media`)

    const FormData = require('form-data');
    const { fromBuffer } = require('file-type');    

    async function dt(buffer) {
        const fetchModule = await import('node-fetch');
        const fetch = fetchModule.default;
        let { ext } = await fromBuffer(buffer);
        let bodyForm = new FormData();
        bodyForm.append("fileToUpload", buffer, "file." + ext);
        bodyForm.append("reqtype", "fileupload");
        let res = await fetch("https://catbox.moe/user/api.php", {
            method: "POST",
            body: bodyForm,
        });
        let data = await res.text();
        return data;
    }

    let aa = m.quoted ? await m.quoted.download() : await m.download();
    let dd = await dt(aa);

    // bikin button copy url
    let msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { text: `✅ Media berhasil diupload!\n\nURL: ${dd}` },
                    nativeFlowMessage: {
                        buttons: [
                            { 
                                name: "cta_copy", 
                                buttonParamsJson: `{"display_text":"Copy URL","copy_code":"${dd}"}`
                            }
                        ]
                    }
                }
            }
        }
    }, { userJid: m.sender, quoted: m });

    await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}
break;

//###############################//

case "tourl2": {
    if (!/image/.test(mime)) 
        return m.reply(`Media tidak ditemukan!\nKetik *${cmd}* dengan reply/kirim foto`)
    try {
        const { ImageUploadService } = require('node-upload-images');
        let mediaPath = await sock.downloadAndSaveMediaMessage(qmsg);
        const service = new ImageUploadService('pixhost.to');
        let buffer = fs.readFileSync(mediaPath);
        let { directLink } = await service.uploadFromBinary(buffer, 'nfstore.png');
        await fs.unlinkSync(mediaPath);

        // button copy url
        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: `✅ Foto berhasil diupload!\n\nURL: ${directLink}` },
                        nativeFlowMessage: {
                            buttons: [
                                { 
                                    name: "cta_copy", 
                                    buttonParamsJson: `{"display_text":"Copy URL","copy_code":"${directLink}"}`
                                }
                            ]
                        }
                    }
                }
            }
        }, { userJid: m.sender, quoted: m });

        await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (err) {
        console.error("Tourl Error:", err);
        m.reply("Terjadi kesalahan saat mengubah media menjadi URL.");
    }
}
break;

//###############################//

case "backupsc":
case "bck":
case "backup": {
    if (m.sender.split("@")[0] !== global.owner)
        return m.reply(mess.owner);
    try {        
        const tmpDir = "./Tmp";
        if (fs.existsSync(tmpDir)) {
            const files = fs.readdirSync(tmpDir).filter(f => !f.endsWith(".js"));
            for (let file of files) {
                fs.unlinkSync(`${tmpDir}/${file}`);
            }
        }
        await m.reply("Processing Backup Script . .");        
        const name = `Backup-Script-Pushkontak`; 
        const exclude = ["node_modules", "skyzopedia", "session", "package-lock.json", "yarn.lock", ".npm", ".cache"];
        const filesToZip = fs.readdirSync(".").filter(f => !exclude.includes(f) && f !== "");

        if (!filesToZip.length) return m.reply("Tidak ada file yang dapat di-backup.");

        execSync(`zip -r ${name}.zip ${filesToZip.join(" ")}`);

        await sock.sendMessage(m.sender, {
            document: fs.readFileSync(`./${name}.zip`),
            fileName: `${name}.zip`,
            mimetype: "application/zip"
        }, { quoted: m });

        fs.unlinkSync(`./${name}.zip`);

        if (m.chat !== m.sender) m.reply("Script bot berhasil dikirim ke private chat.");
    } catch (err) {
        console.error("Backup Error:", err);
        m.reply("Terjadi kesalahan saat melakukan backup.");
    }
}
break;

//###############################//

case "kick":
case "kik": {
    if (!m.isGroup) return m.reply(mess.group);
    if (!isOwner && !m.isAdmin) return m.reply(mess.admin);
    if (!m.isBotAdmin) return m.reply(mess.botadmin);

    let target;

    if (m.mentionedJid?.[0]) {
        target = m.mentionedJid[0];
    } else if (m.quoted?.sender) {
        target = m.quoted.sender;
    } else if (text) {
        const cleaned = text.replace(/[^0-9]/g, "");
        if (cleaned) target = cleaned + "@s.whatsapp.net";
    }

    if (!target) return m.reply(`*Contoh :* .kick @tag/6283XXX`);

    try {
        await sock.groupParticipantsUpdate(m.chat, [target], "remove");
        return sock.sendMessage(m.chat, {
            text: `✅ Berhasil mengeluarkan @${target.split("@")[0]}`,
            mentions: [target]
        }, { quoted: m });
    } catch (err) {
        console.error("Kick error:", err);
        return m.reply("Gagal mengeluarkan anggota. Coba lagi atau cek hak akses bot.");
    }
}
break;

//###############################//

case "closegc":
case "close":
case "opengc":
case "open": {
    if (!m.isGroup) return m.reply(mess.group);
    if (!isOwner && !m.isAdmin) return m.reply(mess.admin);
    if (!m.isBotAdmin) return m.reply(mess.botadmin);

    try {
        const cmd = command.toLowerCase();

        if (cmd === "open" || cmd === "opengc") {
            await sock.groupSettingUpdate(m.chat, 'not_announcement');
            return m.reply("Grup berhasil dibuka! Sekarang semua anggota dapat mengirim pesan.");
        }

        if (cmd === "close" || cmd === "closegc") {
            await sock.groupSettingUpdate(m.chat, 'announcement');
            return m.reply("Grup berhasil ditutup! Sekarang hanya admin yang dapat mengirim pesan.");
        }

    } catch (error) {
        console.error("Error updating group settings:", error);
        return m.reply("Terjadi kesalahan saat mencoba mengubah pengaturan grup.");
    }
}
break;

//###############################//

case "ht":
case "hidetag": {
    if (!m.isGroup) return m.reply(mess.group);
    if (!isOwner) return m.reply(mess.owner);
    if (!text) return m.reply(`*Contoh :* ${cmd} pesannya`);
    try {
        if (!m.metadata || !m.metadata.participants) return m.reply("Gagal mendapatkan daftar anggota grup. Coba lagi.");
        const members = m.metadata.participants.map(v => v.id.includes("@s.whatsapp.net") ? v.id : v.jid);
        await sock.sendMessage(m.chat, {
            text: text,
            mentions: members
        }, {
            quoted: null
        });
    } catch (error) {
        console.error("Error sending hidetag message:", error);
        return m.reply("Terjadi kesalahan saat mencoba mengirim pesan hidetag.");
    }
}
break;

//###############################//

case "welcome": {
    if (!isOwner) return m.reply(mess.owner)
    if (!/on|off/.test(text)) {
        let teks = `
*⚙️ Bot Settings Welcome*
- Status: ${global.db.settings.welcome ? "*aktif (✅)*" : "*tidak aktif (❌)*"}

Pilih Salah Satu Opsi Untuk Mengatur Welcome Message!
`
        let msg = await generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: teks },
                        nativeFlowMessage: {
                            buttons: [
                                { name: "quick_reply", buttonParamsJson: `{"display_text":"Aktifkan Welcome","id":".welcome on"}` },
                                { name: "quick_reply", buttonParamsJson: `{"display_text":"Matikan Welcome","id":".welcome off"}` }
                            ]
                        },
                        contextInfo: { mentionedJid: [m.sender, global.owner + "@s.whatsapp.net"] }
                    }
                }
            }
        }, { userJid: m.sender, quoted: m })
        return await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    }

    if (text === "on") {
        global.db.settings.welcome = true
        return m.reply(`*✅ Berhasil Menyalakan Welcome*\n\n*⚙️ Bot Settings Welcome*
- Status: ${global.db.settings.welcome ? "*aktif (✅)*" : "*tidak aktif (❌)*"}`)
    }

    if (text === "off") {
        global.db.settings.welcome = false
        return m.reply(`*✅ Berhasil Mematikan Welcome*\n\n*⚙️ Bot Settings Welcome*
- Status: ${global.db.settings.welcome ? "*aktif (✅)*" : "*tidak aktif (❌)*"}`)
    }
}
break

//###############################//

case "jpmch": {
    if (!isOwner) return m.reply(mess.owner)
    if (!text) return m.reply(`*Contoh :* ${cmd} pesannya & bisa dengan foto juga`)

    let mediaPath
    const mimeType = mime
    if (/image/.test(mimeType)) {
        mediaPath = await sock.downloadAndSaveMediaMessage(qmsg)
    }
    
    const Channel = await sock.newsletterFetchAllParticipating()
    const channelList = Object.keys(Channel)
    if (!channelList || channelList.length < 1) return m.reply("Channel tidak ditemukan")
    let successCount = 0
    const messageType = mediaPath ? "teks & foto" : "teks"
    const senderChat = m.chat

    const messageContent = mediaPath
        ? { image: await fs.readFileSync(mediaPath), caption: text }
        : { text }
    global.messageJpm = messageContent

    await m.reply(`Memproses JPM ${messageType} ke ${channelList.length} Channel WhatsApp.`)
    global.statusjpm = true

    for (const chId of channelList) {
    if (global.stopjpm) {
        delete global.stopjpm
        delete global.statusjpm
        break
        }
        try {
            await sock.sendMessage(chId, global.messageJpm)
            successCount++
        } catch (err) {
            console.error(`Gagal kirim ke channel ${chId}:`, err)
        }
        await sleep(global.JedaJpm)
    }

    if (mediaPath) await fs.unlinkSync(mediaPath)    
    delete global.statusjpm
    await m.reply(`JPM Channel Telah Selsai ✅\nBerhasil dikirim ke ${successCount} Channel WhatsApp.`)
}
break

//###############################//

case "jasher": case "jpm": case "jaser": {
if (!isOwner) return m.reply(mess.owner)
if (!text) return m.reply(`*Contoh :* ${cmd} pesannya & bisa dengan foto juga`)
    let mediaPath
    const mimeType = mime
    if (/image/.test(mimeType)) {
        mediaPath = await sock.downloadAndSaveMediaMessage(qmsg)
    }
    const allGroups = await sock.groupFetchAllParticipating()
    const groupIds = Object.keys(allGroups)
    let successCount = 0
    let messageContent = await generateWAMessageFromContent(m.sender, { 
extendedTextMessage: { 
text: text 
}}, { userJid: m.sender, quoted: FakeChannel });
    
    if (mediaPath) {
    const aa = await prepareWAMessageMedia({ image: await fs.readFileSync(mediaPath) }, { upload: sock.waUploadToServer })
    aa.imageMessage.caption = text
    messageContent = await generateWAMessageFromContent(m.sender, {
    ...aa
    }, { userJid: m.sender, quoted: FakeChannel });
    }

    global.messageJpm = messageContent
    const senderChat = m.chat
    await m.reply(`Memproses ${mediaPath ? "JPM teks & foto" : "JPM teks"} ke ${groupIds.length} grup chat`)
    global.statusjpm = true
    
    for (const groupId of groupIds) {
        if (db.settings.bljpm.includes(groupId)) continue
        if (global.stopjpm) {
        delete global.stopjpm
        delete global.statusjpm
        break
        }
        try {
            await sock.relayMessage(groupId, global.messageJpm.message, { messageId: global.messageJpm.key.id });
            successCount++
        } catch (err) {
            console.error(`Gagal kirim ke grup ${groupId}:`, err)
        }
        await sleep(global.JedaJpm)
    }

    if (mediaPath) await fs.unlinkSync(mediaPath)
    delete global.statusjpm
    await sock.sendMessage(senderChat, {
        text: `JPM ${mediaPath ? "teks & foto" : "teks"} berhasil dikirim ke ${successCount} grup.`,
    }, { quoted: m })
}
break

//###############################//

case "jpmht": {
if (!isOwner) return m.reply(mess.owner)
if (!text) return m.reply(`*Contoh :* ${cmd} pesannya & bisa dengan foto juga`)
    let mediaPath
    const mimeType = mime
    if (/image/.test(mimeType)) {
        mediaPath = await sock.downloadAndSaveMediaMessage(qmsg)
    }
    const allGroups = await sock.groupFetchAllParticipating()
    const groupIds = Object.keys(allGroups)
    let successCount = 0
    const messageContent = mediaPath
        ? { image: await fs.readFileSync(mediaPath), caption: text }
        : { text }
    global.messageJpm = messageContent
    const senderChat = m.chat
    await m.reply(`Memproses ${mediaPath ? "JPM teks & foto" : "JPM teks"} hidetag ke ${groupIds.length} grup chat`)
    global.statusjpm = true
    
    for (const groupId of groupIds) {
        if (db.settings.bljpm.includes(groupId)) continue
        if (global.stopjpm) {
        delete global.stopjpm
        delete global.statusjpm
        break
        }
        messageContent.mentions = allGroups[groupId].participants.map(e => e.id)
        try {
            await sock.sendMessage(groupId, global.messageJpm, { quoted: FakeChannel })
            successCount++
        } catch (err) {
            console.error(`Gagal kirim ke grup ${groupId}:`, err)
        }
        await sleep(global.JedaJpm)
    }

    if (mediaPath) await fs.unlinkSync(mediaPath)
    delete global.statusjpm
    await sock.sendMessage(senderChat, {
        text: `JPM ${mediaPath ? "teks & foto" : "teks"} hidetag berhasil dikirim ke ${successCount} grup.`,
    }, { quoted: m })
}
break

//###############################//

case "sticker": case "stiker": case "sgif": case "s": {
if (!/image|video/.test(mime)) return m.reply("Kirim foto dengan caption .sticker")
if (/video/.test(mime)) {
if ((qmsg).seconds > 15) return m.reply("Durasi vidio maksimal 15 detik!")
}
var media = await sock.downloadAndSaveMediaMessage(qmsg)
await sock.sendStimg(m.chat, media, m, {packname: "NF Store"})
}
break

//###############################//

case "brat": {
if (!text) return m.reply(`*Contoh :* ${cmd} Hallo Aku NF Store!`)
var media = await getBuffer(`https://api.siputzx.my.id/api/m/brat?text=${text}&isAnimated=false&delay=500`)
await sock.sendStimg(m.chat, media, m, {packname: "NF Store."})
}
break

//###############################//

case "public":
case "self": {
    if (!isOwner) return m.reply(mess.owner);
    let path = require.resolve("./settings.js");
    let data = fs.readFileSync(path, "utf-8");

    if (command === "public") {
        global.mode_public = true;
        sock.public = global.mode_public
        let newData = data.replace(/global\.mode_public\s*=\s*(true|false)/, "global.mode_public = true");
        fs.writeFileSync(path, newData, "utf-8");
        return m.reply("✅ Mode berhasil diubah menjadi *Public*");
    }

    if (command === "self") {
        global.mode_public = false;
        sock.public = global.mode_public
        let newData = data.replace(/global\.mode_public\s*=\s*(true|false)/, "global.mode_public = false");
        fs.writeFileSync(path, newData, "utf-8");
        return m.reply("✅ Mode berhasil diubah menjadi *Self*");
    }
}
break;

//###############################//

case "setjeda": {
    if (!isOwner) return m.reply(mess.owner);
    if (!text) return m.reply(`*Contoh :*\n${cmd} push 5000\n${cmd} jpm 6000\n\nKeterangan format waktu:\n1 detik = 1000\n\nJeda waktu saat ini:\nJeda Pushkontak > ${global.JedaPushkontak}\nJeda JPM > ${global.JedaJpm}`);

    let args = text.split(" ");
    if (args.length < 2) return m.reply(`*Contoh :*\n${cmd} push 5000\n${cmd} jpm 6000\n\nKeterangan format waktu:\n1 detik = 1000\n\nJeda waktu saat ini:\nJeda Pushkontak > ${global.JedaPushkontak}\nJeda JPM > ${global.JedaJpm}`);

    let target = args[0].toLowerCase(); // push / jpm
    let value = args[1];

    if (isNaN(value)) return m.reply("Harus berupa angka!");
    let jeda = parseInt(value);

    let fs = require("fs");
    let path = require.resolve("./settings.js");
    let data = fs.readFileSync(path, "utf-8");

    if (target === "push") {
        let newData = data.replace(/global\.JedaPushkontak\s*=\s*\d+/, `global.JedaPushkontak = ${jeda}`);
        fs.writeFileSync(path, newData, "utf-8");
        global.JedaPushkontak = jeda;
        return m.reply(`✅ Berhasil mengubah *Jeda Push Kontak* menjadi *${jeda}* ms`);
    } 
    
    if (target === "jpm") {
        let newData = data.replace(/global\.JedaJpm\s*=\s*\d+/, `global.JedaJpm = ${jeda}`);
        fs.writeFileSync(path, newData, "utf-8");
        global.JedaJpm = jeda;
        return m.reply(`✅ Berhasil mengubah *Jeda JPM* menjadi *${jeda}* ms`);
    }

    return m.reply(`Pilihan tidak valid!\nGunakan: *push* atau *jpm*`);
}
break;

//###############################//

case "pushkontak": case "puskontak": {
if (!isOwner) return m.reply(mess.owner)
if (!text) return m.reply(`*Contoh :* ${cmd} pesannya`)
global.textpushkontak = text
let rows = []
const a = await sock.groupFetchAllParticipating()
global.dataAllGrup = a
if (a.length < 1) return m.reply("Tidak ada grup chat.")
const Data = Object.values(a)
let number = 0
for (let u of Data) {
const name = u.subject || "Unknown"
rows.push({
title: name,
description: `Total Member: ${u.participants.length}`, 
id: `.pushkontak-response ${u.id}`
})
}
await sock.sendMessage(m.chat, {
  buttons: [
    {
    buttonId: 'action',
    buttonText: { displayText: 'ini pesan interactiveMeta' },
    type: 4,
    nativeFlowInfo: {
        name: 'single_select',
        paramsJson: JSON.stringify({
          title: 'Pilih Grup',
          sections: [
            {
              title: `© Powered By ${namaOwner}`,
              rows: rows
            }
          ]
        })
      }
      }
  ],
  headerType: 1,
  viewOnce: true,
  text: `\nPilih Target Grup Pushkontak\n`
}, { quoted: m })
}
break

//###############################//

case "pushkontak-response": {
  if (!isOwner) return m.reply(mess.owner)
  if (!global.textpushkontak || !global.dataAllGrup) return m.reply(`Data teks pushkontak tidak ditemukan!\nSilahkan ketik *.pushkontak* pesannya`);
  const gc = global.dataAllGrup
  const teks = global.textpushkontak
  const jidawal = m.chat
  const data = await gc[text]
  const halls = data.participants
    .filter(v => v.id.includes("@s.whatsapp.net") ? v.id : v.jid)
    .map(v => v.id.includes("@s.whatsapp.net") ? v.id : v.jid)
    .filter(id => id !== botNumber && id.split("@")[0] !== global.owner); 

  await m.reply(`🚀 Memulai pushkontak ke dalam grup ${data.subject} dengan total member ${halls.length}`);
  
 global.statuspush = true
 let count = 0
 let msg = await generateWAMessageFromContent(m.sender, { 
extendedTextMessage: { 
text: global.textpushkontak 
}}, { userJid: m.sender, quoted: FakeChannel });
 
  for (const mem of halls) {
    if (global.stoppush) {
    delete global.stoppush
    delete global.statuspush
    break
    }
await sock.relayMessage(mem, msg.message, { messageId: msg.key.id });
    await global.sleep(global.JedaPushkontak);
    count += 1
  }
  
  delete global.statuspush
  delete global.textpushkontak
  await m.reply(`✅ Sukses pushkontak!\nPesan berhasil dikirim ke *${count}* member.`, jidawal)
}
break

//###############################//

case "pushkontak2": case "puskontak2": {
if (!isOwner) return m.reply(mess.owner)
if (!text || !text.includes("|")) return m.reply(`Masukan pesan & nama kontak\n*Contoh :* ${cmd} pesan|namakontak`)
global.textpushkontak = text.split("|")[0]
let rows = []
const a = await sock.groupFetchAllParticipating()
global.dataAllGrup = a
if (a.length < 1) return m.reply("Tidak ada grup chat.")
const Data = Object.values(a)
let number = 0
for (let u of Data) {
const name = u.subject || "Unknown"
rows.push({
title: name,
description: `Total Member: ${u.participants.length}`, 
id: `.pushkontak-response2 ${u.id}|${text.split("|")[1]}`
})
}
await sock.sendMessage(m.chat, {
  buttons: [
    {
    buttonId: 'action',
    buttonText: { displayText: 'ini pesan interactiveMeta' },
    type: 4,
    nativeFlowInfo: {
        name: 'single_select',
        paramsJson: JSON.stringify({
          title: 'Pilih Grup',
          sections: [
            {
              title: `© Powered By ${namaOwner}`,
              rows: rows
            }
          ]
        })
      }
      }
  ],
  headerType: 1,
  viewOnce: true,
  text: `\nPilih Target Grup PushkontakV2\n`
}, { quoted: m })
}
break

//###############################//

case "pushkontak-response2": {
  if (!isOwner) return m.reply(mess.owner)
  if (!global.textpushkontak || !global.dataAllGrup) return m.reply(`Data teks pushkontak tidak ditemukan!\nSilahkan ketik *.pushkontak2* pesannya|namakontak`);
  const teks = global.textpushkontak
  const jidawal = m.chat
  const data = global.dataAllGrup[text.split("|")[0]]
  const halls = data.participants
    .filter(v => v.id.includes("@s.whatsapp.net") ? v.id : v.jid)
    .map(v => v.id.includes("@s.whatsapp.net") ? v.id : v.jid)
    .filter(id => id !== botNumber && id.split("@")[0] !== global.owner); 

  await m.reply(`🚀 Memulai pushkontak autosave kontak ke dalam grup ${data.subject} dengan total member ${halls.length}`);
  
  global.statuspush = true
 let count = 0
 let msg = await generateWAMessageFromContent(m.sender, { 
extendedTextMessage: { text: global.textpushkontak }}, { userJid: m.sender, quoted: FakeChannel });
 
  for (const mem of halls) {
    if (global.stoppush) {
    delete global.stoppush
    delete global.statuspush
    break
    }    
    const contactAction = {
        "fullName": `${text.split("|")[1]} #${mem.split("@")[0]}`,
        "lidJid": mem, 
        "saveOnPrimaryAddressbook": true
    };
await sock.relayMessage(mem, msg.message, { messageId: msg.key.id });
    await sock.addOrEditContact(mem, contactAction);
    await global.sleep(global.JedaPushkontak);
    count += 1
  }
  
  delete global.statuspush
  delete global.textpushkontak
  await m.reply(`✅ Sukses pushkontak!\nTotal kontak berhasil disimpan *${count}*`, jidawal)
}
break

//###############################//

case "savenomor":
case "sv":
case "save": {
    if (!isOwner) return m.reply(mess.owner)

    let nomor, nama

    if (m.isGroup) {
        if (!text) return m.reply(`*Contoh penggunaan di grup:*\n${cmd} @tag|nama\natau reply target dengan:\n${cmd} nama`)

        // Jika ada tag
        if (m.mentionedJid[0]) {
            nomor = m.mentionedJid[0]
            nama = text.split("|")[1]?.trim()
            if (!nama) return m.reply(`Harap tulis nama setelah "|"\n*Contoh:* ${cmd} @tag|nama`)
        } 
        // Jika reply
        else if (m.quoted) {
            nomor = m.quoted.sender
            nama = text.trim()
        } 
        // Jika input manual nomor
        else if (/^\d+$/.test(text.split("|")[0])) {
            nomor = text.split("|")[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net"
            nama = text.split("|")[1]?.trim()
            if (!nama) return m.reply(`Harap tulis nama setelah "|"\n*Contoh:* ${cmd} 628xxxx|nama`)
        } 
        else {
            return m.reply(`*Contoh penggunaan di grup:*\n${cmd} @tag|nama\natau reply target dengan:\n${cmd} nama`)
        }
    } else {
        // Private chat hanya nama
        if (!text) return m.reply(`*Contoh penggunaan di private:*\n${cmd} nama`)
        nomor = m.chat
        nama = text.trim()
    }

    const contactAction = {
        "fullName": nama,
        "lidJid": nomor,
        "saveOnPrimaryAddressbook": true
    };

    await sock.addOrEditContact(nomor, contactAction);

    return m.reply(`✅ Berhasil menyimpan kontak

- Nomor: ${nomor.split("@")[0]}
- Nama: ${nama}`)
}
break

//###############################//

case "savekontak": case "svkontak": {
if (!isOwner) return m.reply(mess.owner)
if (!text) return m.reply(`Masukan namakontak\n*Contoh :* ${cmd} NF Store`)
global.namakontak = text
let rows = []
const a = await sock.groupFetchAllParticipating()
if (a.length < 1) return m.reply("Tidak ada grup chat.")
const Data = Object.values(a)
let number = 0
for (let u of Data) {
const name = u.subject || "Unknown"
rows.push({
title: name,
description: `Total Member: ${u.participants.length}`, 
id: `.savekontak-response ${u.id}`
})
}
await sock.sendMessage(m.chat, {
  buttons: [
    {
    buttonId: 'action',
    buttonText: { displayText: 'ini pesan interactiveMeta' },
    type: 4,
    nativeFlowInfo: {
        name: 'single_select',
        paramsJson: JSON.stringify({
          title: 'Pilih Grup',
          sections: [
            {
              title: `© Powered By ${namaOwner}`,
              rows: rows
            }
          ]
        })
      }
      }
  ],
  headerType: 1,
  viewOnce: true,
  text: `\nPilih Target Grup Savekontak\n`
}, { quoted: m })
}
break

//###############################//

case "savekontak-response": {
  if (!isOwner) return m.reply(mess.owner)
  if (!global.namakontak) return m.reply(`Data nama savekontak tidak ditemukan!\nSilahkan ketik *.savekontak* namakontak`);
  try {
    const res = await sock.groupMetadata(text)
    const halls = res.participants
      .filter(v => v.id.includes("@s.whatsapp.net") ? v.id : v.jid)
      .map(v => v.id.includes("@s.whatsapp.net") ? v.id : v.jid)
      .filter(id => id !== botNumber && id.split("@")[0] !== global.owner)

    if (!halls.length) return m.reply("Tidak ada kontak yang bisa disimpan.")
    let names = text
    const existingContacts = JSON.parse(fs.readFileSync('./storage/contacts.json', 'utf8') || '[]')
    const newContacts = [...new Set([...existingContacts, ...halls])]

    fs.writeFileSync('./storage/contacts.json', JSON.stringify(newContacts, null, 2))

    // Buat file .vcf
    const vcardContent = newContacts.map(contact => {
      const phone = contact.split("@")[0]
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${global.namakontak} - ${phone}`,
        `TEL;type=CELL;type=VOICE;waid=${phone}:+${phone}`,
        "END:VCARD",
        ""
      ].join("\n")
    }).join("")

    fs.writeFileSync("./storage/contacts.vcf", vcardContent, "utf8")

    // Kirim ke private chat
    if (m.chat !== m.sender) {
      await m.reply(`Berhasil membuat file kontak dari grup ${res.subject}\n\nFile kontak telah dikirim ke private chat\nTotal ${halls.length} kontak`)
    }

    await sock.sendMessage(
      m.sender,
      {
        document: fs.readFileSync("./storage/contacts.vcf"),
        fileName: "contacts.vcf",
        caption: `File kontak berhasil dibuat ✅\nTotal ${halls.length} kontak`,
        mimetype: "text/vcard",
      },
      { quoted: m }
    )
    
    delete global.namakontak

    fs.writeFileSync("./storage/contacts.json", "[]")
    fs.writeFileSync("./storage/contacts.vcf", "")

  } catch (err) {
    m.reply("Terjadi kesalahan saat menyimpan kontak:\n" + err.toString())
  }
}
break

//###############################//

case "stopjpm": {
if (!isOwner) return m.reply(mess.owner)
if (!global.statusjpm) return m.reply("Jpm sedang tidak berjalan!")
global.stopjpm = true
return m.reply("Berhasil menghentikan jpm ✅")
}
break

//###############################//

case "stoppushkontak": case "stoppush": case "stoppus": {
if (!isOwner) return m.reply(mess.owner)
if (!global.statuspush) return m.reply("Pushkontak sedang tidak berjalan!")
global.stoppush = true
return m.reply("Berhasil menghentikan pushkontak ✅")
}
break

//###############################//

case "subdo":
case "subdomain": {
    if (!isOwner) return m.reply(mess.owner);
    if (!text.includes("|")) return m.reply(`*Contoh penggunaan :*
ketik ${cmd} hostname|ipvps`);

    const obj = Object.keys(subdomain);
    if (obj.length < 1) return m.reply("Tidak ada domain yang tersedia.");

    const hostname = text.split("|")[0].toLowerCase();
    const ip = text.split("|")[1];
    const rows = obj.map((domain, index) => ({
        title: `🌐 ${domain}`,
        description: `Result: https://${hostname}.${domain}`,
        id: `.subdomain-response ${index + 1} ${hostname.trim()}|${ip}`
    }));

    await sock.sendMessage(m.chat, {
        buttons: [
            {
                buttonId: 'action',
                buttonText: { displayText: 'ini pesan interactiveMeta' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: 'Pilih Domain',
                        sections: [
                            {
                                title: `© Powered By ${namaOwner}`,
                                rows: rows
                            }
                        ]
                    })
                }
            }
        ],
        headerType: 1,
        viewOnce: true,
        text: `\nPilih Domain Server Yang Tersedia\nTotal Domain: ${obj.length}\n`
    }, { quoted: m });
}
break;

//###############################//

case "subdomain-response": { 
    if (!isOwner) return m.reply(mess.owner);
    if (!text) return;

    if (!args[0] || isNaN(args[0])) return m.reply("Domain tidak ditemukan!");
    const dom = Object.keys(subdomain);
    const domainIndex = Number(args[0]) - 1;
    if (domainIndex >= dom.length || domainIndex < 0) return m.reply("Domain tidak ditemukan!");

    if (!args[1] || !args[1].includes("|")) return m.reply("Hostname/IP Tidak ditemukan!");

    let tldnya = dom[domainIndex];
    const [host, ip] = args[1].split("|").map(str => str.trim());

    async function subDomain1(host, ip) {
        return new Promise((resolve) => {
            axios.post(
                `https://api.cloudflare.com/client/v4/zones/${subdomain[tldnya].zone}/dns_records`,
                {
                    type: "A",
                    name: `${host.replace(/[^a-z0-9.-]/gi, "")}.${tldnya}`,
                    content: ip.replace(/[^0-9.]/gi, ""),
                    ttl: 3600,
                    priority: 10,
                    proxied: false,
                },
                {
                    headers: {
                        Authorization: `Bearer ${subdomain[tldnya].apitoken}`,
                        "Content-Type": "application/json",
                    },
                }
            ).then(response => {
                let res = response.data;
                if (res.success) {
                    resolve({ success: true, name: res.result?.name, ip: res.result?.content });
                } else {
                    resolve({ success: false, error: "Gagal membuat subdomain." });
                }
            }).catch(error => {
                let errorMsg = error.response?.data?.errors?.[0]?.message || error.message || "Terjadi kesalahan!";
                resolve({ success: false, error: errorMsg });
            });
        });
    }

    const domnode = `node${getRandom("")}.${host}`;
    let panelDomain = "";
    let nodeDomain = "";

    for (let i = 0; i < 2; i++) {
        let subHost = i === 0 ? host.toLowerCase() : domnode;
        try {
            let result = await subDomain1(subHost, ip);
            if (result.success) {
                if (i === 0) panelDomain = result.name;
                else nodeDomain = result.name;
            } else {
                return m.reply(result.error);
            }
        } catch (err) {
            return m.reply("Error: " + err.message);
        }
    }

    let teks = `
*✅ Subdomain Berhasil Dibuat*

- IP: ${ip}
- Panel: ${panelDomain}
- Node: ${nodeDomain}
`;

    let msg = await generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { text: teks },
                    nativeFlowMessage: {
                        buttons: [
                            { 
                                name: "cta_copy",
                                buttonParamsJson: `{"display_text":"Copy Subdomain Panel","copy_code":"${panelDomain}"}`
                            },
                            { 
                                name: "cta_copy",
                                buttonParamsJson: `{"display_text":"Copy Subdomain Node","copy_code":"${nodeDomain}"}`
                            }
                        ]
                    }
                }
            }
        }
    }, { userJid: m.sender, quoted: m });

    await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}
break;

//###############################//

case "installpanel": {
    if (!isOwner) return m.reply(mess.owner)
    if (!text) return m.reply("\nFormat salah!\n\n*Contoh penggunaan :*\nketik .instalpanel ipvps|pwvps|panel.com|node.com|ramserver *(contoh 100000)*");
    
    let vii = text.split("|");
    if (vii.length < 5) return m.reply("\nFormat salah!\n\n*Contoh penggunaan :*\nketik .instalpanel ipvps|pwvps|panel.com|node.com|ramserver *(contoh 100000)*");
    
    const ssh2 = require("ssh2");
    const ress = new ssh2.Client();
    const connSettings = {
        host: vii[0],
        port: '22',
        username: 'root',
        password: vii[1]
    };
    
    const jids = m.chat
    const pass = "admin001";
    let passwordPanel = pass;
    const domainpanel = vii[2];
    const domainnode = vii[3];
    const ramserver = vii[4];
    const deletemysql = `\n`;
    const commandPanel = `bash <(curl -s https://pterodactyl-installer.se)`;
    
    async function instalWings() {
    ress.exec(commandPanel, async (err, stream) => {
        if (err) {
            console.error('Wings installation error:', err);
            m.reply(`Gagal memulai instalasi Wings: ${err.message}`);
            return ress.end();
        }
        
        stream.on('close', async (code, signal) => {
            await InstallNodes()            
        }).on('data', async (data) => {
            const dataStr = data.toString();
            console.log('Wings Install: ' + dataStr);
            
            if (dataStr.includes('Input 0-6')) {
                stream.write('1\n');
            }
            else if (dataStr.includes('(y/N)')) {
                stream.write('y\n');
            }
            else if (dataStr.includes('Enter the panel address (blank for any address)')) {
                stream.write(`${domainpanel}\n`);
            }
            else if (dataStr.includes('Database host username (pterodactyluser)')) {
                stream.write('admin\n');
            }
            else if (dataStr.includes('Database host password')) {
                stream.write('admin\n');
            }
            else if (dataStr.includes('Set the FQDN to use for Let\'s Encrypt (node.example.com)')) {
                stream.write(`${domainnode}\n`);
            }
            else if (dataStr.includes('Enter email address for Let\'s Encrypt')) {
                stream.write('admin@gmail.com\n');
            }
        }).stderr.on('data', async (data) => {
            console.error('Wings Install Error: ' + data);
            m.reply(`Error pada instalasi Wings:\n${data}`);
        });
    });
}

    async function InstallNodes() {
        ress.exec('bash <(curl -s https://raw.githubusercontent.com/SkyzoOffc/Pterodactyl-Theme-Autoinstaller/main/createnode.sh)', async (err, stream) => {
            if (err) throw err;
            
            stream.on('close', async (code, signal) => {
                
    let teks = `
*Install Panel Telah Berhasil ✅*

*Berikut Detail Akun Panel Kamu 📦*

👤 Username : \`${usernamePanel}\`
🔐 Password : \`${passwordPanel}\`
🌐 ${domainpanel}

Silahkan setting allocation & ambil token node di node yang sudah dibuat oleh bot.

*Cara menjalankan wings :*
\`.startwings ipvps|pwvps|tokennode\`
    `;

    let msg = await generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { text: teks },
                    nativeFlowMessage: {
                        buttons: [
                            { 
                                name: "cta_copy",
                                buttonParamsJson: `{"display_text":"Copy Username","copy_code":"${usernamePanel}"}`
                            },
                            { 
                                name: "cta_copy",
                                buttonParamsJson: `{"display_text":"Copy Password","copy_code":"${passwordPanel}"}`
                            },
                            { 
                                name: "cta_url",
                                buttonParamsJson: `{"display_text":"Login Panel","url":"${domainpanel}"}`
                            }
                        ]
                    }, 
                    contextInfo: {
                    isForwarded: true
                    }
                }
            }
        }
    }, {});

    await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
                
                ress.end();
            }).on('data', async (data) => {
                await console.log(data.toString());
                if (data.toString().includes("Masukkan nama lokasi: ")) {
                    stream.write('Singapore\n');
                }
                if (data.toString().includes("Masukkan deskripsi lokasi: ")) {
                    stream.write('Node By NF Store\n');
                }
                if (data.toString().includes("Masukkan domain: ")) {
                    stream.write(`${domainnode}\n`);
                }
                if (data.toString().includes("Masukkan nama node: ")) {
                    stream.write('NF Store\n');
                }
                if (data.toString().includes("Masukkan RAM (dalam MB): ")) {
                    stream.write(`${ramserver}\n`);
                }
                if (data.toString().includes("Masukkan jumlah maksimum disk space (dalam MB): ")) {
                    stream.write(`${ramserver}\n`);
                }
                if (data.toString().includes("Masukkan Locid: ")) {
                    stream.write('1\n');
                }
            }).stderr.on('data', async (data) => {
                console.log('Stderr : ' + data);
                m.reply(`Error pada instalasi Wings: ${data}`);
            });
        });
    }

    async function instalPanel() {
        ress.exec(commandPanel, (err, stream) => {
            if (err) throw err;
            
            stream.on('close', async (code, signal) => {
                await instalWings();
            }).on('data', async (data) => {
                if (data.toString().includes('Input 0-6')) {
                    stream.write('0\n');
                } 
                if (data.toString().includes('(y/N)')) {
                    stream.write('y\n');
                } 
                if (data.toString().includes('Database name (panel)')) {
                    stream.write('\n');
                }
                if (data.toString().includes('Database username (pterodactyl)')) {
                    stream.write('admin\n');
                }
                if (data.toString().includes('Password (press enter to use randomly generated password)')) {
                    stream.write('admin\n');
                } 
                if (data.toString().includes('Select timezone [Europe/Stockholm]')) {
                    stream.write('Asia/Jakarta\n');
                } 
                if (data.toString().includes('Provide the email address that will be used to configure Let\'s Encrypt and Pterodactyl')) {
                    stream.write('admin@gmail.com\n');
                } 
                if (data.toString().includes('Email address for the initial admin account')) {
                    stream.write('admin@gmail.com\n');
                } 
                if (data.toString().includes('Username for the initial admin account')) {
                    stream.write('admin\n');
                } 
                if (data.toString().includes('First name for the initial admin account')) {
                    stream.write('admin\n');
                } 
                if (data.toString().includes('Last name for the initial admin account')) {
                    stream.write('admin\n');
                } 
                if (data.toString().includes('Password for the initial admin account')) {
                    stream.write(`${passwordPanel}\n`);
                } 
                if (data.toString().includes('Set the FQDN of this panel (panel.example.com)')) {
                    stream.write(`${domainpanel}\n`);
                } 
                if (data.toString().includes('Do you want to automatically configure UFW (firewall)')) {
                    stream.write('y\n')
                } 
                if (data.toString().includes('Do you want to automatically configure HTTPS using Let\'s Encrypt? (y/N)')) {
                    stream.write('y\n');
                } 
                if (data.toString().includes('Select the appropriate number [1-2] then [enter] (press \'c\' to cancel)')) {
                    stream.write('1\n');
                } 
                if (data.toString().includes('I agree that this HTTPS request is performed (y/N)')) {
                    stream.write('y\n');
                }
                if (data.toString().includes('Proceed anyways (your install will be broken if you do not know what you are doing)? (y/N)')) {
                    stream.write('y\n');
                } 
                if (data.toString().includes('(yes/no)')) {
                    stream.write('y\n');
                } 
                if (data.toString().includes('Initial configuration completed. Continue with installation? (y/N)')) {
                    stream.write('y\n');
                } 
                if (data.toString().includes('Still assume SSL? (y/N)')) {
                    stream.write('y\n');
                } 
                if (data.toString().includes('Please read the Terms of Service')) {
                    stream.write('y\n');
                }
                if (data.toString().includes('(A)gree/(C)ancel:')) {
                    stream.write('A\n');
                } 
                console.log('Logger: ' + data.toString());
            }).stderr.on('data', (data) => {
                m.reply(`Error Terjadi kesalahan :\n${data}`);
                console.log('STDERR: ' + data);
            });
        });
    }

    ress.on('ready', async () => {
        await m.reply(`*Memproses install server panel 🚀*\n\n` +
                     `*IP Address:* ${vii[0]}\n` +
                     `*Domain Panel:* ${domainpanel}\n\n` +
                     `Mohon tunggu 10-20 menit hingga proses install selesai`);
        
        ress.exec(deletemysql, async (err, stream) => {
            if (err) throw err;
            
            stream.on('close', async (code, signal) => {
                await instalPanel();
            }).on('data', async (data) => {
                await stream.write('\t');
                await stream.write('\n');
                await console.log(data.toString());
            }).stderr.on('data', async (data) => {
                m.reply(`Error Terjadi kesalahan :\n${data}`);
                console.log('Stderr : ' + data);
            });
        });
    });

    ress.on('error', (err) => {
        console.error('SSH Connection Error:', err);
        m.reply(`Gagal terhubung ke server: ${err.message}`);
    });

    ress.connect(connSettings);
}
break

//###############################//

case "startwings":
case "configurewings": {
    if (!isOwner) return m.reply(mess.owner)
    let t = text.split('|');
    if (t.length < 3) return m.reply("\nFormat salah!\n\n*Contoh penggunaan :*\nketik .startwings ipvps|pwvps|token_wings");

    let ipvps = t[0].trim();
    let passwd = t[1].trim();
    let token = t[2].trim();

    const connSettings = {
        host: ipvps,
        port: 22,
        username: 'root',
        password: passwd
    };

    const command = `${token} && systemctl start wings`;

    const ress = new ssh2.Client();

    ress.on('ready', () => {
        ress.exec(command, (err, stream) => {
            if (err) {
                m.reply('Gagal menjalankan perintah di VPS');
                ress.end();
                return;
            }

            stream.on('close', async (code, signal) => {
                await m.reply("Berhasil menjalankan wings node panel pterodactyl ✅");
                ress.end();
            }).on('data', (data) => {
                console.log("STDOUT:", data.toString());
            }).stderr.on('data', (data) => {
                console.log("STDERR:", data.toString());
                // Opsi jika perlu input interaktif
                stream.write("y\n");
                stream.write("systemctl start wings\n");
                m.reply('Terjadi error saat eksekusi:\n' + data.toString());
            });
        });
    }).on('error', (err) => {
        console.log('Connection Error:', err.message);
        m.reply('Gagal terhubung ke VPS: IP atau password salah.');
    }).connect(connSettings);
}
break;

//###############################//

case "1gb": case "2gb": case "3gb": case "4gb": case "5gb": 
case "6gb": case "7gb": case "8gb": case "9gb": case "10gb": 
case "unlimited": case "unli": {
    if (!isOwner && !isReseller) {
        return m.reply(`Fitur ini untuk di dalam grup reseller panel`);
    }
    if (!text) return m.reply(`*Contoh :* ${cmd} username,6283XXX`)

    let nomor, usernem;
    let tek = text.split(",");
    if (tek.length > 1) {
        let [users, nom] = tek.map(t => t.trim());
        if (!users || !nom) return m.reply(`*Contoh :* ${cmd} username,6283XXX`)
        nomor = nom.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        usernem = users.toLowerCase();
    } else {
        usernem = text.toLowerCase();
        nomor = m.isGroup ? m.sender : m.chat
    }

    try {
        var onWa = await sock.onWhatsApp(nomor.split("@")[0]);
        if (onWa.length < 1) return m.reply("Nomor target tidak terdaftar di WhatsApp!");
    } catch (err) {
        return m.reply("Terjadi kesalahan saat mengecek nomor WhatsApp: " + err.message);
    }

    // Mapping RAM, Disk, dan CPU
    const resourceMap = {
        "1gb": { ram: "1000", disk: "1000", cpu: "40" },
        "2gb": { ram: "2000", disk: "1000", cpu: "60" },
        "3gb": { ram: "3000", disk: "2000", cpu: "80" },
        "4gb": { ram: "4000", disk: "2000", cpu: "100" },
        "5gb": { ram: "5000", disk: "3000", cpu: "120" },
        "6gb": { ram: "6000", disk: "3000", cpu: "140" },
        "7gb": { ram: "7000", disk: "4000", cpu: "160" },
        "8gb": { ram: "8000", disk: "4000", cpu: "180" },
        "9gb": { ram: "9000", disk: "5000", cpu: "200" },
        "10gb": { ram: "10000", disk: "5000", cpu: "220" },
        "unlimited": { ram: "0", disk: "0", cpu: "0" }
    };
    
    let { ram, disk, cpu } = resourceMap[command] || { ram: "0", disk: "0", cpu: "0" };

    let username = usernem.toLowerCase();
    let email = username + "@gmail.com";
    let name = global.capital(username) + " Server";
    let password = username + "001";

    try {
        let f = await fetch(domain + "/api/application/users", {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": "Bearer " + apikey },
            body: JSON.stringify({ email, username, first_name: name, last_name: "Server", language: "en", password })
        });
        let data = await f.json();
        if (data.errors) return m.reply("Error: " + JSON.stringify(data.errors[0], null, 2));
        let user = data.attributes;

        let f1 = await fetch(domain + `/api/application/nests/${nestid}/eggs/` + egg, {
            method: "GET",
            headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": "Bearer " + apikey }
        });
        let data2 = await f1.json();
        let startup_cmd = data2.attributes.startup;

        let f2 = await fetch(domain + "/api/application/servers", {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": "Bearer " + apikey },
            body: JSON.stringify({
                name,
                description: global.tanggal(Date.now()),
                user: user.id,
                egg: parseInt(egg),
                docker_image: "ghcr.io/parkervcp/yolks:nodejs_20",
                startup: startup_cmd,
                environment: { INST: "npm", USER_UPLOAD: "0", AUTO_UPDATE: "0", CMD_RUN: "npm start" },
                limits: { memory: ram, swap: 0, disk, io: 500, cpu },
                feature_limits: { databases: 5, backups: 5, allocations: 5 },
                deploy: { locations: [parseInt(loc)], dedicated_ip: false, port_range: [] },
            })
        });
        let result = await f2.json();
        if (result.errors) return m.reply("Error: " + JSON.stringify(result.errors[0], null, 2));
        
        let server = result.attributes;
        var orang = nomor
        if (orang !== m.chat) {
        await m.reply(`Berhasil membuat akun panel ✅\ndata akun terkirim ke nomor ${nomor.split("@")[0]}`)
        }

let teks = `
*Behasil membuat panel ✅*

📡 Server ID: ${server.id}
👤 Username: \`${user.username}\`
🔐 Password: \`${password}\`
🗓️ Tanggal Aktivasi: ${global.tanggal(Date.now())}

*Spesifikasi server panel*
- RAM: ${ram == "0" ? "Unlimited" : ram / 1000 + "GB"}
- Disk: ${disk == "0" ? "Unlimited" : disk / 1000 + "GB"}
- CPU: ${cpu == "0" ? "Unlimited" : cpu + "%"}
- Panel: ${global.domain}

*Rules pembelian panel*  
- Masa aktif 30 hari  
- Data bersifat pribadi, mohon disimpan dengan aman  
- Garansi berlaku 15 hari (1x replace)  
- Klaim garansi wajib menyertakan *bukti chat pembelian*
`

let msg = await generateWAMessageFromContent(orang, {
    viewOnceMessage: {
        message: {
            interactiveMessage: {
                body: { text: teks },
                nativeFlowMessage: {
                    buttons: [
                        { 
                            name: "cta_copy",
                            buttonParamsJson: `{"display_text":"Copy Username","copy_code":"${user.username}"}`
                        },
                        { 
                            name: "cta_copy",
                            buttonParamsJson: `{"display_text":"Copy Password","copy_code":"${password}"}`
                        },
                        { 
                            name: "cta_url",
                            buttonParamsJson: `{"display_text":"Open Panel","url":"${global.domain}"}`
                        }
                    ]
                }
            }
        }
    }
}, {});

await sock.relayMessage(orang, msg.message, { messageId: msg.key.id });
    } catch (err) {
        return m.reply("Terjadi kesalahan: " + err.message);
    }
}
break

//###############################//

case "delpanel": {
    if (!isOwner && !isReseller) {
        return m.reply(mess.owner);
    }
    const rows = []
    rows.push({
title: `Hapus Semua`,
description: `Hapus semua server panel`, 
id: `.delpanel-all`
})            
    try {
        const response = await fetch(`${domain}/api/application/servers`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${apikey}`,
            },
        });

        const result = await response.json();
        const servers = result.data;

        if (!servers || servers.length === 0) {
            return m.reply("Tidak ada server panel!");
        }

        let messageText = `\n*Total server panel :* ${servers.length}\n`

        for (const server of servers) {
            const s = server.attributes;

            const resStatus = await fetch(`${domain}/api/client/servers/${s.uuid.split("-")[0]}/resources`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${capikey}`,
                },
            });

            const statusData = await resStatus.json();

            const ram = s.limits.memory === 0
                ? "Unlimited"
                : s.limits.memory >= 1024
                ? `${Math.floor(s.limits.memory / 1024)} GB`
                : `${s.limits.memory} MB`;

            const disk = s.limits.disk === 0
                ? "Unlimited"
                : s.limits.disk >= 1024
                ? `${Math.floor(s.limits.disk / 1024)} GB`
                : `${s.limits.disk} MB`;

            const cpu = s.limits.cpu === 0
                ? "Unlimited"
                : `${s.limits.cpu}%`;
            rows.push({
title: `${s.name} || ID:${s.id}`,
description: `Ram ${ram} || Disk ${disk} || CPU ${cpu}`, 
id: `.delpanel-response ${s.id}`
})            
        }                  
        await sock.sendMessage(m.chat, {
  buttons: [
    {
    buttonId: 'action',
    buttonText: { displayText: 'ini pesan interactiveMeta' },
    type: 4,
    nativeFlowInfo: {
        name: 'single_select',
        paramsJson: JSON.stringify({
          title: 'Pilih Server Panel',
          sections: [
            {
              title: `© Powered By ${namaOwner}`,
              rows: rows
            }
          ]
        })
      }
      }
  ],
  headerType: 1,
  viewOnce: true,
  text: `\nPilih Server Panel Yang Ingin Dihapus\n`
}, { quoted: m })

    } catch (err) {
        console.error("Error listing panel servers:", err);
        m.reply("Terjadi kesalahan saat mengambil data server.");
    }
}
break;

//###############################//

case "delpanel-response": {
    if (!isOwner) return m.reply(mess.owner);
    if (!text) return 
    
    try {
        const serverResponse = await fetch(domain + "/api/application/servers", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + apikey
            }
        });
        const serverData = await serverResponse.json();
        const servers = serverData.data;
        
        let serverName;
        let serverSection;
        let serverFound = false;
        
        for (const server of servers) {
            const serverAttr = server.attributes;
            
            if (Number(text) === serverAttr.id) {
                serverSection = serverAttr.name.toLowerCase();
                serverName = serverAttr.name;
                serverFound = true;
                
                const deleteServerResponse = await fetch(domain + `/api/application/servers/${serverAttr.id}`, {
                    method: "DELETE",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + apikey
                    }
                });
                
                if (!deleteServerResponse.ok) {
                    const errorData = await deleteServerResponse.json();
                    console.error("Gagal menghapus server:", errorData);
                }
                
                break;
            }
        }
        
        if (!serverFound) {
            return m.reply("Gagal menghapus server!\nID server tidak ditemukan");
        }
        
        const userResponse = await fetch(domain + "/api/application/users", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + apikey
            }
        });
        const userData = await userResponse.json();
        const users = userData.data;
        
        for (const user of users) {
            const userAttr = user.attributes;
            
            if (userAttr.first_name.toLowerCase() === serverSection) {
                const deleteUserResponse = await fetch(domain + `/api/application/users/${userAttr.id}`, {
                    method: "DELETE",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + apikey
                    }
                });
                
                if (!deleteUserResponse.ok) {
                    const errorData = await deleteUserResponse.json();
                    console.error("Gagal menghapus user:", errorData);
                }
                
                break;
            }
        }
        
        await m.reply(`*Barhasil Menghapus Sever Panel ✅*\n- ID: ${text}\n- Nama Server: ${capital(serverName)}`);
        
    } catch (error) {
        console.error("Error dalam proses delpanel:", error);
        await m.reply("Terjadi kesalahan saat memproses permintaan");
    }
}
break;

//###############################//

case "delpanel-all": {
if (!isOwner) return m.reply(mess.owner)
await m.reply(`Memproses penghapusan semua user & server panel yang bukan admin`)
try {
const PTERO_URL = global.domain
// Ganti dengan URL panel Pterodactyl
const API_KEY = global.apikey// API Key dengan akses admin

// Konfigurasi headers
const headers = {
  "Authorization": "Bearer " + API_KEY,
  "Content-Type": "application/json",
  "Accept": "application/json",
};

// Fungsi untuk mendapatkan semua user
async function getUsers() {
  try {
    const res = await axios.get(`${PTERO_URL}/api/application/users`, { headers });
    return res.data.data;
  } catch (error) {
    m.reply(JSON.stringify(error.response?.data || error.message, null, 2))
    
    return [];
  }
}

// Fungsi untuk mendapatkan semua server
async function getServers() {
  try {
    const res = await axios.get(`${PTERO_URL}/api/application/servers`, { headers });
    return res.data.data;
  } catch (error) {
    m.reply(JSON.stringify(error.response?.data || error.message, null, 2))
    return [];
  }
}

// Fungsi untuk menghapus server berdasarkan UUID
async function deleteServer(serverUUID) {
  try {
    await axios.delete(`${PTERO_URL}/api/application/servers/${serverUUID}`, { headers });
    console.log(`Server ${serverUUID} berhasil dihapus.`);
  } catch (error) {
    console.error(`Gagal menghapus server ${serverUUID}:`, error.response?.data || error.message);
  }
}

// Fungsi untuk menghapus user berdasarkan ID
async function deleteUser(userID) {
  try {
    await axios.delete(`${PTERO_URL}/api/application/users/${userID}`, { headers });
    console.log(`User ${userID} berhasil dihapus.`);
  } catch (error) {
    console.error(`Gagal menghapus user ${userID}:`, error.response?.data || error.message);
  }
}

// Fungsi utama untuk menghapus semua user & server yang bukan admin
async function deleteNonAdminUsersAndServers() {
  const users = await getUsers();
  const servers = await getServers();
  let totalSrv = 0

  for (const user of users) {
    if (user.attributes.root_admin) {
      console.log(`Lewati admin: ${user.attributes.username}`);
      continue; // Lewati admin
    }

    const userID = user.attributes.id;
    const userEmail = user.attributes.email;

    console.log(`Menghapus user: ${user.attributes.username} (${userEmail})`);

    // Cari server yang dimiliki user ini
    const userServers = servers.filter(srv => srv.attributes.user === userID);

    // Hapus semua server user ini
    for (const server of userServers) {
      await deleteServer(server.attributes.id);
      totalSrv += 1
    }

    // Hapus user setelah semua servernya terhapus
    await deleteUser(userID);
  }
await m.reply(`Berhasil menghapus *${totalSrv} user & server* panel yang bukan admin ✅`)
}

// Jalankan fungsi
return deleteNonAdminUsersAndServers();
} catch (err) {
return m.reply(`${JSON.stringify(err, null, 2)}`)
}
}
break

//###############################//

case "listpanel":
case "listserver": {
    if (!isOwner && !isReseller) {
        return m.reply(`Fitur ini hanya untuk di dalam grup reseller panel`);
    }

    try {
        const response = await fetch(`${domain}/api/application/servers`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${apikey}`,
            },
        });

        const result = await response.json();
        const servers = result.data;

        if (!servers || servers.length === 0) {
            return m.reply("Tidak ada server panel!");
        }

        let messageText = `\n*Total server panel :* ${servers.length}\n`

        for (const server of servers) {
            const s = server.attributes;

            const resStatus = await fetch(`${domain}/api/client/servers/${s.uuid.split("-")[0]}/resources`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${capikey}`,
                },
            });

            const statusData = await resStatus.json();

            const ram = s.limits.memory === 0
                ? "Unlimited"
                : s.limits.memory >= 1024
                ? `${Math.floor(s.limits.memory / 1024)} GB`
                : `${s.limits.memory} MB`;

            const disk = s.limits.disk === 0
                ? "Unlimited"
                : s.limits.disk >= 1024
                ? `${Math.floor(s.limits.disk / 1024)} GB`
                : `${s.limits.disk} MB`;

            const cpu = s.limits.cpu === 0
                ? "Unlimited"
                : `${s.limits.cpu}%`;

            messageText += `
- ID : *${s.id}*
- Nama Server : *${s.name}*
- Ram : *${ram}*
- Disk : *${disk}*
- CPU : *${cpu}*
- Created : *${s.created_at.split("T")[0]}*\n`;
        }                  
        await m.reply(messageText)

    } catch (err) {
        console.error("Error listing panel servers:", err);
        m.reply("Terjadi kesalahan saat mengambil data server.");
    }
}
break;

//###############################//

case "cadmin": {
    if (!isOwner) return m.reply(mess.owner);
    if (!text) return m.reply(`Masukan username & nomor (opsional)\n*contoh:* ${cmd} ndika,628XXX`)
    let nomor, usernem;
    const tek = text.split(",");
    if (tek.length > 1) {
        let [users, nom] = tek;
        if (!users || !nom) return m.reply(`Masukan username & nomor (opsional)\n*contoh:* ${cmd} ndika,628XXX`)

        nomor = nom.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        usernem = users.toLowerCase();
    } else {
        usernem = text.toLowerCase();
        nomor = m.isGroup ? m.sender : m.chat;
    }

    const onWa = await sock.onWhatsApp(nomor.split("@")[0]);
    if (onWa.length < 1) return m.reply("Nomor target tidak terdaftar di WhatsApp!");

    const username = usernem.toLowerCase();
    const email = `${username}@gmail.com`;
    const name = global.capital(args[0]);
    const password = `${username}001`;

    try {
        const res = await fetch(`${domain}/api/application/users`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${apikey}`
            },
            body: JSON.stringify({
                email,
                username,
                first_name: name,
                last_name: "Admin",
                root_admin: true,
                language: "en",
                password
            })
        });

        const data = await res.json();
        if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2));

        const user = data.attributes;
        const orang = nomor;

        if (nomor !== m.chat) {
            await m.reply(`Berhasil membuat akun admin panel ✅\nData akun terkirim ke nomor ${nomor.split("@")[0]}`);
        }

const teks = `
*Berikut membuat admin panel ✅*

📡 Server ID: ${user.id}
👤 Username: \`${user.username}\`
🔐 Password: \`${password}\`
🗓️ Tanggal Aktivasi: ${global.tanggal(Date.now())}
*🌐* ${global.domain}

*Rules pembelian admin panel*  
- Masa aktif 30 hari  
- Data bersifat pribadi, mohon disimpan dengan aman  
- Garansi berlaku 15 hari (1x replace)  
- Klaim garansi wajib menyertakan *bukti chat pembelian*
`;

let msg = generateWAMessageFromContent(orang, {
    viewOnceMessage: {
        message: {
            interactiveMessage: {
                body: { text: teks },
                nativeFlowMessage: {
                    buttons: [
                        { 
                            name: "cta_copy",
                            buttonParamsJson: `{"display_text":"Copy Username","copy_code":"${user.username}"}`
                        },
                        { 
                            name: "cta_copy",
                            buttonParamsJson: `{"display_text":"Copy Password","copy_code":"${password}"}`
                        },
                        { 
                            name: "cta_url",
                            buttonParamsJson: `{"display_text":"Open Panel","url":"${global.domain}"}`
                        }
                    ]
                }
            }
        }
    }
}, {});

await sock.relayMessage(orang, msg.message, { messageId: msg.key.id });
    } catch (err) {
        console.error(err);
        m.reply("Terjadi kesalahan saat membuat akun admin panel.");
    }
}
break;

//###############################//

case "deladmin": {
    if (!isOwner) return m.reply(mess.owner);
    try {
        const res = await fetch(`${domain}/api/application/users`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${apikey}`
            }
        });
        const rows = []
        const data = await res.json();
        const users = data.data;

        const adminUsers = users.filter(u => u.attributes.root_admin === true);
        if (adminUsers.length < 1) return m.reply("Tidak ada admin panel.");

        let teks = `\n*Total admin panel :* ${adminUsers.length}\n`
        adminUsers.forEach((admin, idx) => {
            teks += `
- ID : *${admin.attributes.id}*
- Nama : *${admin.attributes.first_name}*
- Created : ${admin.attributes.created_at.split("T")[0]}
`;
rows.push({
title: `${admin.attributes.first_name} || ID:${admin.attributes.id}`,
description: `Created At: ${admin.attributes.created_at.split("T")[0]}`, 
id: `.deladmin-response ${admin.attributes.id}`
})            
        });

        await sock.sendMessage(m.chat, {
  buttons: [
    {
    buttonId: 'action',
    buttonText: { displayText: 'ini pesan interactiveMeta' },
    type: 4,
    nativeFlowInfo: {
        name: 'single_select',
        paramsJson: JSON.stringify({
          title: 'Pilih Admin Panel',
          sections: [
            {
              title: `© Powered By ${namaOwner}`,
              rows: rows
            }
          ]
        })
      }
      }
  ],
  headerType: 1,
  viewOnce: true,
  text: `\nPilih Admin Panel Yang Ingin Dihapus\n`
}, { quoted: m })

    } catch (err) {
        console.error(err);
        m.reply("Terjadi kesalahan saat mengambil data admin.");
    }
}
break;

//###############################//

case "deladmin-response": {
    if (!isOwner) return m.reply(mess.owner);
    if (!text) return 
    try {
        const res = await fetch(`${domain}/api/application/users`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${apikey}`
            }
        });

        const data = await res.json();
        const users = data.data;

        let targetAdmin = users.find(
            (e) => e.attributes.id == args[0] && e.attributes.root_admin === true
        );

        if (!targetAdmin) {
            return m.reply("Gagal menghapus akun!\nID user tidak ditemukan");
        }

        const idadmin = targetAdmin.attributes.id;
        const username = targetAdmin.attributes.username;

        const delRes = await fetch(`${domain}/api/application/users/${idadmin}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${apikey}`
            }
        });

        if (!delRes.ok) {
            const errData = await delRes.json();
            return m.reply(`Gagal menghapus akun admin!\n${JSON.stringify(errData.errors[0], null, 2)}`);
        }

        await m.reply(`*Berhasil Menghapus Admin Panel ✅*\n- ID: ${text}\n- Nama User: ${global.capital(username)}`);

    } catch (err) {
        console.error(err);
        m.reply("Terjadi kesalahan saat menghapus akun admin.");
    }
}
break;

//###############################//

case "listadmin": {
    if (!isOwner) return m.reply(mess.owner);

    try {
        const res = await fetch(`${domain}/api/application/users`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${apikey}`
            }
        });

        const data = await res.json();
        const users = data.data;

        const adminUsers = users.filter(u => u.attributes.root_admin === true);
        if (adminUsers.length < 1) return m.reply("Tidak ada admin panel.");

        let teks = `\n*Total admin panel :* ${adminUsers.length}\n`
        adminUsers.forEach((admin, idx) => {
            teks += `
- ID : *${admin.attributes.id}*
- Nama : *${admin.attributes.first_name}*
- Created : ${admin.attributes.created_at.split("T")[0]}
`;
        });

        await m.reply(teks)

    } catch (err) {
        console.error(err);
        m.reply("Terjadi kesalahan saat mengambil data admin.");
    }
}
break;

//###############################//

case "addseller": {
    if (!isOwner) return m.reply(mess.owner);
    if (!text && !m.quoted) return m.reply(`*contoh:* ${cmd} 6283XXX`);

    const input = m.mentionedJid[0] 
        ? m.mentionedJid[0] 
        : m.quoted 
            ? m.quoted.sender 
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    const input2 = input.split("@")[0];

    if (input2 === global.owner || global.db.settings.reseller.includes(input) || input === botNumber)
        return m.reply(`Nomor ${input2} sudah menjadi reseller!`);

    global.db.settings.reseller.push(input);
    m.reply(`Berhasil menambah reseller ✅`);
}
break;

//###############################//

case "listseller": {
    const list = global.db.settings.reseller;
    if (!list || list.length < 1) return m.reply("Tidak ada user reseller");

    let teks = `Daftar reseller:\n`;
    for (let i of list) {
        const num = i.split("@")[0];
        teks += `\n• ${num}\n  Tag: @${num}\n`;
    }

    sock.sendMessage(m.chat, { text: teks, mentions: list }, { quoted: m });
}
break;

//###############################//

case "delseller": {
    if (!isOwner) return m.reply(mess.owner);
    if (!m.quoted && !text) return m.reply(`*Contoh :* ${cmd} 6283XXX`);

    const input = m.mentionedJid[0] 
        ? m.mentionedJid[0] 
        : m.quoted 
            ? m.quoted.sender 
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    const input2 = input.split("@")[0];

    if (input2 === global.owner || input === botNumber)
        return m.reply(`Tidak bisa menghapus owner!`);

    const list = global.db.settings.reseller;
    if (!list.includes(input))
        return m.reply(`Nomor ${input2} bukan reseller!`);

    list.splice(list.indexOf(input), 1);
    m.reply(`Berhasil menghapus reseller ✅`);
}
break;

//###############################//

case "own": case "owner": {
await sock.sendContact(m.chat, [global.owner], global.namaOwner, "Developer Bot", m)
}
break

//###############################//

case "addowner": case "addown": {
    if (!isOwner) return m.reply(mess.owner);

    const input = m.quoted 
        ? m.quoted.sender 
        : m.mentionedJid[0] 
            ? m.mentionedJid[0] 
            : text 
                ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net" 
                : null;

    if (!input) return m.reply(`*Contoh penggunaan :*\n${cmd} 6285XXX`);

    const jid = input.split("@")[0];
    const botNumber = sock.user.id.split(":")[0] + "@s.whatsapp.net";

    if (jid == global.owner || input == botNumber) 
        return m.reply(`Nomor ${jid} sudah menjadi ownerbot.`);

    if (global.db.settings.developer.includes(input)) 
        return m.reply(`Nomor ${jid} sudah menjadi ownerbot.`);

    global.db.settings.developer.push(input);
    return m.reply(`Berhasil menambah owner ✅\n- ${jid}`);
}
break;

//###############################//

case "delowner": case "delown": {
    if (!isOwner) return m.reply(mess.owner);

    const input = m.quoted 
        ? m.quoted.sender 
        : m.mentionedJid[0] 
            ? m.mentionedJid[0] 
            : text 
                ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net" 
                : null;

    if (!input) return m.reply(`*Contoh penggunaan :*\n${cmd} 6285XXX`);

    if (input.toLowerCase() === "all") {
        global.db.settings.developer = [];
        return m.reply("Berhasil menghapus semua owner ✅");
    }

    if (!global.db.settings.developer.includes(input)) 
        return m.reply("Nomor tidak ditemukan!");

    global.db.settings.developer = global.db.settings.developer.filter(i => i !== input);
    return m.reply(`Berhasil menghapus owner ✅\n- ${input.split("@")[0]}`);
}
break;

//###############################//

case "listowner": case "listown": {
    const Own = global.db.settings.developer;
    if (!Own || Own.length < 1) return m.reply("Tidak ada owner tambahan.");

    let teks = "Daftar owner tambahan:\n";
    for (let i of Own) {
        const num = i.split("@")[0];
        teks += `\n- Number: ${num}\n- Tag: @${num}\n`;
    }
    return sock.sendMessage(m.chat, { text: teks, mentions: Own }, { quoted: m });
}
break;

//###############################//

case "resetdb": case "rstdb": {
if (!isOwner) return m.reply(mess.owner)
global.db = {}
return m.reply("Berhasil mereset database ✅")
}
break

//###############################//
case "sc": {
const teks = `
Sell Script Full Case by Jeeyhosting ⚡:

- Puskonta 2 anti delay ( button old)
- Jpmslide ke semua group (button old)
- Cpanel 1 server (full button old)
- No enc - muda di riname
- No backdor - tidak memiliki virus
- Cocok all bisnis
- Fitur lengkap
- New fitur Nokos

Harga Script:
25k - no update
30k - free update

🪀 *Channel Informasi:*
https://whatsapp.com/channel/0029Vb6uESDISTkLnzSn1G3l
🪀 *Group Promotion:*
https://chat.whatsapp.com/IdXBeGq1DqRBDkdz7YbEam
🪀 Contact Costumer 
https://wa.me/6283122028438`;

await m.reply(teks);
}
break
//###############################//
case "jpmslide": 
case "startjpmslide": {
    if (!isOwner) return m.reply(mess.owner);
    
    try {
        const baileys = require("baileys");
        
        let total = 0;
        let getGroups = await sock.groupFetchAllParticipating();
        let groups = Object.entries(getGroups).slice(0).map((entry) => entry[1]);
        let usergc = groups.map((v) => v.id);
        
        // Hitung estimasi waktu
        let totalDelayMs = global.JedaJpm * usergc.length;
        let estimasiMenit = Math.ceil(totalDelayMs / 60000);
        
        // Siapkan 8 gambar dari URL (pakai thumbnail jika slide1-8 belum ada)
        let imgsc1 = await prepareWAMessageMedia({ 
            image: { url: global.slide1 || global.thumbnail }
        }, { upload: sock.waUploadToServer });
        
        let imgsc2 = await prepareWAMessageMedia({ 
            image: { url: global.slide2 || global.thumbnail }
        }, { upload: sock.waUploadToServer });
        
        let imgsc3 = await prepareWAMessageMedia({ 
            image: { url: global.slide3 || global.thumbnail }
        }, { upload: sock.waUploadToServer });
        
        let imgsc4 = await prepareWAMessageMedia({ 
            image: { url: global.slide4 || global.thumbnail }
        }, { upload: sock.waUploadToServer });
        
        let imgsc5 = await prepareWAMessageMedia({ 
            image: { url: global.slide5 || global.thumbnail }
        }, { upload: sock.waUploadToServer });
        
        let imgsc6 = await prepareWAMessageMedia({ 
            image: { url: global.slide6 || global.thumbnail }
        }, { upload: sock.waUploadToServer });
        
        let imgsc7 = await prepareWAMessageMedia({ 
            image: { url: global.slide7 || global.thumbnail }
        }, { upload: sock.waUploadToServer });
        
        let imgsc8 = await prepareWAMessageMedia({ 
            image: { url: global.slide8 || global.thumbnail }
        }, { upload: sock.waUploadToServer });
        
        const msgii = await generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: baileys.proto.Message.InteractiveMessage.fromObject({
                        body: baileys.proto.Message.InteractiveMessage.Body.fromObject({
                            text: `All Transaksi Open ✓\n\n${global.namabot || global.namaOwner} Menyediakan Produk & Jasa Dibawah Ini ⬇️`
                        }),
                        carouselMessage: baileys.proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards: [
                                {
                                    header: baileys.proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `*🔥 READY SCRIPT - BUY NOKOS TELEGRAM*
💠 Simple • Powerful • Full Auto

Mau buka jasa jual nomor OTP / Nokos langsung dari Telegram?
Ini script paling stabil & anti ribet yang pernah kamu pakai!

*FITUR UNGGULAN:*
- Instalasi super cepat — tinggal upload, langsung running
- Sistem deposit otomatis (auto balance update)
- Support QRIS full auto — scan → bayar → saldo masuk!
- Pembelian nomor OTP otomatis dari bot
- Stok & layanan update real-time
- File ringan, mudah custom, cocok buat reseller & owner baru
- Free tutorial setting payment gateway sampai beres
🎮 100% auto, 0% pusing — tinggal jalanin, auto cuan!

Buka layanan nokos kamu sendiri cuma dari Telegram
No skill? No problem. Script ini yang kerja, kamu tinggal panen 🚀`,
                                        hasMediaAttachment: true,
                                        ...imgsc1
                                    }),
                                    nativeFlowMessage: baileys.proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: JSON.stringify({
                                                "display_text": "🤖 DEMO BOT:",
                                                "url": `https://t.me/Jeeytsdbot`,
                                                "merchant_url": global.web || global.linkGrup || `https://t.me/Jeeytsdbot`
                                            })
                                        }]
                                    })
                                },
                                {
                                    header: baileys.proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `*🥳 BOT WHATSAPP TOP UP OTOMATIS 24 JAM!*

Belanja produk digital jadi lebih mudah! Proses otomatis, cepat, dan aman kapan saja.

*🎮 PRODUK TERSEDIA:*
✓ Game Populer (ML, PUBG, FF, Genshin, Valorant, dll)
✓ Pulsa & Paket Data (Semua Operator)
✓ E-Wallet (DANA, OVO, GoPay, ShopeePay, dll)
✓ Voucher Premium (Netflix, Spotify, Google Play, PlayStation, Xbox, dll)

*⚡ KEUNGGULAN:*
• Layanan otomatis 24/7 non-stop
• Proses super cepat (hitungan detik!)
• Harga terjangkau & kompetitif
• Terintegrasi payment gateway
• FULL GARANSI - Aman & terpercaya

*🛍️ CARA ORDER:*
Sangat mudah! Cukup klik link di bawah, bot akan kirim menu lengkap:

Klik sekarang dan nikmati kemudahan top up otomatis! 🚀`,
                                        hasMediaAttachment: true,
                                        ...imgsc2
                                    }),
                                    nativeFlowMessage: baileys.proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: JSON.stringify({
                                                "display_text": "🛍️ TOPUP OTOMATIS",
                                                "url": `https://wa.me/6283190537561?text=.menu`,
                                                "merchant_url": global.web || global.linkGrup || `https://wa.me/6283190537561?text=.menu`
                                            })
                                        }]
                                    })
                                },
                                {
                                    header: baileys.proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `📚 Paket Buku Digital Lengkap - Cuma Rp 9.900

Capek beli Buku satu-satu? Sekarang bisa akses ratusan Buku dalam 1 paket

Apa aja isinya:
• Self Improvement & Mindset
• Bisnis, Marketing & Finansial
• Saham, Crypto & Investasi
• Bahasa Inggris (Basic–Advanced)
• Novel Fiksi & Inspiratif
• Filsafat & Psikologi
• Panduan Muslim & Kristiani
• Modul Skill & Produktivitas dll

📥 Format: PDF (bisa dibaca di HP/tablet/laptop)
📁 Akses: Google Drive seumur hidup
🎯 Cocok buat: Pelajar, mahasiswa, karyawan, freelancer & pebisnis
💰 Cuma Rp 9.900 - Sekali bayar, akses selamanya

Harga kopi habis sejam, ilmu ini bertahan seumur hidup ☕`,
                                        hasMediaAttachment: true,
                                        ...imgsc3
                                    }),
                                    nativeFlowMessage: baileys.proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: JSON.stringify({
                                                "display_text": "📚 BUKU DIGITAL",
                                                "url": `https://wa.me/message/DS6PVPWYESDTB1`,
                                                "merchant_url": global.web || global.linkGrup || `https://wa.me/message/DS6PVPWYESDTB1`
                                            })
                                        }]
                                    })
                                },
                                {
                                    header: baileys.proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `🔥 CAPCUT PRO 3 BULAN ~Rp30.000~
💎 RESMI + BONUS ASSETS

KENAPA BELI DI SINI?
✅ 100% Original (bukan MOD)
✅ Tanpa watermark
✅ Semua fitur premium unlocked
✅ Garansi 3 bulan full
✅ Bonus aset editing eksklusif
✅ Bisa untuk semua device (HP/PC)
✅ Support 24/7 via WA

BANDINGKAN:
• Harga resmi: Rp75k-129k/bulan
• Harga kami: Rp30k untuk 3 bulan! 💰

CARA PAKAI:
Login pakai email & password dari kami → Langsung aktif! Gak perlu uninstall app.
⚡ HEMAT 90% - DIJAMIN AMAN

Buruan order sebelum harga naik 🚀`,
                                        hasMediaAttachment: true,
                                        ...imgsc4
                                    }),
                                    nativeFlowMessage: baileys.proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: JSON.stringify({
                                                "display_text": "🔥CAPCUT PRO ORI",
                                                "url": `https://lynk.id/jeeyhosting/QyB2Dk6`,
                                                "merchant_url": global.web || global.linkGrup || `https://lynk.id/jeeyhosting/QyB2Dk6`
                                            })
                                        }]
                                    })
                                },
                                {
                                    header: baileys.proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `⚡JADI BOT JPMSLDER - PUSHKONTA - BUTTON NEW
- 𝚁𝚙 5.000: 2 𝙼𝙸𝙽𝙶𝙶𝚄
- 𝚁𝚙 8.000 : 1 𝙱𝚄𝙻𝙰𝙽
- 𝚁𝚙 10.000 :𝙿𝙴𝚁𝙼𝙰𝙽𝙴𝙽

𝐒𝐄𝐖𝐀 𝐁𝐎𝐓 𝐏𝐔𝐒𝐇𝐊𝐎𝐍𝐓𝐀𝐊
- Rp 5.000 : 1 𝙼𝙸𝙽𝙶𝙶𝚄
- Rp 8.000 : 15 𝙷𝙰𝚁𝙸
- Rp. 10.000 : 1 𝙱𝚄𝙻𝙰𝙽`,
                                        hasMediaAttachment: true,
                                        ...imgsc5
                                    }),
                                    nativeFlowMessage: baileys.proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: JSON.stringify({
                                                "display_text": "⚡ LIHAT SCRIPT",
                                                "url": `https://wa.me/${global.owner}`,
                                                "merchant_url": global.web || global.linkGrup || `https://wa.me/${global.owner}`
                                            })
                                        }]
                                    })
                                },
                                {
                                    header: baileys.proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `💎 JASA INSTALL

▸ Install Panel + Wings
▸ Run Bot WhatsApp
▸ Setup Server
▸ Eror bisa di fix
▸ Riname script
▸ tanya aja lain`,
                                        hasMediaAttachment: true,
                                        ...imgsc6
                                    }),
                                    nativeFlowMessage: baileys.proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: JSON.stringify({
                                                "display_text": "💎 JASA BOTKU",
                                                "url": `https://wa.me/${global.owner}`,
                                                "merchant_url": global.web || global.linkGrup || `https://wa.me/${global.owner}`
                                            })
                                        }]
                                    })
                                },
                                {
                                    header: baileys.proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `🪙
                                        ISI PRODUK AKADEMI CRYPTO :
40+ Modul
300+ Materi Video
Free E-Book Akademi Crypto
Free Materi Sekolah
Jalanan ( By Timothy Ronald )
- Akses Modul itu sudah Lifetime / Permanen
- Semua Modul, Video, dan File bisa di Download
- Materi akan selalu di-Update setiap Minggu nya
- Semua isi Materi 100% sama seperti Materi yang ada di Akademi Crypto.
- Modul diMentorin oleh Timothy Ronald, Kalimasada ( AVS ), Dan Professor Akademi Crypto lainnya
📚 List Materi didalam Akademi Crypto
Crypto Trading (15 Modul)
- Cara Screening Altcoin dari Nol
- Crypto Technical Indicators
- Crypto Money Psychology
- Crypto Harmonic Trading
- Crypto Fibonacci Secret
- Crypto WyckOff Trading
- Fundamental Research
- Kamus Pattern Crypto
- Technical Research
- Mind Management
- Narrative Research
- Crypto Order Flow
- Crypto Trading
Crypto Investing (6 Modul)
- Crypto Investing Principles
- Cryptocurrency Investing
- Crypto Investing Strategy
- Crypto Investing Guide
- Crypto Investing Tools
- Crypto Investing Alpha
Blockchain Techology (10 Modul)
- Ethereum Programmable Money
- Cryptocurrency Fundamentals
- Smart Contract Development
- Bitcoin Transaction in-Depth
- Blockchain Interoperability
- Smart Contract Security
- Cryptocurrency Security
- Crypto Self Custody
- Monero Anonymity
- Crypto Research

📍 Delisted Material
- Bitcoin The Currency of The Internet Decentralized Finance ( DeFi )`,
                                        hasMediaAttachment: true,
                                        ...imgsc7
                                    }),
                                    nativeFlowMessage: baileys.proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: JSON.stringify({
                                                "display_text": "🪙 AKADEMI CRYPTO",
                                                "url": `https://lynk.id/jeeyhosting/vv3plrjxzxwz`,
                                                "merchant_url": global.web || global.linkGrup || `https://lynk.id/jeeyhosting/vv3plrjxzxwz`
                                            })
                                        }]
                                    })
                                },
                                {
                                    header: baileys.proto.Message.InteractiveMessage.Header.fromObject({
                                        title: `🚀 CONST CS KAMI 

* *GROUP PROMOSI*
https://chat.whatsapp.com/IdXBeGq1DqRBDkdz7YbEam

* *CHANNEL INFORMASI*
https://whatsapp.com/channel/0029VamwOPd42DcmYmq8El01

* *TESTIMONI PRODUK*
https://t.me/MarketplaceclCretatorID

* *KONTAK WA*
https://jeeycontak.surge.sh

* *KONTAK TELE*
https://t.me/Jeeyhosting

* *PRODUK LENGKAP*
jeey.surge.sh`,
                                        hasMediaAttachment: true,
                                        ...imgsc8
                                    }),
                                    nativeFlowMessage: baileys.proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: JSON.stringify({
                                                "display_text": "🚀 TESTIMONI PRODUK",
                                                "url": global.linkChannel || `https://t.me/MarketplaceclCretatorID`,
                                                "merchant_url": global.web || global.linkGrup || `https://t.me/MarketplaceclCretatorID`
                                            })
                                        }]
                                    })
                                }
                            ]
                        })
                    })
                }
            }
        }, { userJid: m.sender, quoted: FakeChannel });

        await m.reply(`⏳ Memproses Mengirim Pesan Slide Teks & Foto Ke ${usergc.length} Grup\n\n⏰ Estimasi Waktu Selesai: ${estimasiMenit} menit`);

        global.statusjpm = true;

        for (let jid of usergc) {
            if (db.settings.bljpm && db.settings.bljpm.includes(jid)) continue;
            
            if (global.stopjpm) {
                delete global.stopjpm;
                delete global.statusjpm;
                break;
            }
            
            try {
                await sock.relayMessage(jid, msgii.message, { messageId: msgii.key.id });
                total += 1;
            } catch (e) {
                console.log(`Error sending slide to ${jid}:`, e.message || e);
            }
            
            await sleep(global.JedaJpm || 4000);
        }

        delete global.statusjpm;
        await m.reply(`✅ Berhasil Mengirim Pesan Slide Teks & Foto Ke ${total} Grup dari total ${usergc.length} grup`);

    } catch (error) {
        console.error('Error in jpmslide:', error);
        await m.reply(`❌ Terjadi kesalahan saat mengirim JPM Slide: ${error.message}`);
    }
}
break;
//###############################//
// 🚀 MENU UTAMA NOKOS
//###############################//
case "ordernokos":
case "nokos": {
    // Validasi apakah fitur aktif
    const isPrivate = !m.isGroup;
    const nokosSettings = global.db.settings.nokos;
    
    if (isPrivate && !nokosSettings.enablePrivate) {
        return m.reply("❌ Fitur Nokos dimatikan untuk chat pribadi.\n\nHubungi owner untuk mengaktifkan.");
    }
    
    if (m.isGroup && !nokosSettings.enableGroup) {
        return m.reply("❌ Fitur Nokos dimatikan untuk group.\n\nHubungi admin/owner untuk mengaktifkan.");
    }

    const fs = require("fs");
    const name = m.pushName || "User";
    const userId = m.sender.split("@")[0];
    
    const dbDir = "./database";
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    
    const saldoPath = "./database/saldoOtp.json";
    if (!fs.existsSync(saldoPath)) fs.writeFileSync(saldoPath, JSON.stringify({}));
    
    const saldoData = JSON.parse(fs.readFileSync(saldoPath));
    const saldoUser = saldoData[userId] || 0;

    const caption = `
👋 Halo *${name}*!  
Selamat datang di *Layanan Nomor Virtual OTP*

╭─⭐ *INFO AKUN*
│ 👤 Nama: *${name}*  
│ 🆔 ID: \`${userId}\`  
│ 💰 Saldo: Rp${saldoUser.toLocaleString("id-ID")}
│ 📍 Chat: ${m.isGroup ? "Group" : "Private"}
╰────────────

╭─🎯 *KEUNGGULAN*
│ ✅ Verifikasi instan
│ ✅ Harga mulai Rp 2.000
│ ✅ Auto refund jika gagal
│ ✅ Support 24/7
│ ✅ Real-time OTP (2 detik)
╰────────────

📱 Pilih menu di bawah untuk memulai:
`;

    let msg = await generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        hasMediaAttachment: true,
                        ...(await prepareWAMessageMedia(
                            { image: { url: global.thumbnail } },
                            { upload: sock.waUploadToServer }
                        ))
                    },
                    body: { text: caption },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Menu Nokos",
                                    sections: [{
                                        title: "Layanan Tersedia",
                                        rows: [
                                            {
                                                title: "🌍 Order Nomor",
                                                description: "Pesan nomor virtual",
                                                id: ".pilih_layanan_nokos"
                                            },
                                            {
                                                title: "💰 Topup Saldo",
                                                description: "Isi saldo deposit",
                                                id: ".topup_nokos"
                                            },
                                            {
                                                title: "💳 Cek Saldo",
                                                description: "Lihat saldo kamu",
                                                id: ".ceksaldo_nokos"
                                            },
                                            {
                                                title: "🛒 History Order",
                                                description: "Riwayat pembelian",
                                                id: ".history_nokos"
                                            }
                                        ]
                                    }]
                                })
                            }
                        ]
                    }
                }
            }
        }
    }, { userJid: m.sender, quoted: m });

    await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}
break;

//###############################//
// 📦 STEP 1: PILIH LAYANAN
//###############################//
case "pilih_layanan_nokos": {
    const isPrivate = !m.isGroup;
    const nokosSettings = global.db.settings.nokos;
    
    if (isPrivate && !nokosSettings.enablePrivate) {
        return m.reply("❌ Fitur Nokos dimatikan untuk chat pribadi.");
    }
    
    if (m.isGroup && !nokosSettings.enableGroup) {
        return m.reply("❌ Fitur Nokos dimatikan untuk group.");
    }

    const axios = require("axios");
    const API_KEY = global.apiRumahOTP;
    
    if (!API_KEY) return m.reply("❌ API Key RumahOTP belum diset di settings.js!");

    await m.reply("⏳ Memuat daftar layanan...");

    try {
        const res = await axios.get("https://www.rumahotp.com/api/v2/services", {
            headers: { "x-apikey": API_KEY }
        });

        if (!res.data.success || !Array.isArray(res.data.data)) {
            return m.reply("❌ Gagal memuat layanan dari server.");
        }

        const services = res.data.data;
        global.cachedServicesNokos = services;

        const perPage = 20;
        const totalPages = Math.ceil(services.length / perPage);
        const list = services.slice(0, perPage);

        const rows = list.map(srv => ({
            title: srv.service_name,
            description: `ID: ${srv.service_code}`,
            id: `.pilih_negara_nokos ${srv.service_code}`
        }));

        if (totalPages > 1) {
            rows.push({
                title: "➡️ Halaman Berikutnya",
                description: "Lihat layanan lainnya",
                id: ".layanan_page_nokos 2"
            });
        }

        rows.push({
            title: "⬅️ Kembali",
            description: "Menu utama",
            id: ".nokos"
        });

        let msg = await generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { 
                            text: `📲 *Pilih Aplikasi/Layanan*\n\nTotal layanan: *${services.length}*\nHalaman: 1/${totalPages}`
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Pilih Layanan",
                                    sections: [{ title: "Daftar Layanan", rows }]
                                })
                            }]
                        }
                    }
                }
            }
        }, { userJid: m.sender, quoted: m });

        await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (err) {
        console.error(err);
        m.reply("❌ Terjadi kesalahan saat memuat layanan.");
    }
}
break;

//###############################//
// 📄 PAGINATION LAYANAN
//###############################//
case "layanan_page_nokos": {
    const isPrivate = !m.isGroup;
    const nokosSettings = global.db.settings.nokos;
    
    if (isPrivate && !nokosSettings.enablePrivate) {
        return m.reply("❌ Fitur Nokos dimatikan untuk chat pribadi.");
    }
    
    if (m.isGroup && !nokosSettings.enableGroup) {
        return m.reply("❌ Fitur Nokos dimatikan untuk group.");
    }

    const page = parseInt(args[0]) || 1;
    const services = global.cachedServicesNokos;

    if (!services || services.length === 0) {
        return m.reply("❌ Data layanan tidak ditemukan. Silakan ketik *.nokos* lagi.");
    }

    const perPage = 20;
    const totalPages = Math.ceil(services.length / perPage);
    
    if (page < 1 || page > totalPages) {
        return m.reply(`❌ Halaman tidak valid. Total halaman: ${totalPages}`);
    }

    const start = (page - 1) * perPage;
    const list = services.slice(start, start + perPage);

    const rows = list.map(srv => ({
        title: srv.service_name,
        description: `ID: ${srv.service_code}`,
        id: `.pilih_negara_nokos ${srv.service_code}`
    }));

    if (page > 1) {
        rows.push({
            title: "⬅️ Halaman Sebelumnya",
            description: `Hal ${page - 1}`,
            id: `.layanan_page_nokos ${page - 1}`
        });
    }
    if (page < totalPages) {
        rows.push({
            title: "➡️ Halaman Berikutnya",
            description: `Hal ${page + 1}`,
            id: `.layanan_page_nokos ${page + 1}`
        });
    }

    rows.push({
        title: "⬅️ Kembali",
        description: "Menu utama",
        id: ".nokos"
    });

    let msg = await generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { 
                        text: `📲 *Pilih Aplikasi/Layanan*\n\nTotal: *${services.length}*\nHalaman: ${page}/${totalPages}`
                    },
                    nativeFlowMessage: {
                        buttons: [{
                            name: "single_select",
                            buttonParamsJson: JSON.stringify({
                                title: "Pilih Layanan",
                                sections: [{ title: "Daftar Layanan", rows }]
                            })
                        }]
                    }
                }
            }
        }
    }, { userJid: m.sender, quoted: m });

    await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}
break;

//###############################//
// 🌍 STEP 2: PILIH NEGARA
//###############################//
case "pilih_negara_nokos": {
     const isPrivate = !m.isGroup;
    const nokosSettings = global.db.settings.nokos;
    
    if (isPrivate && !nokosSettings.enablePrivate) {
        return m.reply("❌ Fitur Nokos dimatikan untuk chat pribadi.");
    }
    
    if (m.isGroup && !nokosSettings.enableGroup) {
        return m.reply("❌ Fitur Nokos dimatikan untuk group.");
    }
    const serviceId = args[0];
    if (!serviceId) return m.reply("❌ ID layanan tidak valid!");

    const axios = require("axios");
    const API_KEY = global.apiRumahOTP;

    await m.reply("⏳ Memuat daftar negara...");

    try {
        const res = await axios.get(
            `https://www.rumahotp.com/api/v2/countries?service_id=${serviceId}`,
            { headers: { "x-apikey": API_KEY } }
        );

        if (!res.data.success) return m.reply("❌ Gagal memuat negara.");

        const countries = res.data.data.filter(c => c.pricelist && c.pricelist.length > 0);
        
        if (countries.length === 0) {
            return m.reply("⚠️ Tidak ada negara tersedia untuk layanan ini.");
        }

        global.cachedCountriesNokos[serviceId] = countries;

        let serviceName = "Layanan";
        if (global.cachedServicesNokos) {
            const s = global.cachedServicesNokos.find(a => a.service_code == serviceId);
            if (s) serviceName = s.service_name;
        }

        const perPage = 20;
        const totalPages = Math.ceil(countries.length / perPage);
        const list = countries.slice(0, perPage);

        function getStockRate(stock) {
            if (stock >= 100) return "🟢";
            if (stock >= 50) return "🟡";
            if (stock >= 20) return "🟠";
            if (stock >= 1) return "🔴";
            return "⚫";
        }

        const rows = list.map(c => {
            const rate = getStockRate(c.stock_total);
            return {
                title: `${c.name} (${c.prefix})`,
                description: `Stok: ${c.stock_total} ${rate}`,
                id: `.pilih_harga_nokos ${serviceId} ${c.iso_code} ${c.number_id}`
            };
        });

        if (totalPages > 1) {
            rows.push({
                title: "➡️ Halaman Berikutnya",
                description: "Negara lainnya",
                id: `.negara_page_nokos ${serviceId} 2`
            });
        }

        rows.push({
            title: "⬅️ Kembali",
            description: "Pilih layanan lagi",
            id: ".pilih_layanan_nokos"
        });

        let msg = await generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { 
                            text: `🌍 *Pilih Negara*\n\nLayanan: *${serviceName}*\nTotal negara: *${countries.length}*\nHalaman: 1/${totalPages}\n\n📊 Rate Stok:\n🟢 100+ | 🟡 50-99 | 🟠 20-49 | 🔴 1-19 | ⚫ 0`
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Pilih Negara",
                                    sections: [{ title: "Daftar Negara", rows }]
                                })
                            }]
                        }
                    }
                }
            }
        }, { userJid: m.sender, quoted: m });

        await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (err) {
        console.error(err);
        m.reply("❌ Gagal memuat negara.");
    }
}
break;

//###############################//
// 📄 PAGINATION NEGARA
//###############################//
case "negara_page_nokos": {
    const isPrivate = !m.isGroup;
    const nokosSettings = global.db.settings.nokos;
    
    if (isPrivate && !nokosSettings.enablePrivate) {
        return m.reply("❌ Fitur Nokos dimatikan untuk chat pribadi.");
    }
    
    if (m.isGroup && !nokosSettings.enableGroup) {
        return m.reply("❌ Fitur Nokos dimatikan untuk group.");
    }
    const serviceId = args[0];
    const page = parseInt(args[1]) || 1;

    const countries = global.cachedCountriesNokos[serviceId];
    if (!countries || countries.length === 0) {
        return m.reply("❌ Data negara tidak ditemukan. Silakan mulai dari awal.");
    }

    let serviceName = "Layanan";
    if (global.cachedServicesNokos) {
        const s = global.cachedServicesNokos.find(a => a.service_code == serviceId);
        if (s) serviceName = s.service_name;
    }

    const perPage = 20;
    const totalPages = Math.ceil(countries.length / perPage);
    
    if (page < 1 || page > totalPages) {
        return m.reply(`❌ Halaman tidak valid. Total: ${totalPages}`);
    }

    const start = (page - 1) * perPage;
    const list = countries.slice(start, start + perPage);

    function getStockRate(stock) {
        if (stock >= 100) return "🟢";
        if (stock >= 50) return "🟡";
        if (stock >= 20) return "🟠";
        if (stock >= 1) return "🔴";
        return "⚫";
    }

    const rows = list.map(c => {
        const rate = getStockRate(c.stock_total);
        return {
            title: `${c.name} (${c.prefix})`,
            description: `Stok: ${c.stock_total} ${rate}`,
            id: `.pilih_harga_nokos ${serviceId} ${c.iso_code} ${c.number_id}`
        };
    });

    if (page > 1) {
        rows.push({
            title: "⬅️ Halaman Sebelumnya",
            description: `Hal ${page - 1}`,
            id: `.negara_page_nokos ${serviceId} ${page - 1}`
        });
    }
    if (page < totalPages) {
        rows.push({
            title: "➡️ Halaman Berikutnya",
            description: `Hal ${page + 1}`,
            id: `.negara_page_nokos ${serviceId} ${page + 1}`
        });
    }

    rows.push({
        title: "⬅️ Kembali",
        description: "Pilih layanan",
        id: ".pilih_layanan_nokos"
    });

    let msg = await generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { 
                        text: `🌍 *Pilih Negara*\n\nLayanan: *${serviceName}*\nTotal: *${countries.length}*\nHalaman: ${page}/${totalPages}\n\n📊 Rate Stok:\n🟢 100+ | 🟡 50-99 | 🟠 20-49 | 🔴 1-19 | ⚫ 0`
                    },
                    nativeFlowMessage: {
                        buttons: [{
                            name: "single_select",
                            buttonParamsJson: JSON.stringify({
                                title: "Pilih Negara",
                                sections: [{ title: "Daftar Negara", rows }]
                            })
                        }]
                    }
                }
            }
        }
    }, { userJid: m.sender, quoted: m });

    await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}
break;

//###############################//
// 💰 STEP 3: PILIH HARGA
//###############################//
case "pilih_harga_nokos": {
   const isPrivate = !m.isGroup;
    const nokosSettings = global.db.settings.nokos;
    
    if (isPrivate && !nokosSettings.enablePrivate) {
        return m.reply("❌ Fitur Nokos dimatikan untuk chat pribadi.");
    }
    
    if (m.isGroup && !nokosSettings.enableGroup) {
        return m.reply("❌ Fitur Nokos dimatikan untuk group.");
    }
    const serviceId = args[0];
    const isoCode = args[1];
    const numberId = args[2];

    if (!serviceId || !isoCode || !numberId) {
        return m.reply("❌ Data tidak lengkap!");
    }

    const axios = require("axios");
    const API_KEY = global.apiRumahOTP;
    const UNTUNG = global.UNTUNG_NOKOS || 0;

    await m.reply("⏳ Memuat harga...");

    try {
        let negara = null;

        if (global.cachedCountriesNokos && global.cachedCountriesNokos[serviceId]) {
            negara = global.cachedCountriesNokos[serviceId].find(
                c => String(c.number_id) === String(numberId)
            );
        }

        if (!negara) {
            const res = await axios.get(
                `https://www.rumahotp.com/api/v2/countries?service_id=${serviceId}`,
                { headers: { "x-apikey": API_KEY } }
            );
            negara = (res.data?.data || []).find(
                c => String(c.number_id) === String(numberId)
            );
        }

        if (!negara) {
            return m.reply(`❌ Negara ${isoCode.toUpperCase()} tidak ditemukan.`);
        }

        const providers = (negara.pricelist || [])
            .filter(p => p.available && p.stock > 0)
            .map(p => {
                const base = Number(p.price) || 0;
                const hargaFinal = base + UNTUNG;
                
                let rateIcon = "⚫";
                if (p.stock >= 50) rateIcon = "🟢";
                else if (p.stock >= 20) rateIcon = "🟡";
                else if (p.stock >= 5) rateIcon = "🟠";
                else if (p.stock >= 1) rateIcon = "🔴";
                
                return {
                    ...p,
                    price: hargaFinal,
                    price_format: `Rp${hargaFinal.toLocaleString("id-ID")}`,
                    rateIcon
                };
            })
            .sort((a, b) => a.price - b.price);

        if (providers.length === 0) {
            return m.reply(`⚠️ Tidak ada stok untuk negara *${negara.name}*.`);
        }

        let serviceName = "Layanan";
        if (global.cachedServicesNokos) {
            const s = global.cachedServicesNokos.find(a => a.service_code == serviceId);
            if (s) serviceName = s.service_name;
        }

        const rows = providers.map(p => ({
            title: `${p.price_format} | Stok: ${p.stock}`,
            description: `${p.rateIcon} Provider ${p.provider_id}`,
            id: `.pilih_operator_nokos ${numberId} ${p.provider_id} ${serviceId} ${isoCode}`
        }));

        rows.push({
            title: "⬅️ Kembali",
            description: "Pilih negara lagi",
            id: `.pilih_negara_nokos ${serviceId}`
        });

        let msg = await generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { 
                            text: `💰 *Pilih Harga*\n\nNegara: *${negara.name}*\nLayanan: *${serviceName}*\nTotal stok: *${negara.stock_total}*\n\n_Harga termurah ke termahal_`
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Pilih Harga",
                                    sections: [{ title: "Daftar Harga", rows }]
                                })
                            }]
                        }
                    }
                }
            }
        }, { userJid: m.sender, quoted: m });

        await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (err) {
        console.error(err);
        m.reply("❌ Gagal memuat harga.");
    }
}
break;

//###############################//
// 📡 STEP 4: PILIH OPERATOR
//###############################//
case "pilih_operator_nokos": {
    const isPrivate = !m.isGroup;
    const nokosSettings = global.db.settings.nokos;
    
    if (isPrivate && !nokosSettings.enablePrivate) {
        return m.reply("❌ Fitur Nokos dimatikan untuk chat pribadi.");
    }
    
    if (m.isGroup && !nokosSettings.enableGroup) {
        return m.reply("❌ Fitur Nokos dimatikan untuk group.");
    }
    const numberId = args[0];
    const providerId = args[1];
    const serviceId = args[2];
    const isoCode = args[3];

    if (!numberId || !providerId || !serviceId || !isoCode) {
        return m.reply("❌ Data tidak lengkap!");
    }

    const axios = require("axios");
    const API_KEY = global.apiRumahOTP;
    const UNTUNG = global.UNTUNG_NOKOS || 0;

    await m.reply("⏳ Memuat operator...");

    try {
        let negara = null;
        if (global.cachedCountriesNokos && global.cachedCountriesNokos[serviceId]) {
            negara = global.cachedCountriesNokos[serviceId].find(
                c => c.iso_code.toLowerCase() === isoCode.toLowerCase()
            );
        }

        if (!negara) {
            return m.reply("❌ Data negara tidak ditemukan.");
        }

        const providerData = negara.pricelist.find(
            p => String(p.provider_id) === String(providerId)
        );

        if (!providerData) {
            return m.reply("❌ Provider tidak ditemukan.");
        }

        const ops = await axios.get(
            `https://www.rumahotp.com/api/v2/operators?country=${encodeURIComponent(negara.name)}&provider_id=${providerId}`,
            { headers: { "x-apikey": API_KEY } }
        );

        const operators = ops.data?.data || [];
        
        if (operators.length === 0) {
            return m.reply("❌ Tidak ada operator tersedia.");
        }

        let serviceName = "Layanan";
        if (global.cachedServicesNokos) {
            const s = global.cachedServicesNokos.find(a => a.service_code == serviceId);
            if (s) serviceName = s.service_name;
        }

        const hargaBase = Number(providerData.price) || 0;
        const hargaFinal = hargaBase + UNTUNG;
        const priceFormat = `Rp${hargaFinal.toLocaleString("id-ID")}`;

        const rows = operators.map(op => ({
            title: `📶 ${op.name}`,
            description: `${priceFormat} | Stok: ${providerData.stock}`,
            id: `.konfirmasi_order_nokos ${numberId} ${providerId} ${serviceId} ${op.id} ${isoCode}`
        }));

        rows.push({
            title: "⬅️ Kembali",
            description: "Pilih harga lagi",
            id: `.pilih_harga_nokos ${serviceId} ${isoCode} ${numberId}`
        });

        let msg = await generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { 
                            text: `📶 *Pilih Operator*\n\nLayanan: *${serviceName}*\nNegara: *${negara.name}*\nHarga: *${priceFormat}*`
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Pilih Operator",
                                    sections: [{ title: "Daftar Operator", rows }]
                                })
                            }]
                        }
                    }
                }
            }
        }, { userJid: m.sender, quoted: m });

        await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (err) {
        console.error(err);
        m.reply("❌ Gagal memuat operator.");
    }
}
break;

//###############################//
// ✅ STEP 5: KONFIRMASI ORDER
//###############################//
case "konfirmasi_order_nokos": {
const isPrivate = !m.isGroup;
    const nokosSettings = global.db.settings.nokos;
    
    if (isPrivate && !nokosSettings.enablePrivate) {
        return m.reply("❌ Fitur Nokos dimatikan untuk chat pribadi.");
    }
    
    if (m.isGroup && !nokosSettings.enableGroup) {
        return m.reply("❌ Fitur Nokos dimatikan untuk group.");
    }
    const numberId = args[0];
    const providerId = args[1];
    const serviceId = args[2];
    const operatorId = args[3];
    const isoCode = args[4];

    if (!numberId || !providerId || !serviceId || !operatorId || !isoCode) {
        return m.reply("❌ Data tidak lengkap!");
    }

    const axios = require("axios");
    const API_KEY = global.apiRumahOTP;
    const UNTUNG = global.UNTUNG_NOKOS || 0;

    try {
        let serviceName = "Layanan";
        if (global.cachedServicesNokos) {
            const s = global.cachedServicesNokos.find(a => a.service_code == serviceId);
            if (s) serviceName = s.service_name;
        }

        let negara = null;
        if (global.cachedCountriesNokos && global.cachedCountriesNokos[serviceId]) {
            negara = global.cachedCountriesNokos[serviceId].find(
                c => c.iso_code.toLowerCase() === isoCode.toLowerCase()
            );
        }

        if (!negara) {
            return m.reply("❌ Data negara tidak ditemukan.");
        }

        const providerData = negara.pricelist.find(
            p => String(p.provider_id) === String(providerId)
        );

        if (!providerData) {
            return m.reply("❌ Provider tidak ditemukan.");
        }

        const hargaFinal = (Number(providerData.price) || 0) + UNTUNG;
        const priceFormat = `Rp${hargaFinal.toLocaleString("id-ID")}`;

        const ops = await axios.get(
            `https://www.rumahotp.com/api/v2/operators?country=${encodeURIComponent(negara.name)}&provider_id=${providerId}`,
            { headers: { "x-apikey": API_KEY } }
        );

        const operator = (ops.data?.data || []).find(
            o => String(o.id) === String(operatorId)
        );

        if (!operator) {
            return m.reply("❌ Operator tidak ditemukan.");
        }

        if (!global.lastNokosData) global.lastNokosData = {};
        global.lastNokosData[m.sender] = {
            numberId,
            providerId,
            serviceId,
            operatorId,
            isoCode,
            serviceName,
            negaraName: negara.name,
            operatorName: operator.name,
            hargaFinal,
            priceFormat,
            providerStock: providerData.stock
        };

        const caption = `
📱 *KONFIRMASI PESANAN*

╭─📦 *Detail Order*
│ 🌐 Layanan: ${serviceName}
│ 🌍 Negara: ${negara.name}
│ 📶 Operator: ${operator.name}
│ 💰 Harga: ${priceFormat}
│ 📦 Stok: ${providerData.stock}
╰────────────

⚠️ *Pastikan data sudah benar sebelum melanjutkan!*
`;

        let msg = await generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: caption },
                        nativeFlowMessage: {
                            buttons: [
                                {
                                    name: "quick_reply",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "✅ Pesan Sekarang",
                                        id: ".proses_order_nokos"
                                    })
                                },
                                {
                                    name: "quick_reply",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "⬅️ Kembali",
                                        id: `.pilih_operator_nokos ${numberId} ${providerId} ${serviceId} ${isoCode}`
                                    })
                                }
                            ]
                        }
                    }
                }
            }
        }, { userJid: m.sender, quoted: m });

        await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (err) {
        console.error(err);
        m.reply("❌ Gagal memuat konfirmasi.");
    }
}
break;

//###############################//
// 🛒 STEP 6: PROSES ORDER + REAL-TIME CHECK
//###############################//
case "proses_order_nokos": {
    const isPrivate = !m.isGroup;
    const nokosSettings = global.db.settings.nokos;
    
    if (isPrivate && !nokosSettings.enablePrivate) {
        return m.reply("❌ Fitur Nokos dimatikan untuk chat pribadi.");
    }
    
    if (m.isGroup && !nokosSettings.enableGroup) {
        return m.reply("❌ Fitur Nokos dimatikan untuk group.");
    }

    const data = global.lastNokosData?.[m.sender];
    
    if (!data) {
        return m.reply("❌ Data order tidak ditemukan. Silakan mulai dari awal dengan ketik *.nokos*");
    }

    const fs = require("fs");
    const axios = require("axios");
    const API_KEY = global.apiRumahOTP;
    
    const dbDir = "./database";
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    
    const saldoPath = "./database/saldoOtp.json";
    const nokosPath = "./database/nokosData.json";
    
    if (!fs.existsSync(saldoPath)) fs.writeFileSync(saldoPath, JSON.stringify({}));
    if (!fs.existsSync(nokosPath)) fs.writeFileSync(nokosPath, JSON.stringify([]));

    const userId = m.sender.split("@")[0];
    const userName = m.pushName || "User";

    await m.reply("⏳ Memproses pesanan...");

    try {
        let saldoData = JSON.parse(fs.readFileSync(saldoPath));
        const userSaldo = saldoData[userId] || 0;

        if (userSaldo < data.hargaFinal) {
            return m.reply(
                `❌ *SALDO TIDAK CUKUP!*\n\n` +
                `💰 Saldo kamu: Rp${userSaldo.toLocaleString("id-ID")}\n` +
                `💳 Harga: ${data.priceFormat}\n` +
                `📉 Kurang: Rp${(data.hargaFinal - userSaldo).toLocaleString("id-ID")}\n\n` +
                `Silakan topup:\n.topup_nokos ${data.hargaFinal - userSaldo + 1000}`
            );
        }

        saldoData[userId] = userSaldo - data.hargaFinal;
        fs.writeFileSync(saldoPath, JSON.stringify(saldoData, null, 2));

        await m.reply("✅ Saldo cukup! Memproses pemesanan nomor...");

        const resOrder = await axios.get(
            `https://www.rumahotp.com/api/v2/orders?number_id=${data.numberId}&provider_id=${data.providerId}&operator_id=${data.operatorId}`,
            { headers: { "x-apikey": API_KEY, Accept: "application/json" } }
        );

        const dataOrder = resOrder.data?.data;
        
        if (!dataOrder || !resOrder.data?.success) {
            saldoData[userId] = userSaldo;
            fs.writeFileSync(saldoPath, JSON.stringify(saldoData, null, 2));
            return m.reply("❌ Order gagal, saldo dikembalikan otomatis.");
        }

        const caption = `
✅ *PESANAN BERHASIL DIBUAT*

╭─📱 *Detail Pesanan*
│ 🌐 Layanan: ${dataOrder.service}
│ 🌍 Negara: ${dataOrder.country}
│ 📶 Operator: ${dataOrder.operator}
│ 
│ 🆔 Order ID: \`${dataOrder.order_id}\`
│ 📞 Nomor: \`${dataOrder.phone_number}\`
│ 💰 Harga: ${data.priceFormat}
│ 
│ 📊 Status: Menunggu OTP
│ 📩 SMS Code: -
│ ⏳ Expired: ${dataOrder.expires_in_minute} menit
╰────────────

💳 Saldo dikurangi: ${data.priceFormat}
💰 Sisa Saldo: Rp${saldoData[userId].toLocaleString("id-ID")}

🚀 Bot cek SMS otomatis setiap 2 detik!
⚡ Notifikasi langsung jika OTP masuk!
`;

        let msg = await generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: caption },
                        nativeFlowMessage: {
                            buttons: [
                                {
                                    name: "quick_reply",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "📩 Cek SMS Manual",
                                        id: `.ceksms_nokos ${dataOrder.order_id}`
                                    })
                                },
                                {
                                    name: "quick_reply",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "❌ Batalkan",
                                        id: `.cancel_order_nokos ${dataOrder.order_id}`
                                    })
                                }
                            ]
                        }
                    }
                }
            }
        }, { userJid: m.sender, quoted: m });

        await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

        if (!global.activeOrdersNokos) global.activeOrdersNokos = {};
        global.activeOrdersNokos[dataOrder.order_id] = {
            userId,
            userName,
            hargaTotal: data.hargaFinal,
            createdAt: Date.now(),
            operator: dataOrder.operator,
            service: dataOrder.service,
            country: dataOrder.country,
            phoneNumber: dataOrder.phone_number,
            expiresIn: dataOrder.expires_in_minute,
            chatId: m.chat
        };

        const checkIntervalTime = nokosSettings.autoCheckInterval || 2000;
        let checkCount = 0;
        const maxChecks = (dataOrder.expires_in_minute * 60 * 1000) / checkIntervalTime;
        let notifSent = false;

        const checkInterval = setInterval(async () => {
            checkCount++;
            
            try {
                const resCheck = await axios.get(
                    `https://www.rumahotp.com/api/v1/orders/get_status?order_id=${dataOrder.order_id}`,
                    { headers: { "x-apikey": API_KEY } }
                );

                const d = resCheck.data?.data;
                
                if (!d || !global.activeOrdersNokos[dataOrder.order_id]) {
                    clearInterval(checkInterval);
                    return;
                }

                const otp = d.otp_code && d.otp_code !== "-" ? d.otp_code : null;

                if (otp && !notifSent) {
                    notifSent = true;
                    clearInterval(checkInterval);
                    
                    const now = new Date();
                    const tanggal = now.toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    });

                    const trxData = {
                        customerName: userName,
                        customerId: userId,
                        service: d.service,
                        country: d.country,
                        operator: dataOrder.operator,
                        number: d.phone_number,
                        otp: otp,
                        price: `Rp${data.hargaFinal.toLocaleString("id-ID")}`,
                        orderId: d.order_id,
                        date: tanggal,
                        chatType: m.isGroup ? "group" : "private"
                    };

                    let db = JSON.parse(fs.readFileSync(nokosPath, "utf-8"));
                    db.push(trxData);
                    fs.writeFileSync(nokosPath, JSON.stringify(db, null, 2));

                    delete global.activeOrdersNokos[dataOrder.order_id];

                    const notifText = `
🎉 *OTP BERHASIL DITERIMA!*

╭─📱 *Detail Lengkap*
│ 🌐 Layanan: ${trxData.service}
│ 🌍 Negara: ${trxData.country}
│ 📶 Operator: ${trxData.operator}
│ 
│ 🆔 Order ID: \`${trxData.orderId}\`
│ 📞 Nomor: \`${trxData.number}\`
│ 🔐 Kode OTP: \`${trxData.otp}\`
│ 💰 Harga: ${trxData.price}
│ 
│ 📅 Tanggal: ${trxData.date}
│ 🟢 Status: Selesai
╰────────────

⚡ *Auto Check dalam ${checkCount * (checkIntervalTime/1000)} detik!*
✅ SMS masuk otomatis
✅ Refund otomatis jika gagal
`;

                    await sock.sendMessage(m.chat, { text: notifText }, { quoted: m });

                    setTimeout(async () => {
                        let msgRating = await generateWAMessageFromContent(m.chat, {
                            viewOnceMessage: {
                                message: {
                                    interactiveMessage: {
                                        body: { text: "⭐ *Beri Rating Layanan*\n\nBagaimana pengalaman kamu?" },
                                        nativeFlowMessage: {
                                            buttons: [{
                                                name: "single_select",
                                                buttonParamsJson: JSON.stringify({
                                                    title: "Pilih Rating",
                                                    sections: [{
                                                        title: "Rating",
                                                        rows: [
                                                            { title: "⭐ 1 - Sangat buruk", id: `.rate_nokos ${dataOrder.order_id} 1` },
                                                            { title: "⭐⭐ 2 - Buruk", id: `.rate_nokos ${dataOrder.order_id} 2` },
                                                            { title: "⭐⭐⭐ 3 - Cukup", id: `.rate_nokos ${dataOrder.order_id} 3` },
                                                            { title: "⭐⭐⭐⭐ 4 - Bagus", id: `.rate_nokos ${dataOrder.order_id} 4` },
                                                            { title: "⭐⭐⭐⭐⭐ 5 - Sangat bagus", id: `.rate_nokos ${dataOrder.order_id} 5` }
                                                        ]
                                                    }]
                                                })
                                            }]
                                        }
                                    }
                                }
                            }
                        }, { userJid: m.sender, quoted: m });

                        await sock.relayMessage(m.chat, msgRating.message, { messageId: msgRating.key.id });
                    }, 2000);

                    if (global.owner) {
                        await sock.sendMessage(global.owner + "@s.whatsapp.net", {
                            text: `📢 *Transaksi Baru Nokos*\n\n${notifText}\n\n👤 Pembeli: ${userName}\n🆔 ID: \`${userId}\``
                        });
                    }
                }

                if (checkCount >= maxChecks) {
                    clearInterval(checkInterval);
                }

            } catch (err) {
                console.error("Check interval error:", err.message);
            }
        }, checkIntervalTime);

        setTimeout(async () => {
            const orderInfo = global.activeOrdersNokos?.[dataOrder.order_id];
            if (!orderInfo) return;

            try {
                const resCheck = await axios.get(
                    `https://www.rumahotp.com/api/v1/orders/get_status?order_id=${dataOrder.order_id}`,
                    { headers: { "x-apikey": API_KEY } }
                );

                const d = resCheck.data?.data;
                const otp = d?.otp_code && d.otp_code !== "-" ? d.otp_code : null;
                
                if (otp) return;

                await axios.get(
                    `https://www.rumahotp.com/api/v1/orders/set_status?order_id=${dataOrder.order_id}&status=cancel`,
                    { headers: { "x-apikey": API_KEY } }
                );

                const saldoData2 = JSON.parse(fs.readFileSync(saldoPath, "utf-8"));
                saldoData2[userId] = (saldoData2[userId] || 0) + orderInfo.hargaTotal;
                fs.writeFileSync(saldoPath, JSON.stringify(saldoData2, null, 2));

                await sock.sendMessage(
                    orderInfo.chatId,
                    {
                        text:
                            `⛔ *AUTO REFUND - ORDER EXPIRED*\n\n` +
                            `🆔 Order ID: \`${dataOrder.order_id}\`\n` +
                            `📱 Layanan: ${orderInfo.service}\n` +
                            `🌍 Negara: ${orderInfo.country}\n\n` +
                            `💸 Refund: Rp${orderInfo.hargaTotal.toLocaleString("id-ID")}\n` +
                            `💰 Saldo sekarang: Rp${saldoData2[userId].toLocaleString("id-ID")}\n\n` +
                            `✅ Saldo sudah dikembalikan otomatis!`
                    }
                );

                delete global.activeOrdersNokos[dataOrder.order_id];
                clearInterval(checkInterval);
            } catch (err) {
                console.error("Auto cancel error:", err.message);
            }
        }, dataOrder.expires_in_minute * 60 * 1000);

    } catch (err) {
        console.error(err);
        
        try {
            const saldoData = JSON.parse(fs.readFileSync(saldoPath, "utf-8"));
            saldoData[userId] = (saldoData[userId] || 0) + data.hargaFinal;
            fs.writeFileSync(saldoPath, JSON.stringify(saldoData, null, 2));

            m.reply(
                `❌ Gagal memesan nomor: ${err.message}\n\n` +
                `✅ Saldo dikembalikan: Rp${saldoData[userId].toLocaleString("id-ID")}`
            );
        } catch (refundErr) {
            m.reply(`❌ Terjadi kesalahan: ${err.message}`);
        }
    }
}
break;

//###############################//
// 📩 CEK SMS/OTP MANUAL
//###############################//
case "ceksms_nokos": {
   const isPrivate = !m.isGroup;
    const nokosSettings = global.db.settings.nokos;
    
    if (isPrivate && !nokosSettings.enablePrivate) {
        return m.reply("❌ Fitur Nokos dimatikan untuk chat pribadi.");
    }
    
    if (m.isGroup && !nokosSettings.enableGroup) {
        return m.reply("❌ Fitur Nokos dimatikan untuk group.");
    }
    const orderId = args[0];
    
    if (!orderId) {
        return m.reply("❌ Order ID tidak valid!");
    }

    const axios = require("axios");
    const API_KEY = global.apiRumahOTP;

    if (!global.activeOrdersNokos?.[orderId]) {
        return m.reply(`⚠️ Order ID \`${orderId}\` tidak ditemukan atau sudah selesai.`);
    }

    const cachedOrder = global.activeOrdersNokos[orderId];

    await m.reply("💡 Mengecek status SMS OTP...");

    try {
        const res = await axios.get(
            `https://www.rumahotp.com/api/v1/orders/get_status?order_id=${orderId}`,
            { headers: { "x-apikey": API_KEY, Accept: "application/json" } }
        );

        const d = res.data?.data;
        if (!d) return m.reply("❌ Tidak ada data dari server.");

        const otp = d.otp_code && d.otp_code !== "-" ? d.otp_code : "Belum masuk";

        const statusText = `
📩 *STATUS PESANAN*

╭─📱 *Detail*
│ 🌐 Layanan: ${d.service}
│ 🌍 Negara: ${d.country}
│ 📶 Operator: ${cachedOrder.operator}
│ 
│ 🆔 Order ID: \`${d.order_id}\`
│ 📞 Nomor: \`${d.phone_number}\`
│ 💰 Harga: Rp${cachedOrder.hargaTotal.toLocaleString("id-ID")}
│ 
│ 📊 Status: ${d.status}
│ 📩 SMS Code: \`${otp}\`
╰────────────

${otp === "Belum masuk" ? "⏳ SMS belum masuk, coba cek lagi sebentar lagi..." : "✅ Kode OTP sudah masuk!"}
`;

        let msg = await generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: statusText },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "quick_reply",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "🔄 Cek Ulang",
                                    id: `.ceksms_nokos ${orderId}`
                                })
                            }]
                        }
                    }
                }
            }
        }, { userJid: m.sender, quoted: m });

        return sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (err) {
        console.error(err);
        m.reply("❌ Terjadi kesalahan saat cek OTP.");
    }
}
break;

//###############################//
// ⭐ RATING NOKOS
//###############################//
case "rate_nokos": {
   const isPrivate = !m.isGroup;
    const nokosSettings = global.db.settings.nokos;
    
    if (isPrivate && !nokosSettings.enablePrivate) {
        return m.reply("❌ Fitur Nokos dimatikan untuk chat pribadi.");
    }
    
    if (m.isGroup && !nokosSettings.enableGroup) {
        return m.reply("❌ Fitur Nokos dimatikan untuk group.");
    }
    const orderId = args[0];
    const rating = parseInt(args[1]);

    if (!orderId || isNaN(rating) || rating < 1 || rating > 5) {
        return m.reply("❌ Rating tidak valid!");
    }

    const fs = require("fs");
    const ratingPath = "./database/nokosRating.json";
    
    const dbDir = "./database";
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    if (!fs.existsSync(ratingPath)) fs.writeFileSync(ratingPath, JSON.stringify([]));

    const userId = m.sender.split("@")[0];
    const userName = m.pushName || "User";

    const ratingData = {
        orderId,
        userId,
        userName,
        rating,
        date: new Date().toISOString()
    };

    let ratings = JSON.parse(fs.readFileSync(ratingPath));
    ratings.push(ratingData);
    fs.writeFileSync(ratingPath, JSON.stringify(ratings, null, 2));

    const stars = "⭐".repeat(rating);
    
    await m.reply(
        `${stars}\n\n` +
        `Terima kasih atas rating kamu!\n` +
        `Rating: ${rating}/5\n\n` +
        `Feedback kamu sangat berarti untuk kami! 🙏`
    );

    // Notif ke owner
    if (global.owner) {
        await sock.sendMessage(global.owner + "@s.whatsapp.net", {
            text: `⭐ *Rating Baru*\n\nOrder ID: ${orderId}\nUser: ${userName}\nRating: ${rating}/5`
        });
    }
}
break;

//###############################//
// ❌ CANCEL ORDER
//###############################//
case "cancel_order_nokos": {
  const isPrivate = !m.isGroup;
    const nokosSettings = global.db.settings.nokos;
    
    if (isPrivate && !nokosSettings.enablePrivate) {
        return m.reply("❌ Fitur Nokos dimatikan untuk chat pribadi.");
    }
    
    if (m.isGroup && !nokosSettings.enableGroup) {
        return m.reply("❌ Fitur Nokos dimatikan untuk group.");
    }
    const orderId = args[0];
    
    if (!orderId) return m.reply("❌ Order ID tidak valid!");

    const axios = require("axios");
    const fs = require("fs");
    const API_KEY = global.apiRumahOTP;
    const saldoPath = "./database/saldoOtp.json";

    const orderInfo = global.activeOrdersNokos?.[orderId];
    if (!orderInfo) {
        return m.reply("⚠️ Order tidak ditemukan atau sudah selesai.");
    }

    const userId = m.sender.split("@")[0];

    // Cooldown 5 menit
    const cooldown = 5 * 60 * 1000;
    const cancelableAt = orderInfo.createdAt + cooldown;
    const now = Date.now();

    if (now < cancelableAt) {
        const sisaDetik = Math.ceil((cancelableAt - now) / 1000);
        const sisaMenit = Math.floor(sisaDetik / 60);
        const sisaDetikSisa = sisaDetik % 60;

        return m.reply(
            `❌ Kamu belum bisa cancel pesanan ini.\n\n` +
            `🆔 Order ID: \`${orderId}\`\n` +
            `⏰ Tunggu: ${sisaMenit}m ${sisaDetikSisa}d lagi\n\n` +
            `Cooldown 5 menit untuk menghindari spam.`
        );
    }

    await m.reply("🗑️ Membatalkan pesanan...");

    try {
        const res = await axios.get(
            `https://www.rumahotp.com/api/v1/orders/set_status?order_id=${orderId}&status=cancel`,
            { headers: { "x-apikey": API_KEY } }
        );

        if (res.data?.success) {
            // Refund saldo
            const saldoData = JSON.parse(fs.readFileSync(saldoPath, "utf-8"));
            saldoData[userId] = (saldoData[userId] || 0) + orderInfo.hargaTotal;
            fs.writeFileSync(saldoPath, JSON.stringify(saldoData, null, 2));

            await m.reply(
                `✅ *Pesanan Dibatalkan!*\n\n` +
                `🆔 Order ID: \`${orderId}\`\n` +
                `💸 Refund: Rp${orderInfo.hargaTotal.toLocaleString("id-ID")}\n` +
                `💰 Saldo sekarang: Rp${saldoData[userId].toLocaleString("id-ID")}\n\n` +
                `✅ Saldo sudah dikembalikan!`
            );

            delete global.activeOrdersNokos[orderId];
        } else {
            m.reply("⚠️ Gagal membatalkan! Mungkin sudah expired atau completed.");
        }
    } catch (err) {
        console.error(err);
        m.reply("❌ Terjadi kesalahan saat membatalkan.");
    }
}
break;

//###############################//
// 💰 TOPUP SALDO (QRIS AUTO)
//###############################//
case "topup_nokos": {
    const isPrivate = !m.isGroup;
    const nokosSettings = global.db.settings.nokos;
    
    if (isPrivate && !nokosSettings.enablePrivate) {
        return m.reply("❌ Fitur Nokos dimatikan untuk chat pribadi.");
    }
    
    if (m.isGroup && !nokosSettings.enableGroup) {
        return m.reply("❌ Fitur Nokos dimatikan untuk group.");
    }
    const fs = require("fs");
    const axios = require("axios");
    const API_KEY = global.apiRumahOTP;
    const UNTUNG = global.UNTUNG_DEPOSIT || 0;
    const BASE_URL = "https://www.rumahotp.com/api/v2/deposit/create";
    const STATUS_URL = "https://www.rumahotp.com/api/v2/deposit/get_status";
    const CANCEL_URL = "https://www.rumahotp.com/api/v1/deposit/cancel";
    const PAYMENT_ID = "qris";
    
    const dbDir = "./database";
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    
    const pendingPath = "./database/depositPending.json";
    const saldoPath = "./database/saldoOtp.json";
    const depositPath = "./database/deposit.json";

    if (!API_KEY) return m.reply("❌ API Key RumahOTP belum diset!");

    // Jika ada argumen langsung
    if (args[0]) {
        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount < 2000) {
            return m.reply("🚫 Minimal deposit Rp 2.000!\n\nContoh: .topup_nokos 5000");
        }
        return processDeposit(amount);
    }

    // Set state untuk menunggu input
    if (!global.topupState) global.topupState = {};
    
    global.topupState[m.sender] = {
        waiting: true,
        timestamp: Date.now()
    };

    await m.reply(
        "💳 *TOP UP SALDO NOKOS*\n\n" +
        "Masukkan nominal deposit (min Rp 2.000)\n" +
        "Contoh: `5000` atau `10000`\n\n" +
        "⏱️ Timeout: 60 detik\n" +
        "Ketik *batal* untuk membatalkan"
    );

    // Set timeout
    setTimeout(() => {
        if (global.topupState[m.sender]?.waiting) {
            delete global.topupState[m.sender];
            m.reply("⏱️ Waktu habis. Ketik .topup_nokos untuk coba lagi.");
        }
    }, 60000);

    async function processDeposit(amount) {
        await m.reply("🔄 Membuat QRIS...");

        try {
            if (!fs.existsSync(pendingPath)) fs.writeFileSync(pendingPath, JSON.stringify({}));
            if (!fs.existsSync(saldoPath)) fs.writeFileSync(saldoPath, JSON.stringify({}));
            if (!fs.existsSync(depositPath)) fs.writeFileSync(depositPath, JSON.stringify([]));

            const pendingData = JSON.parse(fs.readFileSync(pendingPath));
            const userId = m.sender.split("@")[0];

            if (!pendingData[userId]) pendingData[userId] = [];
            pendingData[userId] = pendingData[userId].filter(d => Date.now() < d.expired_at_ts);

            if (pendingData[userId].length > 0) {
                return m.reply("🚫 Kamu masih punya QRIS aktif! Selesaikan dulu atau tunggu expired.");
            }

            const totalRequest = amount + UNTUNG;

            const response = await axios.get(
                `${BASE_URL}?amount=${totalRequest}&payment_id=${PAYMENT_ID}`,
                { headers: { "x-apikey": API_KEY } }
            );

            const data = response.data;
            if (!data.success) return m.reply("❌ Gagal membuat QRIS.");

            const d = data.data;
            const diterima = amount;
            const totalBaru = d.total;
            const feeAkhir = totalBaru - diterima;

            const waktuBuat = new Date(d.created_at_ts).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
            const waktuExp = new Date(d.expired_at_ts).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

            const caption = `
🧾 *PEMBAYARAN DEPOSIT*

╭─💳 *Detail Pembayaran*
│ 🆔 ID: \`${d.id}\`
│ 💰 Total Bayar: Rp${totalBaru.toLocaleString("id-ID")}
│ 💸 Fee: Rp${feeAkhir.toLocaleString("id-ID")}
│ 📥 Saldo Dapat: Rp${diterima.toLocaleString("id-ID")}
│ 
│ 🕒 Dibuat: ${waktuBuat}
│ ⏳ Expired: ${waktuExp}
╰────────────

📸 Scan QRIS di atas untuk bayar!
🔄 Auto cek pembayaran setiap 3 detik
✅ Saldo otomatis masuk setelah bayar
`;

            await sock.sendMessage(
                m.chat,
                {
                    image: { url: d.qr_image },
                    caption,
                    footer: "Powered by RumahOTP"
                },
                { quoted: m }
            );

            let msgCancel = await generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            body: { text: "Tekan tombol jika ingin membatalkan:" },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: "quick_reply",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "❌ Batalkan Deposit",
                                        id: `.batal_deposit_nokos ${d.id}`
                                    })
                                }]
                            }
                        }
                    }
                }
            }, { userJid: m.sender, quoted: m });

            await sock.relayMessage(m.chat, msgCancel.message, { messageId: msgCancel.key.id });

            pendingData[userId].push({
                id: d.id,
                total: totalBaru,
                status: d.status,
                expired_at_ts: d.expired_at_ts
            });
            fs.writeFileSync(pendingPath, JSON.stringify(pendingData, null, 2));

            // Auto check status setiap 3 detik
            const checkInterval = setInterval(async () => {
                try {
                    const checkRes = await axios.get(
                        `${STATUS_URL}?deposit_id=${d.id}`,
                        { headers: { "x-apikey": API_KEY } }
                    );
                    
                    if (checkRes.data.success && checkRes.data.data.status === "success") {
                        clearInterval(checkInterval);
                        clearTimeout(autoCancelTimer);

                        const saldoData = JSON.parse(fs.readFileSync(saldoPath));
                        saldoData[userId] = (saldoData[userId] || 0) + diterima;
                        fs.writeFileSync(saldoPath, JSON.stringify(saldoData, null, 2));

                        const successMsg = `
🎉 *DEPOSIT BERHASIL!*

╭─✅ *Pembayaran Berhasil*
│ 🆔 ID: \`${d.id}\`
│ 💰 Total Bayar: Rp${totalBaru.toLocaleString("id-ID")}
│ 📥 Saldo Dapat: Rp${diterima.toLocaleString("id-ID")}
│ 
│ 💳 Saldo ditambah otomatis!
│ 💰 Total Saldo: Rp${saldoData[userId].toLocaleString("id-ID")}
╰────────────

✅ Saldo sudah bisa digunakan untuk order!
`;

                        await m.reply(successMsg);

                        const depositData = JSON.parse(fs.readFileSync(depositPath));
                        depositData.push({
                            id: d.id,
                            userId,
                            total: totalBaru,
                            diterima,
                            fee: feeAkhir,
                            status: "success",
                            tanggal: new Date().toISOString()
                        });
                        fs.writeFileSync(depositPath, JSON.stringify(depositData, null, 2));

                        const pendingData2 = JSON.parse(fs.readFileSync(pendingPath));
                        if (pendingData2[userId]) {
                            pendingData2[userId] = pendingData2[userId].filter(x => x.id !== d.id);
                            fs.writeFileSync(pendingPath, JSON.stringify(pendingData2, null, 2));
                        }
                    }
                } catch (e) {
                    console.error("Check interval error:", e.message);
                }
            }, 3000); // Check setiap 3 detik

            // Auto cancel 5 menit
            const autoCancelTimer = setTimeout(async () => {
                try {
                    clearInterval(checkInterval);
                    
                    await axios.get(
                        `${CANCEL_URL}?deposit_id=${d.id}`,
                        { headers: { "x-apikey": API_KEY } }
                    );
                    
                    await m.reply(
                        `⏱️ *DEPOSIT EXPIRED*\n\n` +
                        `🆔 ID: \`${d.id}\`\n` +
                        `💰 Nominal: Rp${totalBaru.toLocaleString("id-ID")}\n` +
                        `📛 Status: Cancelled (Auto)\n\n` +
                        `Silakan buat deposit baru jika masih ingin topup.`
                    );

                    const pendingData2 = JSON.parse(fs.readFileSync(pendingPath));
                    if (pendingData2[userId]) {
                        pendingData2[userId] = pendingData2[userId].filter(x => x.id !== d.id);
                        fs.writeFileSync(pendingPath, JSON.stringify(pendingData2, null, 2));
                    }
                } catch (e) {
                    console.error("Auto cancel error:", e.message);
                }
            }, 5 * 60 * 1000);

        } catch (err) {
            console.error(err);
            m.reply("⚠️ Terjadi kesalahan saat membuat QRIS.");
        }
    }
}
break;

//###############################//
// ❌ BATAL DEPOSIT
//###############################//
case "batal_deposit_nokos": {
    const isPrivate = !m.isGroup;
    const nokosSettings = global.db.settings.nokos;
    
    if (isPrivate && !nokosSettings.enablePrivate) {
        return m.reply("❌ Fitur Nokos dimatikan untuk chat pribadi.");
    }
    
    if (m.isGroup && !nokosSettings.enableGroup) {
        return m.reply("❌ Fitur Nokos dimatikan untuk group.");
    }
    const depositId = args[0];
    
    if (!depositId) return m.reply("❌ ID deposit tidak valid!");

    const fs = require("fs");
    const axios = require("axios");
    const API_KEY = global.apiRumahOTP;
    const CANCEL_URL = "https://www.rumahotp.com/api/v1/deposit/cancel";
    const pendingPath = "./database/depositPending.json";
    const depositPath = "./database/deposit.json";

    const userId = m.sender.split("@")[0];

    await m.reply("🗑️ Membatalkan deposit...");

    try {
        const cancelRes = await axios.get(
            `${CANCEL_URL}?deposit_id=${depositId}`,
            { headers: { "x-apikey": API_KEY } }
        );

        if (cancelRes.data.success) {
            const pendingData = JSON.parse(fs.readFileSync(pendingPath));
            
            if (pendingData[userId]) {
                pendingData[userId] = pendingData[userId].filter(x => x.id !== depositId);
                fs.writeFileSync(pendingPath, JSON.stringify(pendingData, null, 2));
            }

            await m.reply(
                `✅ *Deposit Dibatalkan!*\n\n` +
                `🆔 ID: \`${depositId}\`\n` +
                `📛 Status: Cancelled`
            );

            const depositData = JSON.parse(fs.readFileSync(depositPath));
            depositData.push({
                id: depositId,
                userId,
                total: 0,
                status: "cancelled",
                tanggal: new Date().toISOString()
            });
            fs.writeFileSync(depositPath, JSON.stringify(depositData, null, 2));
        } else {
            m.reply("⚠️ Gagal membatalkan! Mungkin sudah dibayar atau expired.");
        }
    } catch (err) {
        console.error(err);
        m.reply("❌ Terjadi kesalahan.");
    }
}
break;

//###############################//
// 💳 CEK SALDO
//###############################//
case "ceksaldo_nokos": {
    const isPrivate = !m.isGroup;
    const nokosSettings = global.db.settings.nokos;
    
    if (isPrivate && !nokosSettings.enablePrivate) {
        return m.reply("❌ Fitur Nokos dimatikan untuk chat pribadi.");
    }
    
    if (m.isGroup && !nokosSettings.enableGroup) {
        return m.reply("❌ Fitur Nokos dimatikan untuk group.");
    }
    const fs = require("fs");
    const dbDir = "./database";
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    
    const saldoFile = "./database/saldoOtp.json";
    if (!fs.existsSync(saldoFile)) fs.writeFileSync(saldoFile, JSON.stringify({}));
    
    const userId = m.sender.split("@")[0];
    const name = m.pushName || "User";

    const saldoData = JSON.parse(fs.readFileSync(saldoFile));
    const saldoUser = saldoData[userId] || 0;

    const caption = `
💳 *SALDO NOKOS*

╭─👤 *Info Akun*
│ 🆔 User ID: \`${userId}\`
│ 👤 Nama: ${name}
│ 💰 Saldo: Rp${saldoUser.toLocaleString("id-ID")}
╰────────────

${saldoUser < 2000 ? "⚠️ Saldo kurang dari Rp 2.000\n" : "✅ Saldo cukup untuk order!\n"}
Ketik *.topup_nokos* untuk isi saldo
Ketik *.nokos* untuk order nomor
`;

    await m.reply(caption);
}
break;

//###############################//
// 🛒 HISTORY ORDER
//###############################//
case "history_nokos": {
    const isPrivate = !m.isGroup;
    const nokosSettings = global.db.settings.nokos;
    
    if (isPrivate && !nokosSettings.enablePrivate) {
        return m.reply("❌ Fitur Nokos dimatikan untuk chat pribadi.");
    }
    
    if (m.isGroup && !nokosSettings.enableGroup) {
        return m.reply("❌ Fitur Nokos dimatikan untuk group.");
    }
    const fs = require("fs");
    const filePath = "./database/nokosData.json";
    const userId = m.sender.split("@")[0];

    if (!fs.existsSync(filePath)) {
        return m.reply("📭 Belum ada riwayat order.\n\nKetik *.nokos* untuk mulai order!");
    }

    const rawData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const userOrders = rawData.filter(item => item.customerId === userId);

    if (userOrders.length === 0) {
        return m.reply("📭 Kamu belum pernah order.\n\nKetik *.nokos* untuk mulai order!");
    }

    let teks = `🛒 *RIWAYAT ORDER NOKOS*\n\nTotal order: ${userOrders.length}\n\n`;

    userOrders.slice(-10).reverse().forEach((order, i) => {
        teks += `╭─ *Order ${i + 1}*\n`;
        teks += `│ 🌐 ${order.service}\n`;
        teks += `│ 🌍 ${order.country}\n`;
        teks += `│ 📞 \`${order.number}\`\n`;
        teks += `│ 🔐 OTP: ${order.otp}\n`;
        teks += `│ 💰 ${order.price}\n`;
        teks += `│ 📅 ${order.date}\n`;
        teks += `╰────────────\n\n`;
    });

    if (userOrders.length > 10) {
        teks += `_Menampilkan 10 order terakhir dari total ${userOrders.length} order_`;
    }

    await m.reply(teks);
}
break;
//###############################//
// ⚙️ SETTING NOKOS (OWNER ONLY)
//###############################//
case "setnokos":
case "nokossetting": {
    if (!isOwner) return m.reply(mess.owner);

    const settings = global.db.settings.nokos;
    
    if (!text) {
        const statusPrivate = settings.enablePrivate ? "✅ ON" : "❌ OFF";
        const statusGroup = settings.enableGroup ? "✅ ON" : "❌ OFF";
        const interval = settings.autoCheckInterval / 1000;

        return m.reply(
            `⚙️ *SETTING NOKOS*\n\n` +
            `╭─📱 *Status Fitur*\n` +
            `│ Private Chat: ${statusPrivate}\n` +
            `│ Group Chat: ${statusGroup}\n` +
            `│ Auto Check: ${interval} detik\n` +
            `╰────────────\n\n` +
            `*Cara Setting:*\n` +
            `.setnokos private on/off\n` +
            `.setnokos group on/off\n` +
            `.setnokos interval 2\n\n` +
            `*Contoh:*\n` +
            `.setnokos private on\n` +
            `.setnokos group off\n` +
            `.setnokos interval 1`
        );
    }

    const args2 = text.toLowerCase().split(" ");
    const target = args2[0];
    const value = args2[1];

    if (target === "private") {
        if (value === "on") {
            settings.enablePrivate = true;
            return m.reply("✅ Nokos untuk *Private Chat* diaktifkan!");
        } else if (value === "off") {
            settings.enablePrivate = false;
            return m.reply("❌ Nokos untuk *Private Chat* dimatikan!");
        } else {
            return m.reply("Format salah! Gunakan: .setnokos private on/off");
        }
    }

    if (target === "group") {
        if (value === "on") {
            settings.enableGroup = true;
            return m.reply("✅ Nokos untuk *Group Chat* diaktifkan!");
        } else if (value === "off") {
            settings.enableGroup = false;
            return m.reply("❌ Nokos untuk *Group Chat* dimatikan!");
        } else {
            return m.reply("Format salah! Gunakan: .setnokos group on/off");
        }
    }

    if (target === "interval") {
        const seconds = parseInt(value);
        if (isNaN(seconds) || seconds < 1 || seconds > 10) {
            return m.reply("❌ Interval harus antara 1-10 detik!\n\nContoh: .setnokos interval 2");
        }
        settings.autoCheckInterval = seconds * 1000;
        return m.reply(`✅ Auto check interval diubah menjadi *${seconds} detik*!`);
    }

    return m.reply(
        "❌ Target tidak valid!\n\n" +
        "Pilihan: private, group, interval\n\n" +
        "Contoh:\n" +
        ".setnokos private on\n" +
        ".setnokos group off\n" +
        ".setnokos interval 2"
    );
}
break;

//###############################//
// 📊 STATUS NOKOS (PUBLIC)
//###############################//
case "statusnokos":
case "infnokos": {
    const settings = global.db.settings.nokos;
    const statusPrivate = settings.enablePrivate ? "🟢 Aktif" : "🔴 Nonaktif";
    const statusGroup = settings.enableGroup ? "🟢 Aktif" : "🔴 Nonaktif";
    const interval = settings.autoCheckInterval / 1000;

    const fs = require("fs");
    const saldoPath = "./database/saldoOtp.json";
    const nokosPath = "./database/nokosData.json";
    
    let totalUsers = 0;
    let totalOrders = 0;
    
    if (fs.existsSync(saldoPath)) {
        const saldoData = JSON.parse(fs.readFileSync(saldoPath));
        totalUsers = Object.keys(saldoData).length;
    }
    
    if (fs.existsSync(nokosPath)) {
        const orders = JSON.parse(fs.readFileSync(nokosPath));
        totalOrders = orders.length;
    }

    const activeOrders = global.activeOrdersNokos ? Object.keys(global.activeOrdersNokos).length : 0;

    const caption = `
📊 *STATUS LAYANAN NOKOS*

╭─⚙️ *Konfigurasi*
│ 💬 Private Chat: ${statusPrivate}
│ 👥 Group Chat: ${statusGroup}
│ ⚡ Auto Check: ${interval} detik
╰────────────

╭─📈 *Statistik*
│ 👤 Total User: ${totalUsers}
│ 🛒 Total Order: ${totalOrders}
│ 🔄 Order Aktif: ${activeOrders}
╰────────────

${m.isGroup && !settings.enableGroup ? "⚠️ Fitur tidak aktif di group ini" : ""}
${!m.isGroup && !settings.enablePrivate ? "⚠️ Fitur tidak aktif di private chat" : ""}

Ketik *.nokos* untuk mulai order!
`;

    await m.reply(caption);
}
break;
default:
if (m.text.toLowerCase().startsWith("xx")) {
    if (m.sender.split("@")[0] !== global.owner) return 

    try {
        const result = await eval(`(async () => { ${text} })()`);
        const output = typeof result !== "string" ? util.inspect(result) : result;
        return sock.sendMessage(m.chat, { text: util.format(output) }, { quoted: m });
    } catch (err) {
        return sock.sendMessage(m.chat, { text: util.format(err) }, { quoted: m });
    }
}

//###############################//

if (m.text.toLowerCase().startsWith("x")) {
    if (m.sender.split("@")[0] !== global.owner) return 

    try {
        let result = await eval(text);
        if (typeof result !== "string") result = util.inspect(result);
        return sock.sendMessage(m.chat, { text: util.format(result) }, { quoted: m });
    } catch (err) {
        return sock.sendMessage(m.chat, { text: util.format(err) }, { quoted: m });
    }
}

//###############################//

if (m.text.startsWith('$')) {
    if (!isOwner) return;
    
    exec(m.text.slice(2), (err, stdout) => {
        if (err) {
            return sock.sendMessage(m.chat, { text: err.toString() }, { quoted: m });
        }
        if (stdout) {
            return sock.sendMessage(m.chat, { text: util.format(stdout) }, { quoted: m });
        }
    });
}

}

} catch (err) {
console.log(err)
await sock.sendMessage(sock.user.id.split(":")[0]+"@s.whatsapp.net", {text: err.toString()}, {quoted: m ? m : null })
}}

//###############################//

process.on("uncaughtException", (err) => {
console.error("Caught exception:", err);
});

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.blue(">> Update File:"), chalk.black.bgWhite(__filename));
    delete require.cache[file];
    require(file);
});