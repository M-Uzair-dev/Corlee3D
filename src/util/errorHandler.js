import { toast } from "sonner";

export const handleApiError = (error, defaultMessage = "An error occurred") => {
  console.error("API Error:", error);

  // Extract error message from different possible locations
  let errorMessage = defaultMessage;

  if (error.response?.data?.error) {
    errorMessage = error.response.data.error;
  } else if (error.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error.message) {
    errorMessage = error.message;
  }

  // Show error toast
  toast.error(errorMessage);

  // Return the error message for further handling if needed
  return errorMessage;
};

export const handleApiSuccess = (message = "Operation successful") => {
  toast.success(message);
};
