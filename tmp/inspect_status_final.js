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
    
    // Fetch specifically Status and check its values
    const r = await fetch('https://200.7.96.194:50000/b1s/v1/SerialNumberDetails?$select=Status,ItemCode,SerialNumber&$top=200', {
        headers: { Cookie: c, B1SESSION: d.SessionId },
        dispatcher
    });
    
    const data = await r.json();
    const items = data.value || [];
    console.log('Total items fetched:', items.length);
    const statuses = items.map(i => i.Status);
    console.log('Unique statuses found:', Array.from(new Set(statuses)));
  } catch(e) {
    console.log(e);
  }
}
test();
