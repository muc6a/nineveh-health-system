const https = require('https');

function putData(url, data) {
  return new Promise((resolve, reject) => {
    const dataStr = JSON.stringify(data);
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataStr)
      }
    };
    
    const req = https.request(url, options, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => resolve(responseBody));
    });
    
    req.on('error', reject);
    req.write(dataStr);
    req.end();
  });
}

async function run() {
  const est = {
    id: "EST-NEW-7",
    name: "مطعم التجربة (للتأكد من عمل النظام)",
    sector: "مركز المحافظة - الجانب الأيسر",
    type: "مطعم",
    ownerName: "صاحب المطعم",
    phone: "07700000000",
    dateAdded: new Date().toISOString()
  };
  
  const fine = {
    id: "fine_est_new_7_test",
    type: "fine",
    establishmentId: "EST-NEW-7",
    establishmentName: "مطعم التجربة (للتأكد من عمل النظام)",
    sector: "مركز المحافظة - الجانب الأيسر",
    amount: 150000,
    reason: "مخالفة تجريبية لاختبار بحث المحاسب",
    paymentStatus: "pending",
    date: new Date().toISOString()
  };

  await putData('https://nineveh-health-default-rtdb.firebaseio.com/establishments/0.json', est);
  await putData('https://nineveh-health-default-rtdb.firebaseio.com/penaltyRequests_v2/0.json', fine);
  
  console.log("Seeded EST-NEW-7 into Firebase");
}

run();
