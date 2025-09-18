const mongoose = require('mongoose');
const Job = require('./models/Job');

mongoose.connect('mongodb://127.0.0.1:27017/tale_jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function updateJob() {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      '68cafe64e25c831ffb6fc914',
      {
        companyName: 'TechCorp Solutions',
        companyDescription: 'Leading technology company specializing in full-stack development and innovative software solutions.',
        companyLogo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzBGMTcyQSIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UQzwvdGV4dD4KPC9zdmc+',
        category: 'IT'
      },
      { new: true }
    );
    
    console.log('Job updated successfully!');
    console.log('Company Name:', updatedJob.companyName);
    console.log('Company Logo:', updatedJob.companyLogo ? 'Added' : 'Failed');
    console.log('Company Description:', updatedJob.companyDescription ? 'Added' : 'Failed');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateJob();