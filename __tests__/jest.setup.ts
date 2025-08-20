import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Jest setup file for better test output formatting

// Create a more informative console.error for tests
const originalError = console.error;

console.error = jest.fn((...args) => {
  // Only log errors that aren't from our expected test scenarios
  const message = args.join(' ');
  
  // Skip logging expected test errors to reduce noise
  if (message.includes('Database connection failed') ||
      message.includes('Query execution failed') ||
      message.includes('Invalid article') ||
      message.includes('result.map is not a function') ||
      message.includes('Cannot read properties of null')) {
    // These are expected test scenarios, so we don't log them
    return;
  }
  
  // Log unexpected errors
  originalError(...args);
});

// Add custom console formatting for better test output
const originalLog = console.log;

console.log = jest.fn((...args) => {
  const message = args.join(' ');
  
  // Skip dotenv tips to reduce noise
  if (message.includes('dotenv@') && message.includes('tip:')) {
    return;
  }
  
  // Log other messages normally
  originalLog(...args);
});

// Optional: Add custom test result formatting
// You can add more setup here if needed