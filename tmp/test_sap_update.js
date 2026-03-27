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
    const headers = {
        'Content-Type': 'application/json',
        'Cookie': loginRes.headers.get('set-cookie'),
        'B1SESSION': d.SessionId
    };
    
    const filterQuery = `SerialNumber eq '${serialNumber}' or MfrSerialNo eq '${serialNumber}'`;
    const searchPath = `/SerialNumberDetails?$filter=${encodeURIComponent(filterQuery)}`;
    
    const fetchRes = await fetch(`https://200.7.96.194:50000/b1s/v1${searchPath}`, { headers, dispatcher });
    const fetchData = await fetchRes.json();
    
    if (!fetchRes.ok || !fetchData.value || fetchData.value.length === 0) {
        console.log('Error o Serial No Found:', JSON.stringify(fetchData, null, 2));
        return;
    }
    
    const entity = fetchData.value[0];
    const systemNumber = entity.SystemNumber;
    const realItemCode = entity.ItemCode;
    
    const patchPath = `/SerialNumberDetails(ItemCode='${realItemCode}',SystemNumber=${systemNumber})`;
    const patchData = { U_EstadoMolde: estado_sap };
    
    console.log(`Patching url ${patchPath} with data:`, patchData);
    const patchRes = await fetch(`https://200.7.96.194:50000/b1s/v1${patchPath}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(patchData),
        dispatcher
    });
    
    if (!patchRes.ok) {
        const errorText = await patchRes.text();
        console.error('SAP Error:', errorText);
    } else {
        console.log('Success!');
    }
  } catch(e) {
    console.log('Exception:', e);
  }
}
test('0062-72', 'En reparación');
