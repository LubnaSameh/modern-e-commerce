// Comprehensive script to check Vercel deployment
const https = require('https');

const endpoints = [
    {
        name: 'Main Site',
        url: 'https://e-commerce-lubna-sameh-mohameds-projects.vercel.app/'
    },
    {
        name: 'DB Status Page',
        url: 'https://e-commerce-lubna-sameh-mohameds-projects.vercel.app/db-status'
    },
    {
        name: 'DB Health API',
        url: 'https://e-commerce-lubna-sameh-mohameds-projects.vercel.app/api/vercel-db-health'
    },
    {
        name: 'API Products Endpoint',
        url: 'https://e-commerce-lubna-sameh-mohameds-projects.vercel.app/api/products'
    }
];

function checkEndpoint(endpoint) {
    return new Promise((resolve) => {
        console.log(`\n--- Checking ${endpoint.name} ---`);
        console.log(`URL: ${endpoint.url}`);

        const request = https.get(endpoint.url, (res) => {
            console.log(`Status: ${res.statusCode} ${res.statusMessage}`);

            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('✅ Success!');
                    if (endpoint.url.includes('/api/')) {
                        try {
                            const json = JSON.parse(data);
                            console.log(`Response: ${JSON.stringify(json).substring(0, 200)}...`);
                            resolve({ success: true, data: json });
                        } catch (e) {
                            console.log('Error parsing JSON response');
                            resolve({ success: false, error: 'Invalid JSON response' });
                        }
                    } else {
                        console.log(`HTML Response received (${data.length} bytes)`);
                        resolve({ success: true });
                    }
                } else {
                    console.log('❌ Failed!');
                    console.log(`Response: ${data.substring(0, 200)}...`);
                    resolve({ success: false, statusCode: res.statusCode });
                }
            });
        });

        request.on('error', (error) => {
            console.log(`❌ Error: ${error.message}`);
            resolve({ success: false, error: error.message });
        });

        // Set a timeout of 10 seconds
        request.setTimeout(10000, () => {
            console.log('❌ Request timed out after 10 seconds');
            request.abort();
            resolve({ success: false, error: 'Request timed out' });
        });
    });
}

async function checkAllEndpoints() {
    console.log('Starting Vercel deployment check...');

    for (const endpoint of endpoints) {
        await checkEndpoint(endpoint);
    }

    console.log('\nAll checks completed!');
}

checkAllEndpoints(); 