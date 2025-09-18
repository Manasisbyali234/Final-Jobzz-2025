const mongoose = require('mongoose');
const Job = require('./models/Job');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/tale_jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function updateConsultantJob() {
  try {
    const jobId = '68caf4eae25c831ffb6fc6be';
    
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        companyName: 'Tech Solutions Inc.',
        companyDescription: 'A leading technology company specializing in innovative software solutions and digital transformation services.',
        companyLogo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzBGMTcyQSIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UUzwvdGV4dD4KPC9zdmc+',
        category: 'IT'
      },
      { new: true }
    );
    
    console.log('Job updated successfully!');
    console.log('Company Name:', updatedJob.companyName);
    console.log('Company Description:', updatedJob.companyDescription ? 'Added' : 'Not added');
    console.log('Company Logo:', updatedJob.companyLogo ? 'Added' : 'Not added');
    console.log('Category:', updatedJob.category);
    
  } catch (error) {
    console.error('Error updating job:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateConsultantJob();