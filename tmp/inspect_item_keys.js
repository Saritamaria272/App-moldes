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
    
    const r = await fetch("https://200.7.96.194:50000/b1s/v1/Items('PMOL02-0001-000-0000')?$select=U_Estado,U_ESTADO,U_EstadoMolde,U_ESTADO_MOLDE", {
        headers: { Cookie: c, B1SESSION: d.SessionId },
        dispatcher
    });
    
    const res = await r.json();
    console.log('Item metadata:', JSON.stringify(res, null, 2));
  } catch(e) {
    console.log(e);
  }
}
test();
