import axios from "axios";

export function notifyError(error, customMessage: string = 'Operation failed', output = console.error) {
  console.error(`${customMessage}:`, error);

  let errorMessage;
  if (axios.isAxiosError(error)) {
    errorMessage = `${customMessage}: ${error.response?.data.error}`;
  } else if (error.message) {
    errorMessage = `${customMessage}: ${error.message}`;
  } else if (error.error) {
    errorMessage = `${customMessage}: ${error.error}`;
  } else {
    errorMessage = `${customMessage}: ${error}`;
  }

  output(errorMessage, {type: 'error'});
}