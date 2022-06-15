const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://simplisia-monitoring.firebaseio.com',
});

const db = getFirestore();

module.exports = db;
