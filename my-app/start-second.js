const { exec } = require('child_process');
const process = require('process');

// Set the port for the second instance
process.env.PORT = 3001;
process.env.REACT_APP_IS_SECOND_INSTANCE = 'true';

// Start the React development server
exec('react-scripts start', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
}); 