
  import { config } from '@/_config';  // Import the configuration (API URL)
  import { authHeader, handleResponse } from '@/_helpers';  // Import helper functions for authentication and handling responses
  
  const BASE_URL = config.API_URL + 'C:/Program Files/Git/Usuario';  // Construct the base URL using the API URL from the config and the provided endpoint
  
  // Define types for the request and response
  interface ItemRequest {
    esActivoUno: boolean;
    esActivoDos: boolean;
    id?: number;
  }

  interface ResponseData {
    // Add properties based on the response structure
  }

  export const UsuariosService = {
    showRecords,
    saveRecord,
    updateRecord,
    deleteRecord,
  };
  
  // GET function - Fetches records from the server
  /**
   * 
   * @param {ItemRequest} itemRequest - The request object containing parameters for fetching records.
   * @returns {Promise<ResponseData>} - A promise that resolves to the server response.
   */
  function showRecords(itemRequest: ItemRequest): Promise<ResponseData> {
    const requestOptions: RequestInit = {
      method: 'GET',  // HTTP method is GET
      headers: authHeader(),  // Use the authHeader function to get authentication headers
    };
  
    // Send a GET request to the server and return the response
    return fetch(BASE_URL + `/showRecords/${itemRequest.esActivoUno}/${itemRequest.esActivoDos}`, requestOptions)
      .then(handleResponse)  // Handle the server response
      .then((response: ResponseData) => response);  // Return the response data
  }
  
  // POST function - Saves a new record to the server
  /**
   * 
   * @param {ItemRequest} itemRequest - The model object containing data to be saved.
   * @returns {Promise<ResponseData>} - A promise that resolves to the server response.
   */
  function saveRecord(itemRequest: ItemRequest): Promise<ResponseData> {
    const requestOptions: RequestInit = {
      method: 'POST',  // HTTP method is POST
      headers: authHeader(),  // Use the authHeader function to get authentication headers
      body: JSON.stringify(itemRequest),  // Convert the itemRequest object to a JSON string for the request body
    };
  
    // Send a POST request to the server and return the response
    return fetch(BASE_URL + '/saveRecord', requestOptions)
      .then(handleResponse)  // Handle the server response
      .then((response: ResponseData) => response);  // Return the response data
  }
  
  // PUT function - Updates an existing record on the server
  /**
   * 
   * @param {ItemRequest} itemRequest - The model object containing updated data.
   * @returns {Promise<ResponseData>} - A promise that resolves to the server response.
   */
  function updateRecord(itemRequest: ItemRequest): Promise<ResponseData> {
    const requestOptions: RequestInit = {
      method: 'PUT',  // HTTP method is PUT
      headers: authHeader(),  // Use the authHeader function to get authentication headers
      body: JSON.stringify(itemRequest),  // Convert the itemRequest object to a JSON string for the request body
    };
  
    // Send a PUT request to the server and return the response
    return fetch(BASE_URL + '/updateRecord', requestOptions)
      .then(handleResponse)  // Handle the server response
      .then((response: ResponseData) => response);  // Return the response data
  }
  
  // DELETE function - Deletes a record from the server
  /**
   * 
   * @param {ItemRequest} itemRequest - The ID of the record to be deleted.
   * @returns {Promise<ResponseData>} - A promise that resolves to the server response.
   */
  function deleteRecord(itemRequest: ItemRequest): Promise<ResponseData> {
    const requestOptions: RequestInit = {
      method: 'DELETE',  // HTTP method is DELETE
      headers: authHeader(),  // Use the authHeader function to get authentication headers
    };
  
    // Send a DELETE request to the server and return the response
    return fetch(BASE_URL + `/deleteRecord/${itemRequest.id}`, requestOptions)
      .then(handleResponse)  // Handle the server response
      .then((response: ResponseData) => response);  // Return the response data
  }
