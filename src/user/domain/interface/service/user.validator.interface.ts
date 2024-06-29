export interface IUserValidator {
  validateUserExists(userId: number): Promise<void>;
}
