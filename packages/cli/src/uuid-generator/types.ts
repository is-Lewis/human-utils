export type UUIDVersion = 'v1' | 'v4' | 'v5' | 'v7';

export interface UUIDGeneratorOptions {
  version: UUIDVersion;
  uppercase?: boolean;
}

export interface UUIDV5Options {
  namespace: string;
  name: string;
}

// Standard UUID v5 namespaces from RFC 4122
export const UUID_NAMESPACES = {
  DNS: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  URL: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
  OID: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
  X500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
} as const;
