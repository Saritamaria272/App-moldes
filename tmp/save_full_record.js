const { Agent } = require('undici');
const fs = require('fs');
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
    
    const r = await fetch('https://200.7.96.194:50000/b1s/v1/SerialNumberDetails(1)', {
        headers: { Cookie: c, B1SESSION: d.SessionId },
        dispatcher
    });
    
    const data = await r.json();
    fs.writeFileSync('tmp/full_record.json', JSON.stringify(data, null, 2));
    console.log('Done writing tmp/full_record.json');
  } catch(e) {
    console.log(e);
  }
}
test();
