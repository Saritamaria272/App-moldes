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
    
    // Explicitly select possible names
    const fields = ['U_Estado', 'U_ESTADO', 'U_EstadoMolde', 'U_ESTADO_MOLDE'];
    for (const f of fields) {
      console.log('Testing field:', f);
      const r = await fetch(`https://200.7.96.194:50000/b1s/v1/SerialNumberDetails?$select=${f}&$top=1`, {
          headers: { Cookie: c, B1SESSION: d.SessionId },
          dispatcher
      });
      const res = await r.json();
      if (res.error) {
        console.log('  ❌ Error:', res.error.message.value);
      } else {
        console.log('  ✅ Success:', JSON.stringify(res.value[0]));
      }
    }
  } catch(e) {
    console.log(e);
  }
}
test();
