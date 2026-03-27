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
    
    // We want all records to see unique values
    const r = await fetch('https://200.7.96.194:50000/b1s/v1/SerialNumberDetails?$select=U_EstadoMolde&$top=1500', {
        headers: { Cookie: c, B1SESSION: d.SessionId },
        dispatcher
    });
    
    const data = await r.json();
    const items = data.value || [];
    const unique = new Set();
    items.forEach(i => {
      unique.add(i.U_EstadoMolde);
    });
    console.log('Unique U_EstadoMolde values:', Array.from(unique));
  } catch(e) {
    console.log(e);
  }
}
test();
