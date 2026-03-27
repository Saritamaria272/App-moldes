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
    
    const r = await fetch('https://200.7.96.194:50000/b1s/v1/SerialNumberDetails?$select=Status,U_EstadoMolde&$top=1500', {
        headers: { Cookie: c, B1SESSION: d.SessionId },
        dispatcher
    });
    
    const data = await r.json();
    const items = data.value || [];
    const withStatus = items.filter(i => i.Status !== null && i.Status !== undefined);
    console.log('Got', withStatus.length, 'items with Status');
    if (withStatus.length > 0) {
       console.log('Status values sample:', Array.from(new Set(withStatus.map(i => i.Status))));
    }
  } catch(e) {
    console.log(e);
  }
}
test();
