export class DesiError extends Error {
  constructor(message: string, public code?: string) {
    super(`🚫 Gadbad ho gayi: ${message}`);
    this.name = 'DesiError';
  }
}

export class ValidationError extends DesiError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}