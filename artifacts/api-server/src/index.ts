import app from "./app";
import { logger } from "./lib/logger";
import {
  ensureSequences,
  ensureDemoData,
  ensureFacilities,
  ensureIndexes,
  ensureLabDemoData,
  ensureLabLedgerHeads,
} from "@workspace/db";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Create DB sequences, indexes, facilities and ensure demo data exist before
// accepting requests. All functions are idempotent (CREATE IF NOT EXISTS / ON CONFLICT).
ensureSequences()
  .then(() => ensureFacilities())
  .then(() => ensureIndexes())
  .then(() => ensureDemoData())
  .then(() => ensureLabDemoData())
  .then(() => ensureLabLedgerHeads())
  .then(() => {
    logger.info("DB schema, sequences, facilities and demo data ready");
    app.listen(port, (err) => {
      if (err) {
        logger.error({ err }, "Error listening on port");
        process.exit(1);
      }

      logger.info({ port }, "Server listening");
    });
  })
  .catch((err) => {
    logger.error({ err }, "Failed to initialize DB sequences");
    process.exit(1);
  });
