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
    
    let skip = 0;
    let found = false;
    while (skip < 1500 && !found) {
        console.log('Fetching batch with skip:', skip);
        const r = await fetch(`https://200.7.96.194:50000/b1s/v1/SerialNumberDetails?$top=100&$skip=${skip}`, {
            headers: { Cookie: c, B1SESSION: d.SessionId },
            dispatcher
        });
        const data = await r.json();
        const items = data.value || [];
        if (items.length === 0) break;
        
        for (const item of items) {
            for (const k in item) {
                const val = String(item[k]);
                if (val === 'Disponible' || val === 'No disponible') {
                    console.log('FOUND IT!');
                    console.log('Field:', k);
                    console.log('Value:', val);
                    console.log('Sample Item:', JSON.stringify(item, null, 2));
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
        skip += items.length;
    }
    if (!found) console.log('Finished searching 1500 items, found nothing.');
  } catch(e) {
    console.log(e);
  }
}
test();
