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
    
    // Comprehensive scan of the first item from the SerialNumberDetails table
    const r = await fetch('https://200.7.96.194:50000/b1s/v1/Items?$top=1', {
        headers: { Cookie: c, B1SESSION: d.SessionId },
        dispatcher
    });
    
    const data = await r.json();
    if (data.value && data.value[0]) {
      const keys = Object.keys(data.value[0]).filter(k => k.toLowerCase().includes('estado'));
      console.log('Fields in OITM (Items) with "Estado" in name:', keys);
    }
  } catch(e) {
    console.log(e);
  }
}
test();
