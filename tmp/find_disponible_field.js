const { Agent } = require('undici');
const dispatcher = new Agent({ connect: { rejectUnauthorized: false } });

async function test() {
  try {
    const loginRes = await fetch('https://200.7.96.194:50000/b1s/v1/Login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            CompanyDB: 'Firplak_SA',
            UserName:  'manager',
            Password:  '2023Fir#.*',
        }),
        dispatcher
    });
    
    const d = await loginRes.json();
    const c = loginRes.headers.get('set-cookie');
    
    // Check top 500 records
    const r = await fetch('https://200.7.96.194:50000/b1s/v1/SerialNumberDetails?$top=500', {
        headers: { Cookie: c, B1SESSION: d.SessionId },
        dispatcher
    });
    
    const data = await r.json();
    const items = data.value || [];
    const findings = {};
    for (const item of items) {
       for (const k in item) {
          const v = String(item[k]).toLowerCase();
          if (v === 'disponible' || v === 'no disponible') {
              findings[k] = findings[k] || new Set();
              findings[k].add(item[k]);
          }
       }
    }
    
    const res = {};
    for (const k in findings) {
       res[k] = Array.from(findings[k]);
    }
    
    console.log('Fields with Disponible/No disponible:', JSON.stringify(res, null, 2));
  } catch(e) {
    console.log(e);
  }
}
test();
