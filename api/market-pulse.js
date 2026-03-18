import { getSeedMap } from "../src/lib/marketPulse.js";

const headers = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store, max-age=0, must-revalidate",
};

function isAllowedRequest(request) {
  const url = new URL(request.url);
  const requestOrigin = url.origin;
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const secFetchSite = request.headers.get("sec-fetch-site");
  const secFetchMode = request.headers.get("sec-fetch-mode");
  const secFetchDest = request.headers.get("sec-fetch-dest");

  if (origin && origin !== requestOrigin) {
    return false;
  }

  if (referer) {
    try {
      if (new URL(referer).origin !== requestOrigin) {
        return false;
      }
    } catch {
      return false;
    }
  }

  if (secFetchSite && !["same-origin", "same-site"].includes(secFetchSite)) {
    return false;
  }

  if (secFetchMode === "navigate" || secFetchDest === "document") {
    return false;
  }

  return Boolean(origin || referer || secFetchSite === "same-origin" || secFetchSite === "same-site");
}

async function buildResponse(request) {
  if (!isAllowedRequest(request)) {
    return Response.json(
      {
        error: "Forbidden",
      },
      {
        status: 403,
        headers,
      },
    );
  }

  try {
    const payload = await getSeedMap();
    return Response.json(payload, {
      status: 200,
      headers,
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Market pulse unavailable",
      },
      {
        status: 500,
        headers,
      },
    );
  }
}

export async function GET(request) {
  return buildResponse(request);
}

export default {
  async fetch(request) {
    return buildResponse(request);
  },
};
