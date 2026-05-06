import fetch from "node-fetch";

const botToken = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;

async function sendPrice() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=toncoin&vs_currencies=usd,egp");
    const data = await res.json();
    const usd = data.toncoin.usd;
    const egp = data.toncoin.egp;

    const message = `سعر التون الحالي:\n💵 USD: ${usd}\n🇪🇬 EGP: ${egp}`;

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    });

    console.log("Message sent:", message);
  } catch (err) {
    console.error("Error:", err);
  }
}

sendPrice();
