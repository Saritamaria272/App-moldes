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
    
    // Exact filter to see if it even exists
    const r = await fetch("https://200.7.96.194:50000/b1s/v1/SerialNumberDetails?$filter=U_Estado eq 'Disponible'&$top=1", {
        headers: { Cookie: c, B1SESSION: d.SessionId },
        dispatcher
    });
    const res = await r.json();
    console.log('Result for U_Estado:', JSON.stringify(res.error ? res.error.message.value : 'Exists', null, 2));
    
    // Exact filter for U_ESTADO
    const r2 = await fetch("https://200.7.96.194:50000/b1s/v1/SerialNumberDetails?$filter=U_ESTADO eq 'Disponible'&$top=1", {
        headers: { Cookie: c, B1SESSION: d.SessionId },
        dispatcher
    });
    const res2 = await r2.json();
    console.log('Result for U_ESTADO:', JSON.stringify(res2.error ? res2.error.message.value : 'Exists', null, 2));
    
    // Testing case sensitivity
    const r3 = await fetch("https://200.7.96.194:50000/b1s/v1/SerialNumberDetails?$top=1", {
        headers: { Cookie: c, B1SESSION: d.SessionId },
        dispatcher
    });
    const data = await r3.json();
    const all = Object.keys(data.value[0]);
    console.log('Keys search for "Estado":', all.filter(k => k.toLowerCase().includes('estado')));
  } catch(e) {
    console.log(e);
  }
}
test();
