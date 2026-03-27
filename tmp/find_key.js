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
    const headers = { 'Cookie': loginRes.headers.get('set-cookie'), 'B1SESSION': d.SessionId };
    
    const fetchRes = await fetch(`https://200.7.96.194:50000/b1s/v1/SerialNumberDetails?$filter=SerialNumber eq '${serialNumber}'`, { headers, dispatcher });
    const fetchData = await fetchRes.json();
    
    console.log('Props of the entity:', Object.keys(fetchData.value[0]));
    console.log('Code property:', fetchData.value[0].Code);
    console.log('DocEntry property:', fetchData.value[0].DocEntry);
    console.log('AbsEntry property:', fetchData.value[0].AbsEntry);
  } catch(e) {}
}
test('0062-72');
