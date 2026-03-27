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
    
    // Testing U_ESTADO
    const r = await fetch("https://200.7.96.194:50000/b1s/v1/SerialNumberDetails?$select=U_ESTADO&$top=1", {
        headers: { Cookie: c, B1SESSION: d.SessionId },
        dispatcher
    });
    const res = await r.json();
    console.log('Result for U_ESTADO:', JSON.stringify(res, null, 2));
  } catch(e) {
    console.log(e);
  }
}
test();
