const { Agent } = require('undici');
const dispatcher = new Agent({ connect: { rejectUnauthorized: false } });

async function test(serialNumber, estado_sap) {
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
    
    const filterQuery = `SerialNumber eq '${serialNumber}' or MfrSerialNo eq '${serialNumber}'`;
    const searchPath = `/SerialNumberDetails?$filter=${encodeURIComponent(filterQuery)}`;
    
    const fetchRes = await fetch(`https://200.7.96.194:50000/b1s/v1${searchPath}`, { headers, dispatcher });
    const fetchData = await fetchRes.json();
    const entity = fetchData.value[0];
    const docEntry = entity.DocEntry;
    
    const patchPath = `/SerialNumberDetails(${docEntry})`;
    const patchData = { U_EstadoMolde: estado_sap };
    
    console.log(`Patching ${patchPath} with ${JSON.stringify(patchData)}`);
    const p = await fetch(`https://200.7.96.194:50000/b1s/v1${patchPath}`, {
        method: 'PATCH', headers, body: JSON.stringify(patchData), dispatcher
    });
    
    if (p.ok) {
        console.log('Success (204 No Content)');
    } else {
        console.log('Failed:', await p.text());
    }
  } catch(e) {
    console.log(e);
  }
}
test('0062-72', 'En reparación');
