export type UUIDVersion = 'v4' | 'v1';

export interface UUIDGeneratorOptions {
  version: UUIDVersion;
  uppercase?: boolean;
}
