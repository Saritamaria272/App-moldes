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
    
    // Without select to be sure
    const r = await fetch('https://200.7.96.194:50000/b1s/v1/SerialNumberDetails?$top=20', {
        headers: { Cookie: c, B1SESSION: d.SessionId },
        dispatcher
    });
    
    const data = await r.json();
    const items = data.value || [];
    console.log('Got', items.length, 'items');
    if (items.length > 0) {
       console.log('Sample Keys:', Object.keys(items[0]).filter(k => k.startsWith('U_') || k === 'Status'));
       console.log('Sample Values:', items[0].U_EstadoMolde, items[0].Status);
    }
  } catch(e) {
    console.log(e);
  }
}
test();
