/**
 * Standardized error handling for API responses
 */

/**
 * Process API error responses and extract error messages
 * @param {Error} error - The error object from API catch block
 * @param {string} entityName - The name of the entity being created/edited
 * @param {function} setErrorMessage - State setter for the general error message
 * @param {function} setFieldErrors - State setter for field-specific errors
 * @param {boolean} isEdit - Whether this is an edit operation (true) or create operation (false)
 */
export const handleApiError = (
  error,
  entityName,
  setErrorMessage,
  setFieldErrors,
  isEdit = false
) => {
  // Get the response data from the error object
  const responseData = error.response?.data;

  // Handle field-specific validation errors
  if (responseData?.errors && typeof responseData.errors === "object") {
    setFieldErrors(responseData.errors);

    // Use the provided detail message or generate a default one
    const errorDetail =
      responseData.detail ||
      `There were errors in your ${entityName.toLowerCase()} submission.`;

    setErrorMessage(errorDetail);
  }
  // Handle errors with a detail message but no field errors
  else if (responseData?.detail) {
    setErrorMessage(responseData.detail);
  }
  // Handle generic error case
  else {
    const action = isEdit ? "edit" : "create";
    setErrorMessage(
      `Failed to ${action} the ${entityName}. Make sure all fields are filled properly and try again.`
    );
  }
};
