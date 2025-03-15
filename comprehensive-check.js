const https = require('https');
const http = require('http');
const { URL } = require('url');

// Base URL of your Vercel deployment
const baseUrl = 'https://e-commerce-lubna-sameh-mohameds-projects.vercel.app';
const localBaseUrl = 'http://localhost:3000';

// Function to make HTTP requests
function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const client = parsedUrl.protocol === 'https:' ? https : http;

        console.log(`Testing endpoint: ${url}`);

        const req = client.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                let body;
                try {
                    body = data.length > 0 ? JSON.parse(data) : null;
                } catch (e) {
                    body = { rawData: data.substring(0, 200) + (data.length > 200 ? '...' : '') };
                }

                resolve({
                    statusCode: res.statusCode,
                    statusMessage: res.statusMessage,
                    headers: res.headers,
                    body
                });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.end();
    });
}

// Function to test multiple endpoints
async function testEndpoints(useLocal = false) {
    const urlBase = useLocal ? localBaseUrl : baseUrl;

    // Define endpoints to test
    const endpoints = [
        { name: 'Main Site', url: `${urlBase}` },
        { name: 'Test Page', url: `${urlBase}/test-page` },
        { name: 'API Test Endpoint', url: `${urlBase}/api/test` },
        { name: 'DB Check Endpoint', url: `${urlBase}/api/db-check` },
        { name: 'DB Status Page', url: `${urlBase}/db-status` },
        { name: 'DB Health API', url: `${urlBase}/api/vercel-db-health` },
        { name: 'API Products', url: `${urlBase}/api/products` }
    ];

    console.log(`Testing against ${useLocal ? 'local development server' : 'Vercel deployment'} at ${urlBase}`);
    console.log('================================================');

    for (const endpoint of endpoints) {
        try {
            const result = await makeRequest(endpoint.url);

            console.log(`\n✅ ${endpoint.name} (${endpoint.url}):`);
            console.log(`Status: ${result.statusCode} ${result.statusMessage}`);

            if (result.statusCode >= 200 && result.statusCode < 300) {
                console.log('Response: ', result.body ? JSON.stringify(result.body, null, 2).substring(0, 500) : 'No body content');
            } else {
                console.log('❌ Error: Non-success status code');
                if (result.body) {
                    console.log('Response: ', JSON.stringify(result.body, null, 2).substring(0, 500));
                }
            }
        } catch (error) {
            console.log(`\n❌ ${endpoint.name} (${endpoint.url}):`);
            console.log(`Error: ${error.message}`);
        }
        console.log('------------------------------------------------');
    }
}

// Run the tests on the Vercel deployment
console.log('CHECKING VERCEL DEPLOYMENT');
testEndpoints(false)
    .then(() => {
        console.log('\n\nCHECKING LOCAL SERVER (IF RUNNING)');
        console.log('Note: This will only work if you have a local server running on port 3000');
        return testEndpoints(true);
    })
    .catch(err => {
        console.error('Test failed:', err);
    }); 