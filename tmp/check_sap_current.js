const { Agent } = require('undici');
const dispatcher = new Agent({ connect: { rejectUnauthorized: false } });

async function check() {
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
        'Cookie': loginRes.headers.get('set-cookie'),
        'B1SESSION': d.SessionId
    };
    
    const serialNumber = '0062-72';
    const filterQuery = `SerialNumber eq '${serialNumber}' or MfrSerialNo eq '${serialNumber}'`;
    const searchPath = `/SerialNumberDetails?$filter=${encodeURIComponent(filterQuery)}`;
    
    const fetchRes = await fetch(`https://200.7.96.194:50000/b1s/v1${searchPath}`, { headers, dispatcher });
    const fetchData = await fetchRes.json();
    
    if (fetchData.value && fetchData.value.length > 0) {
        console.log('--- SAP STATE FOR 0062-72 ---');
        console.log('ItemCode:', fetchData.value[0].ItemCode);
        console.log('SerialNumber:', fetchData.value[0].SerialNumber);
        console.log('U_EstadoMolde:', fetchData.value[0].U_EstadoMolde);
        console.log('-----------------------------');
    } else {
        console.log('Mold not found in SAP');
    }
  } catch(e) {
    console.log(e);
  }
}
check();
