export interface TokenGenerator {
  generateRandomToken(): Promise<string>;
  generateResetPasswordToken(): Promise<string>;
}
