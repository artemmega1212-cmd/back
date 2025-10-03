const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Хранилище платежей (в реальном приложении используй базу данных)
const payments = new Map();

app.post('/api/payment', (req, res) => {
  const { cardNumber, expiry, cvv, amount, product } = req.body;
  
  // Симуляция обработки платежа
  console.log('Получен платеж:', { 
    cardNumber: cardNumber.replace(/\d(?=\d{4})/g, "*"),
    expiry, 
    amount, 
    product 
  });

  // Имитация задержки обработки
  setTimeout(() => {
    // В реальном приложении здесь была бы интеграция с платежной системой
    const paymentId = 'pay_' + Date.now();
    const success = Math.random() > 0.1; // 90% успешных платежей
    
    if (success) {
      payments.set(paymentId, {
        id: paymentId,
        cardNumber: cardNumber.replace(/\d(?=\d{4})/g, "*"),
        expiry,
        amount,
        product,
        status: 'completed',
        timestamp: new Date().toISOString()
      });
      
      res.json({
        success: true,
        paymentId: paymentId,
        message: 'Платеж успешно обработан'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Недостаточно средств на карте'
      });
    }
  }, 2000);
});

app.get('/api/payments/:id', (req, res) => {
  const payment = payments.get(req.params.id);
  if (payment) {
    res.json(payment);
  } else {
    res.status(404).json({ error: 'Платеж не найден' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
