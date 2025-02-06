export class CustomAuthError extends Error {
    type: string;
  
    constructor(message: string, type: string) {
      super(message);
      this.type = type;
      this.name = 'CustomAuthError';
    }
  }
  