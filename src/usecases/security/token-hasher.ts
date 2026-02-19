export interface TokenHasher {
  hash(token: string): Promise<string>;
}
