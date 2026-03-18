import { getSeedMap } from "../src/lib/marketPulse.js";

const headers = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store, max-age=0, must-revalidate",
};

async function buildResponse() {
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

export async function GET() {
  return buildResponse();
}

export default {
  async fetch() {
    return buildResponse();
  },
};
