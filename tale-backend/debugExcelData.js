const mongoose = require('mongoose');
const Placement = require('./models/Placement');
const XLSX = require('xlsx');
const { base64ToBuffer } = require('./utils/base64Helper');

mongoose.connect('mongodb://127.0.0.1:27017/tale_jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function debugExcelData() {
  try {
    const processedPlacements = await Placement.find({ isProcessed: true });
    
    for (const placement of processedPlacements) {
      console.log(`\n=== Processing placement: ${placement.name} ===`);
      
      if (!placement.studentData) {
        console.log('No student data found');
        continue;
      }
      
      // Parse Excel file
      const result = base64ToBuffer(placement.studentData);
      const buffer = result.buffer;
      
      let workbook;
      if (placement.fileType && placement.fileType.includes('csv')) {
        const csvData = buffer.toString('utf8');
        workbook = XLSX.read(csvData, { type: 'string' });
      } else {
        workbook = XLSX.read(buffer, { type: 'buffer' });
      }
      
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      console.log(`Found ${jsonData.length} rows`);
      
      if (jsonData.length > 0) {
        console.log('Column names:', Object.keys(jsonData[0]));
        console.log('First row data:', jsonData[0]);
        
        if (jsonData.length > 1) {
          console.log('Second row data:', jsonData[1]);
        }
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error debugging Excel data:', error);
    process.exit(1);
  }
}

debugExcelData();