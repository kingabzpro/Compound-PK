import { getSeedMap } from "../src/lib/marketPulse";

export default async function handler(_request: any, response: any) {
  try {
    const payload = await getSeedMap();

    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Cache-Control", "no-store, max-age=0, must-revalidate");

    return response.status(200).json(payload);
  } catch (error) {
    return response.status(500).json({
      error:
        error instanceof Error ? error.message : "Market pulse unavailable",
    });
  }
}
