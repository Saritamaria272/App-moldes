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
    
    // Getting items and scanning ONE item properly and comprehensively
    const r = await fetch('https://200.7.96.194:50000/b1s/v1/SerialNumberDetails?$top=1', {
        headers: { Cookie: c, B1SESSION: d.SessionId },
        dispatcher
    });
    
    const data = await r.json();
    if (data.value && data.value[0]) {
      const item = data.value[0];
      const keys = Object.keys(item);
      console.log('--- ALL PROPERTIES OF SerialNumberDetail ---');
      keys.forEach(k => console.log(`- ${k}: ${item[k]}`));
      console.log('--- END ---');
    }
  } catch(e) {
    console.log(e);
  }
}
test();
