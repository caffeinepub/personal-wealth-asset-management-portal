export function getStorageErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // User-friendly messages for common errors
    if (message.includes('indexeddb')) {
      return 'Storage is unavailable. Please ensure you are running the app through a local server (not by opening index.html directly).';
    }
    
    if (message.includes('blocked')) {
      return 'Storage is blocked. Please close other tabs running this app and try again.';
    }
    
    if (message.includes('quota') || message.includes('storage')) {
      return 'Storage quota exceeded. Please clear some data or free up disk space.';
    }
    
    if (message.includes('transaction')) {
      return 'Storage transaction failed. Please try again.';
    }
    
    if (message.includes('settled match')) {
      return 'Cannot modify a settled match. Please create a new match instead.';
    }
    
    // Return the original error message if it's already user-friendly
    if (message.includes('failed to')) {
      return error.message;
    }
  }
  
  return 'An unexpected error occurred. Please try again.';
}

export function logStorageError(operation: string, error: unknown, context?: any): void {
  console.error(`Storage error during ${operation}:`, {
    error,
    context,
    timestamp: new Date().toISOString(),
  });
}
