// Simple script to check Vercel deployment
const https = require('https');

const url = 'https://e-commerce-lubna-sameh-mohameds-projects.vercel.app/api/vercel-db-health';

console.log(`Fetching: ${url}`);

https.get(url, (res) => {
    let data = '';

    console.log('Status Code:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Response ended');
        try {
            const result = JSON.parse(data);
            console.log('Response Data:', JSON.stringify(result, null, 2));
        } catch (e) {
            console.error('Error parsing JSON:', e);
            console.log('Raw data:', data);
        }
    });
}).on('error', (e) => {
    console.error('Error:', e);
}); 