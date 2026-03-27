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
    
    const r = await fetch('https://200.7.96.194:50000/b1s/v1/SerialNumberDetails?$select=U_EstadoMolde,Status&$top=500', {
        headers: { Cookie: c, B1SESSION: d.SessionId },
        dispatcher
    });
    
    const data = await r.json();
    const items = data.value || [];
    const counts = {};
    items.forEach(i => {
      const val = i.U_EstadoMolde || 'NULO';
      counts[val] = (counts[val] || 0) + 1;
    });
    console.log('U_EstadoMolde counts:', JSON.stringify(counts, null, 2));
    if (items.length > 0) console.log('Sample item status:', items[0].Status);
  } catch(e) {
    console.log(e);
  }
}
test();
