import dotenv from 'dotenv';
import { Agent } from 'undici';

dotenv.config();

const sapLoginUrl = process.env.SAP_LOGIN_URL;
const sapPayload = {
    "CompanyDB": process.env.SAP_COMPANY_DB,
    "Password": process.env.SAP_PASSWORD,
    "UserName": process.env.SAP_USER
};

async function testSAP() {
    console.log('Testing SAP Login with URL:', sapLoginUrl);
    try {
        const response = await fetch(sapLoginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sapPayload),
            // @ts-ignore
            dispatcher: new Agent({
                connect: { rejectUnauthorized: false }
            })
        });

        if (response.ok) {
            console.log('✅ SAP Login Successful!');
            const data = await response.json();
            console.log('Session data received.');
        } else {
            const err = await response.text();
            console.error('❌ SAP Login Failed:', response.status, err);
        }
    } catch (error) {
        console.error('❌ Error testing SAP:', error.message);
    }
}

testSAP();
