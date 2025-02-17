const fs = require('fs')
const { handleSaveFile } = require('.');

/**
 * Builds a file based on the provided responses and saves it to the specified location.
 * This function calls another function to generate the file content and then saves the file.
 *
 * @param {Object} responses - The data used to build the file.
 * @param {string} responses.path - The directory path where the file should be saved.
 * @param {string} responses.fileName - The name of the file to be saved.
 * @param {Object} responses - Contains additional details such as properties for the model.
 */
function buildFile(responses) {
    // Generate the content of the file using the provided responses
    const fileContent = buildFileContent(responses);

    // Save the generated file content to the specified path with the given file name
    handleSaveFile(responses.path, responses.fileName, fileContent);
}

/**
 * Builds the content for a JavaScript model file based on the provided responses.
 * This function generates code for headers, props, getters & setters, and constructor logic.
 *
 * @param {Object} responses - The data used to build the model.
 * @param {string} responses.controllerName - The name of the controller.
 * @param {string} responses.modelName - The name of the model.
 * @param {Object} responses.props - An object representing the properties of the model.
 * @param {string} responses.includeHeaders - Determines if table headers should be included ("y" for yes).
 * @param {boolean} responses.includeGetsSets - Determines if getters and setters should be included.
 * @returns {string} The generated model file content as a string.
 */
function buildFileContent(responses) {
    // Build the headers if specified
    let generatedHeaders = "";

    // Check if headers need to be included
    if (responses.includeHeaders === "y") {
        // Map through the properties and create headers, applying transformations for specific cases
        let headers = Object.entries(responses.props).map(([propName]) => {
            const regex = /^cc.*Id$/;  // Regular expression for properties ending with 'cc' and 'Id'
            if (regex.test(propName)) {
                // For properties that match 'cc...Id', remove the 'cc' and 'Id' from the name
                let text = propName.replace(/^cc(.*)Id$/, '$1');
                let value = propName.replace(/(.*)Id$/, '$1'); // Remove 'Id' from the property name
                return { text: text, value: value };
            } else {
                // Default transformation: separate camel case words with a space and capitalize the first letter
                let text = propName.replace(/([a-z])([A-Z])/g, '$1 $2');
                text = text.charAt(0).toUpperCase() + text.slice(1); // Capitalize the first letter
                return { text: text, value: propName }; // Return the transformed header
            }
        });

        // Join the headers into a string
        generatedHeaders = headers.map(header => `    {
            text: "${header.text}",
            value: "${header.value}"
        }`).join(',\n');
    }

    // Build the getters & setters if specified
    let generatedGetsSets = "";

    if (responses.includeGetsSets) {
        // Generate getter and setter for each property
        generatedGetsSets = Object.entries(responses.props).map(([propName]) => `    get _${propName}() {
        return store.state[this.CONTROLLER].item.${propName};
    }
    set _${propName}(value) {
        store.dispatch(this.CONTROLLER.concat('/updateProps'), { prop: "${propName}", value });
    }`).join('\n');
    }

    // Build the property declarations
    const generatedProps = Object.entries(responses.props)
        .map(([propName, propValue]) => `    ${propName} = ${JSON.stringify(propValue)};`) // Assign the default value
        .join('\n');

    // Build the constructor property assignments from the item data
    const generatedConstructorProps = Object.entries(responses.props)
        .map(([propName, propValue]) => `            this.${propName} = item.${propName} ?? ${JSON.stringify(propValue)};`) // Assign item data or default values
        .join('\n');

    // Build alternative constructor property assignments if no item is provided
    const generatedAlterConstructorProps = Object.entries(responses.props)
        .map(([propName, propValue]) => `            this.${propName} = ${JSON.stringify(propValue)};`) // Assign default values
        .join('\n');

    // Create the content for the model file
    return `import { store } from '@/_store';
import EntityModel from './EntityModel';
const CONTROLLER = "${responses.controllerName}";

export default class ${responses.modelName} extends EntityModel {
${generatedProps}

    // Constructor: Initializes the model with item data or default values
    constructor(item) {
        super(CONTROLLER);
        if (item) {
            // If an item is provided, assign properties from it
${generatedConstructorProps}
        } else {
            // If no item is provided, use default values
${generatedAlterConstructorProps}
        }
    }

${generatedGetsSets}

    // Method to return table headers for the model
    getTableHeaders() {
        return [
${generatedHeaders}
        ]
    }
}
`;
}

module.exports = { buildFile };
