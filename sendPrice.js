import fetch from "node-fetch";

const token = process.env.BOT_TOKEN;
// هنا هنستخدم اليوزر نيم مباشرة
const chatId = "@AaNnAn2";

let COIN_ID = "toncoin"; 
const COINGECKO_URL = (id) =>
  `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=usd`;

async function sendPrice() {
  try {
    console.log("ENV BOT_TOKEN present:", !!token);

    const res = await fetch(COINGECKO_URL(COIN_ID));
    console.log("CoinGecko HTTP status:", res.status);
    const data = await res.json();
    console.log("CoinGecko data:", JSON.stringify(data, null, 2));

    // لو المفتاح مش موجود، اطبع المفاتيح المتاحة
    if (!data[COIN_ID]) {
      console.error("⚠️ المفتاح الافتراضي مش موجود. Root keys:", Object.keys(data));
      return;
    }

    const tonUSD = data[COIN_ID]?.usd;
    if (typeof tonUSD !== "number") {
      console.error("⚠️ مفيش قيمة usd في المفتاح:", COIN_ID);
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
    console.error("❌ حصل خطأ غير متوقع:", err);
  }
}

sendPrice();
