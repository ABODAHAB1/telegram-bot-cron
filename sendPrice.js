const fetch = require("node-fetch");

const token = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;
const COIN_ID = "toncoin";
const COINGECKO_URL = `https://api.coingecko.com/api/v3/simple/price?ids=${COIN_ID}&vs_currencies=usd`;

async function sendPrice() {
  try {
    // تحقق من وجود المتغيرات البيئية
    console.log("ENV BOT_TOKEN present:", !!token);
    console.log("ENV CHAT_ID present:", !!chatId);

    // جلب سعر العملة
    const res = await fetch(COINGECKO_URL);
    console.log("CoinGecko HTTP status:", res.status);
    const data = await res.json();
    console.log("CoinGecko data:", JSON.stringify(data, null, 2));

    // حاول الحصول على السعر من المفتاح المتوقع
    const tonUSD = data[COIN_ID]?.usd ?? null;
    if (!tonUSD) {
      console.error("⚠️ لم يتم العثور على سعر USD في الاستجابة.");
      // اطبع مفاتيح الجذر لو المفتاح مختلف
      console.error("Root keys:", Object.keys(data));
      return;
    }

    const messageText = `سعر التون الحالي: ${tonUSD} $`;
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    // أرسل رسالة للتليجرام واطبع الاستجابة كاملة
    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: messageText }),
    });

    const tgBody = await tgRes.text();
    console.log("Telegram HTTP status:", tgRes.status);
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
