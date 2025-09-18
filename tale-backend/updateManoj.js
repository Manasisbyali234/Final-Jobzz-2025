const mongoose = require('mongoose');
require('dotenv').config();

const Employer = require('./models/Employer');
const EmployerProfile = require('./models/EmployerProfile');

async function updateManoj() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal');
        
        // Update Employer
        const employer = await Employer.findOneAndUpdate(
            { email: 'Manoj@gmail.com' },
            { employerType: 'consultant' },
            { new: true }
        );
        
        if (employer) {
            console.log('Updated Employer:', employer.name, 'Type:', employer.employerType);
            
            // Update EmployerProfile
            await EmployerProfile.findOneAndUpdate(
                { employerId: employer._id },
                { employerCategory: 'consultancy' },
                { upsert: true }
            );
            
            console.log('Updated EmployerProfile category to consultancy');
        } else {
            console.log('Employer not found');
        }
        
        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        mongoose.disconnect();
    }
}

updateManoj();