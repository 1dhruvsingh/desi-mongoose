export class DesiValidator {
  static jaruri = (value: any): boolean => {
    return value !== undefined && value !== null;
  };

  static email = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  static mobile = (value: string): boolean => {
    return /^[0-9]{10}$/.test(value);
  };

  static minLength = (length: number) => (value: string): boolean => {
    return value.length >= length;
  };

  static maxLength = (length: number) => (value: string): boolean => {
    return value.length <= length;
  };
}