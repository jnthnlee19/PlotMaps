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

export default async (request) => {
  const store = getStore({
    name: STORE_NAME,
    consistency: "strong"
  });

  try {
    if (request.method === "GET") {
      const { blobs } = await store.list();
      const state = {
        plots: {},
        data: {},
        meta: {}
      };

      for (const blob of blobs) {
        const id = cleanId(blob.key);
        if (!id) continue;

        const record = await store.get(id, {
          type: "json",
          consistency: "strong"
        });

        if (!record) continue;

        state.plots[id] =
          record.plot && Array.isArray(record.plot.restricted)
            ? record.plot
            : { restricted: [] };

        if (record.data !== null && record.data !== undefined) {
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
        state
      });
    }

    if (request.method === "POST") {
      const body = await request.json();
      const changes = Array.isArray(body?.changes)
        ? body.changes
        : [];

      if (!changes.length) {
        return json({ ok: true, saved: 0 });
      }

      let saved = 0;

      for (const change of changes) {
        const id = cleanId(change?.id);
        const record = change?.record;

        if (!id || !record || typeof record !== "object") {
          return json(
            { ok: false, error: "Invalid homesite update." },
            400
          );
        }

        const safeRecord = {
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

        await store.setJSON(id, safeRecord);
        saved += 1;
      }

      return json({
        ok: true,
        saved
      });
    }

    if (request.method === "DELETE") {
      const { deletedBlobs } = await store.deleteAll();

      return json({
        ok: true,
        deleted: deletedBlobs
      });
    }

    return json(
      { ok: false, error: "Method not allowed." },
      405
    );
  } catch (error) {
    console.error(error);

    return json(
      {
        ok: false,
        error: "Shared storage request failed."
      },
      500
    );
  }
};
