const { getServiceName, getModuleFolderName } = require('./helpers');
const { buildFile } = require('./helpers/serviceBuilder');

console.info("----------STARTING SERVICE CONFIGURATION----------")

// The following line extracts the command-line arguments passed to the script.
// `singular` is the singular model name and `api` is the API endpoint.
const [, , singular, api] = process.argv;

try {
    // Check if all necessary parameters were provided
    // If either 'api' or 'singular' is missing, an error is logged, and the process is stopped.
    if (!api || !singular) {
        console.error('All parameters are required: endpoint route, service name, file name, props, and path.');
        process.exit(1); // Exit the process with an error status
    }

    // Get the service name by passing the singular model name
    // The `getServiceName` function converts the singular model name to a service name (e.g., "User" → "UsersService")
    let serviceName = getServiceName(singular);

    // The file name is the service name with a `.js` extension
    let fileName = serviceName + '.ts';
    // Module name based on the singlar name
    const moduleName = getModuleFolderName(singular)
    // Path based on the module name
    const path = './src/modules/' + moduleName + '/services/'; // Default path where the model file will be stored

    // Build the 'respuestas' object (this will contain all the necessary information to create the service file)
    const respuestas = {
        endpoint: api,
        serviceName,
        fileName,
        path,
    };

    // Call the `buildFile` function to create the service file based on the provided data
    buildFile(respuestas);

} catch (error) {
    // If an error occurs during the process, log the error message and exit the process with an error status
    console.error('Error building the service file:', error.message);
    process.exit(1); // Exit the process with an error status
}
