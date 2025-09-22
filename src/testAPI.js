// Simple test to check if the API is accessible from the frontend
fetch('http://localhost:5000/api/public/jobs')
  .then(response => response.json())
  .then(data => {
    console.log('Frontend API Test Results:');
    console.log('Success:', data.success);
    console.log('Total Jobs:', data.total);
    console.log('Jobs Count:', data.jobs ? data.jobs.length : 0);
    
    if (data.jobs && data.jobs.length > 0) {
      console.log('First few jobs:');
      data.jobs.slice(0, 3).forEach((job, index) => {
        console.log(`${index + 1}. ${job.title} - ${job.location} (${job.category})`);
      });
    }
  })
  .catch(error => {
    console.error('Frontend API Error:', error);
  });