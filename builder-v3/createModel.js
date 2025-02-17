const { getControllerName, readFileContent, handleSaveFile, getModelName, getModuleFolderName } = require('./helpers');
const { buildFile } = require('./helpers/modelBuilder');

console.info("----------START MODEL CONFIG----------");

// Extract command-line arguments
const [, , singular, json] = process.argv;

// Convert the JSON string of properties to an object
let props;

try {
    props = JSON.parse(json);
} catch (error) {
    console.error('Error parsing properties:', error.message);
    process.exit(1); // Exit the process if JSON parsing fails
}

try {
    // Validate required parameters
    if (!singular || !props) {
        console.error('Missing required parameters: singular and props.');
        process.exit(1);
    }

    // Module name based on the singlar name
    const moduleName = getModuleFolderName(singular)
    // Path based on the module name
    const pathFile = './src/modules/' + moduleName + '/models/'; // Default path where the model file will be stored
    // Model name based on the singlar name
    const modelName = getModelName(singular)
    // File name based on the model name
    const fileName = modelName + '.js';
    // Generate the controller name based on the singlar name
    const controllerName = getControllerName(singular);

    // Construct the response object with the required properties
    const response = {
        controllerName,
        modelName,
        props,
        fileName,
        includeHeaders: 'y', // Indicates whether to include headers in the generated file
        includeGetsSets: 'y', // Indicates whether to generate getter and setter methods
        path: pathFile,
    };

    const entityModelFileContent = readFileContent('EntityModel.js', './builder-v2', false)

    // Add the EntityModel.js
    handleSaveFile(pathFile, 'EntityModel.js', entityModelFileContent)

    // Build and save the model file
    buildFile(response);

} catch (error) {
    console.error('Error building the model file:', error.message);
    process.exit(1); // Exit the process if an error occurs
}
