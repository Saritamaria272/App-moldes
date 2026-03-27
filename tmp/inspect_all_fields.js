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
    
    const r = await fetch('https://200.7.96.194:50000/b1s/v1/SerialNumberDetails?$top=1', {
        headers: { Cookie: c, B1SESSION: d.SessionId },
        dispatcher
    });
    
    const data = await r.json();
    if (data.value && data.value[0]) {
      const allKeys = Object.keys(data.value[0]);
      console.log('ALL KEYS OF SerialNumberDetails:');
      console.log(allKeys.join(', '));
      
      const item = data.value[0];
      // Check for any field that has values like Disponible/No disponible
      const potential = {};
      for (const k in item) {
          if (item[k] !== null && (item[k] === 'Disponible' || item[k] === 'No disponible' || item[k] === 'Y' || item[k] === 'N' || item[k] === 'tYES' || item[k] === 'tNO')) {
              potential[k] = item[k];
          }
      }
      console.log('POTENTIAL FIELDS:', JSON.stringify(potential, null, 2));
    }
  } catch(e) {
    console.log(e);
  }
}
test();
