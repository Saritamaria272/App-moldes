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
    
    // Exact path to the first record we found
    const path = "/SerialNumberDetails(ItemCode='PMOL02-0001-000-0000',SystemNumber=1)";
    const r = await fetch('https://200.7.96.194:50000/b1s/v1' + path, {
        headers: { Cookie: c, B1SESSION: d.SessionId },
        dispatcher
    });
    
    const data = await r.json();
    console.log(JSON.stringify(data, null, 2));
  } catch(e) {
    console.log(e);
  }
}
test();
