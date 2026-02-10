import bcrypt from "bcrypt";
import { PasswordHasher } from "../../usecases/security/password-hasher";

export class BcryptPasswordHasher implements PasswordHasher {
  public hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }
  public compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
