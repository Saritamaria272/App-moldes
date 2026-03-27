const { Agent } = require('undici');
const path = require('path');
require('dotenv').config({ path: 'c:/Users/isaza/OneDrive/Documentos/APP MOLDES/.env' });
const dispatcher = new Agent({ connect: { rejectUnauthorized: false } });

async function test() {
  try {
    const loginRes = await fetch('https://200.7.96.194:50000/b1s/v1/Login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            CompanyDB: process.env.SAP_COMPANY_DB,
            UserName:  process.env.SAP_USER,
            Password:  process.env.SAP_PASSWORD,
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
    console.log(JSON.stringify(data.value ? data.value[0] : data, null, 2));
  } catch(e) {
    console.log(e);
  }
}
test();
