const express = require('express');
const path = require('path');
const app = express();
const { Timestamp } = require('firebase-admin/firestore');
const db = require('./firebase');
const cors = require('cors');
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));
app.get('/', (req, res) => res.redirect('/admin/'));
app.get('/engines/:engine', async function (req, res) {
  try {
    const { engine = '7cUeF6pt81AePhaHvpOh' } = req.params;
    const ref = await db.collection('engines').doc(engine);
    const data = await (await ref.get()).data();
    if (data === undefined) {
      throw new Error('Engine tidak ditemukan');
    }
    res.json(data);
  } catch (error) {
    res.json({
      status: 'fail',
      message: error.message,
    });
  }
});
app.get('/engines/:engine/status/:status', async function (req, res) {
  try {
    const { engine = '7cUeF6pt81AePhaHvpOh', status = false } = req.params;
    console.log(typeof status);
    const statusEngine = status === 'on' ? true : false;
    const ref = await db.collection('engines').doc(engine);
    const response = await ref.set(
      {
        status: statusEngine,
      },
      { merge: true }
    );
    // if (data === undefined) {
    //   throw new Error('Engine tidak ditemukan');
    // }
    res.json(response);
  } catch (error) {
    res.json({
      status: 'fail',
      message: error.message,
    });
  }
});
app.get('/create', async function (req, res) {
  try {
    const timestamp = Timestamp.fromDate(new Date());
    const { type = 'Tidak Ada', temp = 0, humidity = 0 } = req.query;
    await db.collection('results').add({
      type,
      temp,
      humidity,
      createdAt: timestamp,
    });
    res.json({
      status: 'success',
      message: 'success add data',
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      status: 'fail',
      message: 'fail add data',
    });
  }
});
app.get('/admin/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(5000);
