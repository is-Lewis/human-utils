/**
 * UUID Version Metadata
 *
 * Provides user-friendly descriptions, use cases, and characteristics for each UUID version.
 * Used in the UI to help users choose the right UUID type for their needs.
 *
 * @module tools/uuid-generator/metadata
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { UUIDVersion } from './types';

export interface UUIDVersionMetadata {
  version: UUIDVersion;
  name: string;
  description: string;
  features: string[];
  useCases: string[];
  isDefault?: boolean;
}

export const UUID_VERSION_METADATA: Record<UUIDVersion, UUIDVersionMetadata> = {
  v4: {
    version: 'v4',
    name: 'Random',
    description:
      'Generates a completely random UUID using cryptographic random number generation. Most common and simple to use.',
    features: [
      'Cryptographically secure',
      'No privacy concerns',
      'Simple and reliable',
      'Most widely used',
    ],
    useCases: [
      'General-purpose unique identifiers',
      'Session tokens',
      'API keys',
      'When you just need a unique ID',
    ],
    isDefault: true,
  },
  v7: {
    version: 'v7',
    name: 'Timestamp-based',
    description:
      'Modern UUID with Unix timestamp embedded. Sortable by creation time and optimized for database indexes.',
    features: [
      'Sortable by creation time',
      'Database-friendly',
      'No privacy concerns',
      'Modern standard (2024)',
    ],
    useCases: [
      'Database primary keys',
      'Time-ordered records',
      'Distributed systems',
      'Event logs',
    ],
  },
  v1: {
    version: 'v1',
    name: 'Time-based (Legacy)',
    description:
      'Classic time-based UUID with timestamp and random node ID. Older standard but still widely supported.',
    features: [
      'Contains timestamp',
      'Sortable by time',
      'Privacy-friendly (random node)',
      'Legacy support',
    ],
    useCases: [
      'Legacy system compatibility',
      'When v7 is not available',
      'Time-ordered identifiers',
    ],
  },
  v5: {
    version: 'v5',
    name: 'Name-based',
    description:
      'Deterministic UUID generated from a namespace and name. Same input always produces the same UUID.',
    features: [
      'Deterministic (reproducible)',
      'No randomness needed',
      'Same input = same output',
      'Based on SHA-1 hashing',
    ],
    useCases: [
      'Generating UUIDs from URLs',
      'DNS name-based identifiers',
      'When consistency is needed',
      'Reproducible identifiers',
    ],
  },
};

export const HELP_ME_CHOOSE_GUIDE = [
  {
    icon: 'Dice5' as const,
    question: 'Just need a random ID?',
    recommendation: 'Use v4 (simplest, most common)',
  },
  {
    icon: 'Database' as const,
    question: 'Need sortable database IDs?',
    recommendation: 'Use v7 (timestamp-ordered)',
  },
  {
    icon: 'RefreshCw' as const,
    question: 'Same input = same UUID?',
    recommendation: 'Use v5 (deterministic)',
  },
  {
    icon: 'Clock' as const,
    question: 'Need legacy time-based support?',
    recommendation: 'Use v1 (classic standard)',
  },
];
