const https = require('https');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function run() {
  const estsStr = await fetch('https://nineveh-health-default-rtdb.firebaseio.com/establishments.json');
  const finesStr = await fetch('https://nineveh-health-default-rtdb.firebaseio.com/penaltyRequests_v2.json');
  
  const ests = typeof estsStr === 'string' ? JSON.parse(estsStr) : estsStr;
  const fines = typeof finesStr === 'string' ? JSON.parse(finesStr) : finesStr;

  const targetEst = (ests || []).find(e => String(e.id).toLowerCase() === 'est-new-7');
  console.log("Establishment Data:", JSON.stringify(targetEst, null, 2));

  const targetFines = (fines || []).filter(f => String(f.establishmentId || f.estId).toLowerCase() === 'est-new-7');
  console.log("Fines Data:", JSON.stringify(targetFines, null, 2));
}

run();
