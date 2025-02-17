#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

/**
 * Generates the folder name for a module based on the singular model name.
 * Converts the name to lowercase and pluralizes it, then adds it as a folder name.
 *
 * @param {string} modelName - The singular form of the model name (e.g., "user", "invoice").
 * @returns {string} - The generated folder name (e.g., "users", "invoices").
 */
function getModuleFolderName(modelName) {
    // Convert the model name to lowercase for the folder name
    const lowerCaseName = modelName.toLowerCase();

    // Apply basic pluralization rules to form the folder name
    if (lowerCaseName.endsWith('y')) {
        // If the word ends in 'y', replace 'y' with 'ies' (e.g., "category" → "categories")
        return lowerCaseName.slice(0, -1) + 'ies';
    } else if (lowerCaseName.endsWith('s') || lowerCaseName.endsWith('x')) {
        // If the word ends in 's' or 'x', add 'es' (e.g., "box" → "boxes")
        return lowerCaseName + 'es';
    } else {
        // Default rule: add 's' (e.g., "user" → "users")
        return lowerCaseName + 's';
    }
}

/**
 * Generates a model name based on a singular noun.
 * Converts the name to PascalCase and applies basic pluralization rules.
 *
 * @param {string} singularName - The singular form of the entity (e.g., "user", "invoice").
 * @returns {string} - The generated model name (e.g., "UserModel", "InvoiceModel").
 */
function getModelName(singularName) {
    // Convert first letter to uppercase to follow PascalCase convention
    const pascalCase = singularName.charAt(0).toUpperCase() + singularName.slice(1);

    // Apply basic pluralization rules (similar to controller naming)
    if (singularName.endsWith('y')) {
        // If the word ends in 'y', replace 'y' with 'ies' (e.g., "category" → "CategoriesModel")
        return pascalCase.slice(0, -1) + 'iesModel';
    } else if (singularName.endsWith('s') || singularName.endsWith('x')) {
        // If the word ends in 's' or 'x', add 'es' (e.g., "box" → "BoxesModel")
        return pascalCase + 'esModel';
    } else {
        // Default rule: add 's' (e.g., "user" → "UsersModel")
        return pascalCase + 'sModel';
    }
}

/**
 * Generates a controller name based on a singular noun.
 * Converts the name to PascalCase and applies basic pluralization rules.
 *
 * @param {string} singularName - The singular form of the entity (e.g., "user", "invoice").
 * @returns {string} - The generated controller name (e.g., "UsersController", "InvoicesController").
 */
function getControllerName(singularName) {
    // Convert first letter to uppercase to follow PascalCase convention
    const pascalCase = singularName.charAt(0).toUpperCase() + singularName.slice(1);

    // Apply basic pluralization rules
    if (singularName.endsWith('y')) {
        // If the word ends in 'y', replace 'y' with 'ies' (e.g., "category" → "CategoriesController")
        return pascalCase.slice(0, -1) + 'iesController';
    } else if (singularName.endsWith('s') || singularName.endsWith('x')) {
        // If the word ends in 's' or 'x', add 'es' (e.g., "box" → "BoxesController")
        return pascalCase + 'esController';
    } else {
        // Default rule: add 's' (e.g., "user" → "UsersController")
        return pascalCase + 'sController';
    }
}

/**
 * Generates the file name for the data file based on the singular model name.
 * Converts the name to PascalCase and appends "Data" to it.
 *
 * @param {string} modelName - The singular form of the model name (e.g., "user", "invoice").
 * @returns {string} - The generated data file name (e.g., "UserData", "InvoiceData").
 */
function getDataFileName(modelName) {
    // Convert the first letter of the model name to uppercase to follow PascalCase convention
    const pascalCase = modelName.charAt(0).toUpperCase() + modelName.slice(1);

    // Append "Data" to the PascalCase model name to generate the file name
    return pascalCase + 'Data'; // e.g., "User" → "UserData"
}

/**
 * Generates a service name based on a singular model name.
 * Converts the name to PascalCase and applies basic pluralization rules.
 *
 * @param {string} modelName - The singular form of the model name (e.g., "user", "invoice").
 * @returns {string} - The generated service name (e.g., "UsersService", "InvoicesService").
 */
function getServiceName(modelName) {
    // Convert first letter to uppercase to follow PascalCase convention
    const pascalCase = modelName.charAt(0).toUpperCase() + modelName.slice(1);

    // Apply basic pluralization rules (similar to service naming)
    if (modelName.endsWith('y')) {
        // If the word ends in 'y', replace 'y' with 'ies' (e.g., "category" → "CategoriesService")
        return pascalCase.slice(0, -1) + 'iesService';
    } else if (modelName.endsWith('s') || modelName.endsWith('x')) {
        // If the word ends in 's' or 'x', add 'es' (e.g., "box" → "BoxesService")
        return pascalCase + 'esService';
    } else {
        // Default rule: add 's' (e.g., "user" → "UsersService")
        return pascalCase + 'sService';
    }
}

/**
 * Function to write a file to the specified folder.
 * 
 * @param {string} fileName - The name of the file (without extension).
 * @param {string} folderPath - The directory where the file will be saved.
 * @param {string} fileContent - The content to be written to the file.
 */
function writeFile(fileName, folderPath, fileContent) {
    // Construct the full file path
    const filePath = path.join(folderPath, `${fileName}`);

    // Write the file asynchronously
    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            console.error('Error creating the file:', err);
            process.exit(1); // Exit the process if an error occurs
        }

        console.info(`File "${fileName}.js" created successfully.`);
    });
}
/**
 * Function to read the content of a file (text or JSON).
 * @param {string} fileName - The name of the file to be read.
 * @param {string} folderPath - The folder path where the file is located.
 * @param {boolean} isJson - Flag indicating whether the file content is in JSON format. Defaults to false.
 * @returns {string|object} - Returns the content of the file (text or parsed JSON).
 */
function readFileContent(fileName, folderPath, isJson = false) {
    // Create the full path of the file by joining the folder path and file name
    const filePath = path.join(folderPath, fileName);

    try {
        // Read the file content synchronously
        const data = fs.readFileSync(filePath, 'utf8');

        if (isJson) {
            // If the content is JSON, parse it and return the parsed object
            return JSON.parse(data);
        } else {
            // If it's not JSON, return the raw text content
            return data;
        }
    } catch (err) {
        console.error('Error reading file:', err.message);
        return null;  // Return null if there was an error reading the file
    }
}

/**
 * Function to check if the folder exists, create it if not, and save the file.
 * @param {string} folderPath - The relative path where the folder is located.
 * @param {string} fileName - The name of the file to be saved.
 * @param {string} fileContent - The content to be written into the file.
 */
function handleSaveFile(folderPath, fileName, fileContent) {
    // Build the full folder path, ensuring it includes the base path
    const fullFolderPath = folderPath ?? "";

    // Check if the folder exists
    fs.access(fullFolderPath, fs.constants.F_OK, (err) => {
        if (err) {
            // If there is an error, the folder doesn't exist
            console.info(`The folder "${fullFolderPath}" does not exist. Creating it...`);

            // Create the folder if it doesn't exist
            fs.mkdir(fullFolderPath, { recursive: true }, (err) => {
                if (err) {
                    console.error('Error creating the folder:', err);
                    process.exit(1); // Exit if folder creation fails
                }
                console.info(`Folder "${fullFolderPath}" created successfully.`);

                // Once the folder is created, save the file
                writeFile(fileName, fullFolderPath, fileContent);
            });
        } else {
            // Folder already exists, proceed to save the file
            writeFile(fileName, fullFolderPath, fileContent);
        }
    });
}

module.exports = {
    getModelName,
    getControllerName,
    writeFile,
    readFileContent,
    handleSaveFile,
    getServiceName,
    getDataFileName,
    getModuleFolderName
};
