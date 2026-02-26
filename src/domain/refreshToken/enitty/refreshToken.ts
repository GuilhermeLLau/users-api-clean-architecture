export type RefreshTokenProps = {
  id: string;
  tokenHash: string;
  userId: string;

  expiresAt: Date;
  revoked: boolean;
  revokedAt?: Date | null;

  createdAt: Date;
};

export class RefreshToken {
  private constructor(private props: RefreshTokenProps) {}

  public static build(tokenHash: string, userId: string) {
    const now = new Date();
    const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return new RefreshToken({
      id: crypto.randomUUID().toString(),
      tokenHash,
      userId,
      expiresAt: expires,
      revoked: false,
      revokedAt: null,
      createdAt: now,
    });
  }

  public static with(props: RefreshTokenProps) {
    return new RefreshToken(props);
  }

  public get id() {
    return this.props.id;
  }

  public get tokenHash() {
    return this.props.tokenHash;
  }

  public get userId() {
    return this.props.userId;
  }

  public get expiresAt() {
    return this.props.expiresAt;
  }

  public get revoked() {
    return this.props.revoked;
  }

  public get revokedAt() {
    return this.props.revokedAt;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public revokeTokenHash() {
    this.props.revoked = true;
    this.props.revokedAt = new Date();
  }
}
