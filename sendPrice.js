// sendPrice.js
const fetch = require("node-fetch");

const token = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;

// حاول تستخدم toncoin كبداية، لكن الكود هيتعامل لو المفتاح مختلف
let COIN_ID = "toncoin";
const COINGECKO_URL = (id) =>
  `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=usd`;

async function sendPrice() {
  try {
    console.log("ENV BOT_TOKEN present:", !!token);
    console.log("ENV CHAT_ID present:", !!chatId);

    // نجرب الطلب بالمفتاح الافتراضي أولاً
    let res = await fetch(COINGECKO_URL(COIN_ID));
    console.log("CoinGecko HTTP status (first try):", res.status);
    let data = await res.json();
    console.log("CoinGecko data (first try):", JSON.stringify(data, null, 2));

    // لو ما فيش نتيجة للمفتاح الافتراضي، نحاول نستخدم أي مفتاح موجود في الجذر
    if (!data || Object.keys(data).length === 0 || !data[COIN_ID]) {
      const rootKeys = Object.keys(data || {});
      console.log("Root keys found:", rootKeys);

      if (rootKeys.length === 0) {
        console.error("⚠️ CoinGecko returned empty data. ممكن يكون rate-limited أو id غلط.");
        return;
      }

      // خذ أول مفتاح متاح كـ fallback
      const fallbackKey = rootKeys[0];
      console.log("Using fallback key:", fallbackKey);

      // لو الفالباك مختلف عن COIN_ID، حدث COIN_ID محلياً
      COIN_ID = fallbackKey;
    }

    // الآن نحاول نقرأ السعر
    const tonUSD = (data && data[COIN_ID] && data[COIN_ID].usd) ?? null;
    if (!tonUSD) {
      console.error("⚠️ لم يتم العثور على سعر USD في الاستجابة بعد الفالباك.");
      console.error("Final data object:", JSON.stringify(data, null, 2));
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
