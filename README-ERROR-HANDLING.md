# API Error Handling Implementation Guide

This document provides instructions for standardizing error handling across all Create and Edit pages in the application.

## Overview

We've created a utility function in `src/util/errorHandling.js` that standardizes error handling for API responses. This function handles different error response formats and displays both general error messages and field-specific validation errors.

## Implementation Steps for Each Page

### 1. Import the Error Handling Utility

Add the following import to your page component:

```javascript
import { handleApiError } from "../../util/errorHandling";
```

### 2. Add Field Errors State

Ensure your component has a state variable to track field-specific errors:

```javascript
const [fieldErrors, setFieldErrors] = useState({});
```

### 3. Clear Error States Before Submission

Reset error states when submitting the form:

```javascript
setErrorMessage(null);
setFieldErrors({});
```

### 4. Update Error Handling in API Catch Block

Replace your existing error handling code with the utility function:

```javascript
try {
  // Your API call here
  await api.post(endpoint, data);
  toast.success("Success message");
  navigate(redirectPath);
} catch (error) {
  // Use the utility function
  handleApiError(error, entityName, setErrorMessage, setFieldErrors, isEdit);
  toast.error("Error message");
  setIsSubmitting(false);
}
```

The parameters for `handleApiError` are:

- `error`: The error object from the catch block
- `entityName`: Name of the entity (e.g., "Fabric", "Blog")
- `setErrorMessage`: State setter for general error message
- `setFieldErrors`: State setter for field-specific errors
- `isEdit`: Boolean flag (true for edit pages, false for create pages)

### 5. Display the General Error Message

Add this near the top of your form:

```jsx
{
  errorMessage && <div className="error-message">{errorMessage}</div>;
}
```

### 6. Update Form Inputs to Display Field Errors

For each input field, add error classes and error message display:

```jsx
<div className="form-group">
  <label htmlFor="fieldName">Field Label</label>
  <input
    type="text"
    id="fieldName"
    name="fieldName"
    value={formData.fieldName}
    onChange={handleInputChange}
    className={fieldErrors.fieldName ? "input-error" : ""}
  />
  {fieldErrors.fieldName && (
    <div className="field-error">{fieldErrors.fieldName}</div>
  )}
</div>
```

The CSS classes `input-error` and `field-error` are already defined in both the CreatePages.css and EditPages.css files.

## Example Implementation

For reference, see the implementations in:

- `src/pages/CreatePages/CreatePageTemplate.jsx`
- `src/pages/EditPages/EditPageTemplate.jsx`
- `src/pages/CreatePages/CreateFabricPage.jsx`

## Using with the Template Components

If you're using the `CreatePageTemplate` or `EditPageTemplate` components, they already implement error handling. Just make sure to pass the following props:

- `entityName`: For customizing error messages (e.g., "Fabric", "Blog")
- `fieldErrors`: For displaying field-specific validation errors

## Testing

Test your implementation by deliberately causing validation errors:

- Try submitting a form with missing required fields
- Try creating an entity with a duplicate identifier (e.g., item_code for fabrics)
- Check that both general and field-specific error messages are displayed correctly
