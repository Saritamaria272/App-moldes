const { Agent } = require('undici');
const dispatcher = new Agent({ connect: { rejectUnauthorized: false } });

async function test(serialNumber) {
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
    const headers = { 'Content-Type': 'application/json', 'Cookie': loginRes.headers.get('set-cookie'), 'B1SESSION': d.SessionId };
    
    const fetchRes = await fetch(`https://200.7.96.194:50000/b1s/v1/SerialNumberDetails?$filter=SerialNumber eq '${serialNumber}'`, { headers, dispatcher });
    const fetchData = await fetchRes.json();
    
    const entity = fetchData.value[0];
    console.log('Got DocEntry:', entity.DocEntry);
    console.log('Got ItemCode:', entity.ItemCode);
    console.log('Got SystemNumber:', entity.SystemNumber);

    // Try patching with DocEntry
    const patchPathDocEntry = `/SerialNumberDetails(${entity.DocEntry})`;
    console.log('Trying:', patchPathDocEntry);
    let p = await fetch(`https://200.7.96.194:50000/b1s/v1${patchPathDocEntry}`, {
        method: 'PATCH', headers, body: JSON.stringify({ U_EstadoMolde: 'En reparación' }), dispatcher
    });
    if(p.ok) return console.log('DocEntry Success!');
    console.log('DocEntry Failed:', await p.text());
    
    // Try patching with both
    const patchPathCombo = `/SerialNumberDetails(ItemCode='${encodeURIComponent(entity.ItemCode)}',SystemNumber=${entity.SystemNumber})`;
    console.log('Trying:', patchPathCombo);
    p = await fetch(`https://200.7.96.194:50000/b1s/v1${patchPathCombo}`, {
        method: 'PATCH', headers, body: JSON.stringify({ U_EstadoMolde: 'En reparación' }), dispatcher
    });
    if(p.ok) return console.log('Combo Success!');
    console.log('Combo Failed:', await p.text());
  } catch(e) {}
}
test('0062-72');
