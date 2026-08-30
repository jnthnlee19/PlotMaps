import { getStore } from "@netlify/blobs";

const STORE_NAME = "adelton-homesites";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}

function cleanId(id) {
  const value = String(id || "").trim();
  return /^(P\d{2}|113|121)$/.test(value) ? value : null;
}

function safeRecordFrom(record) {
  return {
    plot:
      record.plot &&
      Array.isArray(record.plot.restricted)
        ? {
            ...record.plot,
            restricted: record.plot.restricted
              .map(cleanId)
              .filter(Boolean)
          }
        : { restricted: [] },

    data:
      record.data === null
        ? null
        : (record.data || null),

    meta:
      record.meta || {
        locked: false,
        lastSavedAt: "",
        overrideReason: "",
        overrideAt: ""
      }
  };
}

export default async (request) => {
  const store = getStore({
    name: STORE_NAME,
    consistency: "strong"
  });

  try {
    const url = new URL(request.url);

    if (request.method === "GET") {
      const requestedId = cleanId(
        url.searchParams.get("id")
      );

      // Single-homesite freshness check used immediately before Save.
      if (requestedId) {
        const entry = await store.getWithMetadata(
          requestedId,
          {
            type: "json",
            consistency: "strong"
          }
        );

        if (!entry) {
          return json({
            exists: false,
            id: requestedId,
            etag: null,
            record: null
          });
        }

        return json({
          exists: true,
          id: requestedId,
          etag: entry.etag,
          record: entry.data
        });
      }

      const { blobs } = await store.list();
      const state = {
        plots: {},
        data: {},
        meta: {}
      };
      const etags = {};

      for (const blob of blobs) {
        const id = cleanId(blob.key);
        if (!id) continue;

        etags[id] = blob.etag || null;

        const record = await store.get(id, {
          type: "json",
          consistency: "strong"
        });

        if (!record) continue;

        state.plots[id] =
          record.plot && Array.isArray(record.plot.restricted)
            ? record.plot
            : { restricted: [] };

        if (
          record.data !== null &&
          record.data !== undefined
        ) {
          state.data[id] = record.data;
        }

        state.meta[id] =
          record.meta || {
            locked: false,
            lastSavedAt: "",
            overrideReason: "",
            overrideAt: ""
          };
      }

      return json({
        hasData: blobs.length > 0,
        state,
        etags
      });
    }

    if (request.method === "POST") {
      const body = await request.json();

      const changes = Array.isArray(body?.changes)
        ? body.changes
        : [];

      if (!changes.length) {
        return json({
          ok: true,
          saved: 0,
          etags: {}
        });
      }

      let saved = 0;
      const etags = {};

      for (const change of changes) {
        const id = cleanId(change?.id);
        const record = change?.record;

        if (
          !id ||
          !record ||
          typeof record !== "object"
        ) {
          return json(
            {
              ok: false,
              error: "Invalid homesite update."
            },
            400
          );
        }

        const safeRecord =
          safeRecordFrom(record);

        let result;

        /*
         * PROTECTED SAVE
         *
         * If the browser tells us which version of the
         * homesite it originally opened, Netlify will
         * only save if that version is still current.
         *
         * This prevents two users from silently
         * overwriting each other's changes.
         */
        if (
          Object.prototype.hasOwnProperty.call(
            change,
            "expectedEtag"
          )
        ) {
          const expectedEtag =
            change.expectedEtag;

          /*
           * No ETag means the homesite didn't exist
           * when the user opened it.
           *
           * onlyIfNew prevents us from overwriting it
           * if someone created it in the meantime.
           */
          if (expectedEtag === null) {
            result = await store.setJSON(
              id,
              safeRecord,
              {
                onlyIfNew: true
              }
            );
          }

          /*
           * Existing homesite:
           * only save if its ETag still matches the
           * version the user originally opened.
           */
          else {
            result = await store.setJSON(
              id,
              safeRecord,
              {
                onlyIfMatch: expectedEtag
              }
            );
          }

          /*
           * Netlify rejected the write because the
           * homesite changed after the user opened it.
           */
          if (!result.modified) {
            const current =
              await store.getMetadata(
                id,
                {
                  consistency: "strong"
                }
              );

            return json(
              {
                ok: false,
                error:
                  "Homesite changed before save.",
                conflictId: id,
                currentEtag:
                  current?.etag || null
              },
              409
            );
          }
        }

        /*
         * Normal shared updates that aren't coming
         * through the protected homesite-save workflow.
         *
         * This keeps things such as manual restrictions
         * working normally.
         */
        else {
          result = await store.setJSON(
            id,
            safeRecord
          );
        }

        saved += 1;

        etags[id] =
          result.etag || null;
      }

      return json({
        ok: true,
        saved,
        etags
      });
    }

    if (request.method === "DELETE") {
      const { deletedBlobs } =
        await store.deleteAll();

      return json({
        ok: true,
        deleted: deletedBlobs
      });
    }

    return json(
      {
        ok: false,
        error: "Method not allowed."
      },
      405
    );
  }

  catch (error) {
    console.error(error);

    return json(
      {
        ok: false,
        error:
          "Shared storage request failed."
      },
      500
    );
  }
};
