const http = require('http');

function testAPI() {
  console.log('Testing jobs API...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/public/jobs',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log('API Response Status:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        console.log('Success:', jsonData.success);
        console.log('Total Jobs:', jsonData.total);
        console.log('Jobs Count:', jsonData.jobs ? jsonData.jobs.length : 0);
        
        if (jsonData.jobs && jsonData.jobs.length > 0) {
          console.log('\nFirst few jobs:');
          jsonData.jobs.slice(0, 3).forEach((job, index) => {
            console.log(`${index + 1}. ${job.title} - ${job.location} (${job.category})`);
          });
        }
      } catch (error) {
        console.error('Error parsing response:', error.message);
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Error testing API:', error.message);
  });

  req.end();
}

testAPI();