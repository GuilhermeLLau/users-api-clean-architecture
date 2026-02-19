export interface RefreshTokenGenerator {
  generate(): Promise<string>;
}
