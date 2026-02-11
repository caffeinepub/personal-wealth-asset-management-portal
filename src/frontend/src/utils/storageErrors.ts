export function getStorageErrorMessage(error: unknown): string {
  if (!error) return 'Unknown storage error';

  const errorMessage = error instanceof Error ? error.message : String(error);

  // IndexedDB specific errors
  if (errorMessage.includes('blocked')) {
    return 'Storage is blocked. Please close other tabs and try again.';
  }

  if (errorMessage.includes('QuotaExceededError') || errorMessage.includes('quota')) {
    return 'Storage quota exceeded. Please free up space.';
  }

  if (errorMessage.includes('VersionError')) {
    return 'Storage version conflict. Please refresh the page.';
  }

  if (errorMessage.includes('InvalidStateError')) {
    return 'Storage is not available. Please ensure you are using a supported browser.';
  }

  if (errorMessage.includes('NotFoundError')) {
    return 'Storage not found. Data may have been cleared.';
  }

  if (errorMessage.includes('settled match')) {
    return 'Cannot modify a settled match.';
  }

  // File protocol detection
  if (window.location.protocol === 'file:') {
    return 'Storage requires a web server. Please use the provided local server scripts.';
  }

  // Generic fallback
  return 'Storage operation failed. Please try again.';
}

export function logStorageError(operation: string, error: unknown): void {
  console.error(`Storage error during ${operation}:`, error);
  
  if (error instanceof Error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  }
}
