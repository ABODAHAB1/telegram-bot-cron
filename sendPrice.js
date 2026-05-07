import fetch from "node-fetch";

const token = process.env.BOT_TOKEN;
// هنا هنستخدم اليوزر نيم مباشرة بدل الـ CHAT_ID
const chatId = "@AaNnAn2";

const COIN_ID = "toncoin"; 
const COINGECKO_URL = `https://api.coingecko.com/api/v3/simple/price?ids=${COIN_ID}&vs_currencies=usd`;

async function sendPrice() {
    try {
        const res = await fetch(COINGECKO_URL);
        const data = await res.json();

        console.log("CoinGecko data:", JSON.stringify(data, null, 2));

        const tonUSD = data[COIN_ID]?.usd ?? null;
        if (!tonUSD) {
            console.error("⚠️ مش لاقي سعر من API - المفتاح غلط أو مختلف");
            console.error("Root keys:", Object.keys(data));
            return;
        }

        const messageText = `سعر التون الحالي: ${tonUSD} $`;
        const url = `https://api.telegram.org/bot${token}/sendMessage`;

        const tgRes = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text: messageText }),
        });

        const tgBody = await tgRes.text();
        console.log("Telegram response body:", tgBody);

        if (!tgRes.ok) {
            console.error("❌ فشل إرسال الرسالة إلى Telegram");
            return;
        }

        console.log("✅ تم إرسال الرسالة بنجاح");
    } catch (err) {
        console.error("❌ حصل خطأ:", err);
    }
}

sendPrice();
