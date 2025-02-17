const { getModuleFolderName, getServiceName, getModelName, getControllerName, getDataFileName } = require('./helpers'); // Import helper functions to get file and module names
const { buildFileData, buildFileController } = require('./helpers/storeBuilder'); // Import functions to build store files

console.info("----------START STORE CONFIGURATION----------");

// const archivoDeclaracion = './src/_store/index.js'; // Commented out, possibly for global declaration use
const [, , singular] = process.argv; // Extract the third argument from the command line (singular name)

// Try to build the 'responses' object
try {
    // Check if all necessary parameters were provided
    // If 'singular' is missing, an error is logged, and the process stops.
    if (!singular) {
        console.error('All parameters are required: endpoint route, service name, file name, props, and path.');
        process.exit(1); // Exit the process with an error status
    }

    // Call helper functions to get module and file names
    const moduleName = getModuleFolderName(singular); // Get module folder name from the singular name
    const nameService = getServiceName(singular); // Get service name
    const nameModel = getModelName(singular); // Get model name
    const pathClass = './src/modules/' + moduleName + '/models/'; // Define the model file path
    const nameController = getControllerName(singular); // Get controller name
    const fileNameController = nameController + '.js'; // Controller file name
    const nameData = getDataFileName(singular); // Get data file name
    const fileNameData = nameData + '.js'; // Data file name
    const pathFiles = './src/modules/' + moduleName + '/store/'; // Path where store files will be stored

    // Create the 'responses' object with all necessary information
    const responses = {
        nameSingular: singular,
        nameService,
        nameClass: nameModel,
        pathClass,
        nameController,
        nameData,
        fileNameData,
        fileNameController,
        pathFiles
    }

    // Call functions to build data and controller files
    buildFileData(responses);
    buildFileController(responses);
} catch (error) {
    // If an error occurs during the process, log the error message and stop the process
    console.error('Error building the store files:', error.message);
    process.exit(1); // Exit the process with an error status
}
