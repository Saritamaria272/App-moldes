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
    const headers = {
        Cookie: loginRes.headers.get('set-cookie'),
        B1SESSION: d.SessionId
    };
    
    // Getting metadata for SerialNumberDetails
    const r = await fetch('https://200.7.96.194:50000/b1s/v1/$metadata', { headers, dispatcher });
    if (!r.ok) return console.log('Metadata failed');
    const text = await r.text();
    const lines = text.split('\n');
    let inEntity = false;
    let keys = [];
    for (const line of lines) {
        if (line.includes('EntityType Name="SerialNumberDetail"')) inEntity = true;
        if (inEntity && line.includes('<Key>')) {
            // grab the keys
            let keySection = '';
            for (let i = lines.indexOf(line) + 1; i < lines.length; i++) {
                if (lines[i].includes('</Key>')) break;
                keySection += lines[i];
            }
            console.log('Keys:', keySection);
            break;
        }
    }
  } catch(e) {
    console.log(e);
  }
}
test();
