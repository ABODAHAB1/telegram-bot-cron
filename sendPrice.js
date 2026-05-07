const fetch = require("node-fetch");

const token = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;
const COIN_ID = "toncoin"; // التعديل هنا
const COINGECKO_URL = `https://api.coingecko.com/api/v3/simple/price?ids=${COIN_ID}&vs_currencies=usd`;

async function sendPrice() {
    try {
        const res = await fetch(COINGECKO_URL);
        const data = await res.json();
        console.log("CoinGecko data:", data);

        const tonUSD = data[COIN_ID]?.usd ?? null;
        if (!tonUSD) {
            console.error("مش لاقي سعر من API");
            return;
        }

        const messageText = `سعر التون الحالي: ${tonUSD} $`;
        const url = `https://api.telegram.org/bot${token}/sendMessage`;

        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text: messageText }),
        });

        console.log("تم إرسال الرسالة بنجاح");
    } catch (err) {
        console.error("حصل خطأ:", err);
    }
}

sendPrice();
