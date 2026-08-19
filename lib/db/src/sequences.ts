import { sql } from "drizzle-orm";
import { db } from "./index";

/**
 * Ensure performance-critical indexes exist.
 *
 * Each statement uses CREATE INDEX IF NOT EXISTS so it is fully idempotent —
 * safe on fresh databases, rolling deploys, and crash-restarts alike.
 */
export async function ensureIndexes(): Promise<void> {
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS blood_units_donor_id_idx
      ON blood_units (donor_id)
  `);
}

/**
 * Ensure PostgreSQL sequences exist for donor and blood-unit ID generation.
 *
 * Design choices:
 *
 *  1. Sequences are created ONCE with a START WITH value derived from the
 *     highest numeric suffix already in the corresponding table.  This means
 *     a database that received inserts under the old count-based generator
 *     will start the sequence just above its highest existing ID — never
 *     colliding with historical rows.
 *
 *  2. If a sequence already exists it is left completely untouched.  We never
 *     call setval() at startup.  Calling setval() at startup on a running
 *     system would rewind the sequence if another instance allocated IDs
 *     between our read and our write, re-introducing the collision risk.
 *
 *  3. Concurrent startups (rolling deploys, crash-restarts) race to CREATE the
 *     sequence.  The loser catches the "already exists" error and continues
 *     normally; the winner's START WITH value is already safe for both.
 *
 *  4. The table existence check makes this safe on a fresh database before the
 *     schema has been pushed (tables not yet created → max_val = 0 → sequence
 *     starts at 1, which is correct for an empty table).
 *
 * ID formats:
 *   donors:      D-<year>-<4-digit-num>   e.g. D-2026-0896
 *   blood_units: BW-<year>-<6-digit-num>  e.g. BW-2026-008822
 */
export async function ensureSequences(): Promise<void> {
  await db.execute(sql`
    DO $$
    DECLARE
      max_val BIGINT := 0;
    BEGIN
      -- Only act if the sequence does not exist yet.
      IF NOT EXISTS (
        SELECT 1 FROM pg_sequences WHERE sequencename = 'donors_id_seq'
      ) THEN
        -- Scan existing donors to find the highest numeric suffix so far.
        IF EXISTS (
          SELECT 1 FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'donors'
        ) THEN
          SELECT COALESCE(MAX(
            CASE WHEN donor_id ~ '^D-[0-9]+-[0-9]+$'
                 THEN CAST(SPLIT_PART(donor_id, '-', 3) AS BIGINT)
                 ELSE 0 END
          ), 0) INTO max_val FROM donors;
        END IF;

        BEGIN
          EXECUTE format(
            'CREATE SEQUENCE donors_id_seq START WITH %s',
            max_val + 1
          );
        EXCEPTION WHEN duplicate_object THEN
          -- A concurrent startup created it first; our computed value is
          -- equivalent, so no further action is needed.
          NULL;
        END;
      END IF;
    END $$
  `);

  await db.execute(sql`
    DO $$
    DECLARE
      max_val BIGINT := 0;
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_sequences WHERE sequencename = 'blood_units_id_seq'
      ) THEN
        IF EXISTS (
          SELECT 1 FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'blood_units'
        ) THEN
          SELECT COALESCE(MAX(
            CASE WHEN unit_id ~ '^BW-[0-9]+-[0-9]+$'
                 THEN CAST(SPLIT_PART(unit_id, '-', 3) AS BIGINT)
                 ELSE 0 END
          ), 0) INTO max_val FROM blood_units;
        END IF;

        BEGIN
          EXECUTE format(
            'CREATE SEQUENCE blood_units_id_seq START WITH %s',
            max_val + 1
          );
        EXCEPTION WHEN duplicate_object THEN
          NULL;
        END;
      END IF;
    END $$
  `);
}
