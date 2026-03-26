export const fallbackSeed = {
  kmi30: { value: "Live", change: "Latest", asOf: "Official feed" },
  gold: { value: "Loading", change: "Latest", asOf: "Live feed" },
  silver: { value: "Loading", change: "Latest", asOf: "Live feed" },
  crude: { value: "Loading", change: "Latest", asOf: "Live feed" },
  kibor: { value: "Live", change: "Latest", asOf: "Official feed" },
  usdPkr: { value: "Loading", change: "Latest", asOf: "Live feed" },
};

const TOLA_PER_TROY_OUNCE = 0.375;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const shortDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "2-digit",
  timeZone: "Asia/Karachi",
});

const shortTimeFormatter = new Intl.DateTimeFormat("en-PK", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Karachi",
});

async function fetchText(url, headers = {}) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Compound PK market pulse",
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

async function fetchJson(url, headers = {}) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Compound PK market pulse",
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.json();
}

function formatNumber(value) {
  return currencyFormatter.format(value);
}

function formatPkr(value) {
  return `PKR ${formatNumber(value)}`;
}

function formatUsd(value) {
  return `USD ${formatNumber(value)}`;
}

function formatPercentChange(value) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function formatFixedNumber(value, digits = 2) {
  return Number(value).toFixed(digits);
}

function formatSignedChange(value, prefix = "") {
  return `${value >= 0 ? "+" : "-"}${prefix}${formatNumber(Math.abs(value))}`;
}

function normalizePercentLabel(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith("+") || trimmed.startsWith("-")) {
    return trimmed;
  }

  return `+${trimmed}`;
}

function formatShortDate(date) {
  return shortDateFormatter.format(date).replace(/ /g, "-");
}

function formatShortTime(date) {
  return shortTimeFormatter.format(date);
}

function getKarachiDayKey(date) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Karachi",
  }).format(date);
}

function parseLooseDate(value) {
  const nativeDate = new Date(value);
  if (!Number.isNaN(nativeDate.valueOf())) {
    return nativeDate;
  }

  const shortDateMatch = value.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2,4})$/);
  if (!shortDateMatch) {
    return undefined;
  }

  const [, day, month, year] = shortDateMatch;
  const monthIndex = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ].indexOf(month.toLowerCase());

  if (monthIndex === -1) {
    return undefined;
  }

  const fullYear = year.length === 2 ? 2000 + Number(year) : Number(year);
  const parsedDate = new Date(Date.UTC(fullYear, monthIndex, Number(day), 12, 0, 0));

  return Number.isNaN(parsedDate.valueOf()) ? undefined : parsedDate;
}

function formatUpdateStamp(input) {
  const parsedDate =
    input instanceof Date
      ? input
      : typeof input === "string"
        ? parseLooseDate(input)
        : new Date(input);

  if (!parsedDate || Number.isNaN(parsedDate.valueOf())) {
    return "Live";
  }

  return getKarachiDayKey(parsedDate) === getKarachiDayKey(new Date())
    ? formatShortTime(parsedDate)
    : formatShortDate(parsedDate);
}

async function getYahooQuote(symbol) {
  const payload = await fetchJson(
    `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`,
  );

  const meta = payload.chart?.result?.[0]?.meta;
  if (meta?.regularMarketPrice == null) {
    throw new Error(`${symbol} quote unavailable`);
  }

  const previousClose = meta.chartPreviousClose ?? meta.regularMarketPrice;
  const changePercent =
    previousClose === 0
      ? 0
      : ((meta.regularMarketPrice - previousClose) / previousClose) * 100;
  const marketTime = meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000) : undefined;

  return {
    regularMarketPrice: meta.regularMarketPrice,
    previousClose,
    changePercent,
    asOf: marketTime ? formatUpdateStamp(marketTime) : "Live",
  };
}

async function getYahooPageQuote(symbol) {
  const html = await fetchText(`https://finance.yahoo.com/quote/${encodeURIComponent(symbol)}`);
  const matches = html.matchAll(
    /<script type="application\/json" data-sveltekit-fetched[^>]*>(.*?)<\/script>/gs,
  );

  for (const match of matches) {
    try {
      const payload = JSON.parse(match[1]);
      const body = payload?.body ? JSON.parse(payload.body) : undefined;
      const quote = body?.quoteResponse?.result?.find((entry) => entry.symbol === symbol);

      if (quote?.regularMarketPrice?.raw == null) {
        continue;
      }

      return {
        regularMarketPrice: quote.regularMarketPrice.raw,
        changePercent:
          quote.regularMarketChangePercent?.raw ??
          (quote.regularMarketPreviousClose?.raw
            ? ((quote.regularMarketPrice.raw - quote.regularMarketPreviousClose.raw) /
                quote.regularMarketPreviousClose.raw) *
              100
            : 0),
        asOf: quote.regularMarketTime?.raw
          ? formatUpdateStamp(new Date(quote.regularMarketTime.raw * 1000))
          : "Live",
      };
    } catch {
      continue;
    }
  }

  throw new Error(`${symbol} page quote unavailable`);
}

async function getGoogleFinanceUsdPkrQuote() {
  const html = await fetchText("https://www.google.com/finance/quote/USD-PKR");
  const currentMatch = html.match(/data-last-price="([\d.]+)"/);
  const previousCloseMatch = html.match(
    /USD \/ PKR",3,null,\[([\d.]+),([\d.-]+),([\d.-]+),\d+,\d+,\d+\],null,([\d.]+)/,
  );
  const timestampMatch = html.match(/data-last-normal-market-timestamp="(\d+)"/);

  if (!currentMatch?.[1] || !previousCloseMatch?.[4]) {
    throw new Error("Google Finance USD/PKR unavailable");
  }

  const regularMarketPrice = Number(currentMatch[1]);
  const previousClose = Number(previousCloseMatch[4]);
  const quoteTime = timestampMatch?.[1] ? new Date(Number(timestampMatch[1]) * 1000) : undefined;

  return {
    regularMarketPrice,
    previousClose,
    asOf: quoteTime ? formatUpdateStamp(quoteTime) : "Live",
  };
}

async function getKmi30Seed() {
  const html = await fetchText("https://dps.psx.com.pk/dataportal/");
  const match = html.match(
    /KMI30<\/div><div class="topIndices__item__val">([^<]+)<\/div><\/div><div class="[^"]+"><div class="topIndices__item__change"><i class="[^"]+"><\/i>\s*([^<]+)<\/div><div class="topIndices__item__changep">\(([^)]+)\)/,
  );

  if (!match) {
    throw new Error("KMI30 not found");
  }

  const [, value, , changePercent] = match;
  const numericValue = Number(value.replace(/,/g, ""));

  return {
    value: Number.isFinite(numericValue) ? formatNumber(numericValue) : value.trim(),
    change: normalizePercentLabel(changePercent),
    asOf: formatUpdateStamp(new Date()),
  };
}

async function getSbpFerSeed() {
  const html = await fetchText("https://www.sbp.org.pk/ecodata/FER/index.asp");

  const kiborMatch = html.match(
    /KIBOR<br\/>\s*<span[^>]*>As on ([^<]+)<\/span><\/strong>.*?<strong>3-M<\/strong>.*?<strong>([\d.]+)<\/strong>.*?<strong>([\d.]+)<\/strong>/s,
  );
  const m2mMatch = html.match(
    /As on\s*([^<]+)<\/span>.*?M2M.*?Revaluation Rate.*?<span[^>]*>([\d.]+)<\/span>.*?Bid:.*?<span[^>]*>([\d.]+)<\/span>.*?Offer:.*?<p[^>]*>([\d.]+)<\/p>/s,
  );

  return {
    kibor:
      kiborMatch && kiborMatch[1] && kiborMatch[2] && kiborMatch[3]
        ? {
            value: `${kiborMatch[2]}%`,
            change: formatPercentChange(
              ((Number(kiborMatch[3]) - Number(kiborMatch[2])) / Number(kiborMatch[2])) * 100,
            ),
            asOf: formatUpdateStamp(kiborMatch[1].trim()),
          }
        : undefined,
    usdPkr:
      m2mMatch && m2mMatch[1] && m2mMatch[2] && m2mMatch[3] && m2mMatch[4]
        ? {
            value: m2mMatch[2].trim(),
            change: "Official ref",
            asOf: formatUpdateStamp(m2mMatch[1].trim()),
          }
        : undefined,
  };
}

async function getGoldSeed(symbol) {
  const yahooSymbol = symbol === "XAU" ? "GC=F" : "SI=F";
  const [fxPayload, payload, yahooQuote, fxQuote] = await Promise.all([
    fetchJson("https://open.er-api.com/v6/latest/USD"),
    fetchJson(`https://api.gold-api.com/price/${symbol}`),
    getYahooQuote(yahooSymbol),
    getYahooQuote("PKR=X"),
  ]);

  const date = new Date(payload.updatedAt);
  const pkrRate = fxPayload.rates?.PKR ?? 0;
  const pkrValue = pkrRate > 0 ? payload.price * pkrRate : payload.price;
  const pkrPerTola = pkrValue * TOLA_PER_TROY_OUNCE;
  const previousPkrPerTola =
    yahooQuote.previousClose > 0 && fxQuote.previousClose > 0
      ? yahooQuote.previousClose * fxQuote.previousClose * TOLA_PER_TROY_OUNCE
      : pkrPerTola;

  return {
    value: formatPkr(pkrPerTola),
    change: formatSignedChange(pkrPerTola - previousPkrPerTola, "PKR "),
    asOf: Number.isNaN(date.valueOf()) ? yahooQuote.asOf : formatUpdateStamp(date),
  };
}

async function getCrudeSeed() {
  const crudeQuotes = [
    () => getYahooPageQuote("BZ=F"),
    () => getYahooQuote("BZ=F"),
    () => getYahooQuote("CL=F"),
  ];
  let lastError;

  for (const getQuote of crudeQuotes) {
    try {
      const quote = await getQuote();

      return {
        value: formatUsd(quote.regularMarketPrice),
        change: formatPercentChange(quote.changePercent),
        asOf: quote.asOf,
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Crude quote unavailable");
}

async function getUsdPkrSeed() {
  try {
    const googleQuote = await getGoogleFinanceUsdPkrQuote();

    return {
      value: formatNumber(googleQuote.regularMarketPrice),
      change: formatSignedChange(googleQuote.regularMarketPrice - googleQuote.previousClose),
      asOf: googleQuote.asOf,
    };
  } catch {
    const [payload, yahooQuote] = await Promise.all([
      fetchJson("https://open.er-api.com/v6/latest/USD"),
      getYahooQuote("PKR=X"),
    ]);

    if (!payload.rates?.PKR) {
      throw new Error("USD/PKR unavailable");
    }

    return {
      value: formatNumber(payload.rates.PKR),
      change: formatSignedChange(payload.rates.PKR - yahooQuote.previousClose),
      asOf: payload.time_last_update_utc ? formatUpdateStamp(payload.time_last_update_utc) : "Live",
    };
  }
}

export async function getSeedMap() {
  const result = { ...fallbackSeed };
  const tasks = await Promise.allSettled([
    getKmi30Seed(),
    getGoldSeed("XAU"),
    getGoldSeed("XAG"),
    getCrudeSeed(),
    getSbpFerSeed(),
    getUsdPkrSeed(),
  ]);

  if (tasks[0].status === "fulfilled") {
    result.kmi30 = tasks[0].value;
  }

  if (tasks[1].status === "fulfilled") {
    result.gold = tasks[1].value;
  }

  if (tasks[2].status === "fulfilled") {
    result.silver = tasks[2].value;
  }

  if (tasks[3].status === "fulfilled") {
    result.crude = tasks[3].value;
  }

  if (tasks[4].status === "fulfilled") {
    if (tasks[4].value.kibor) {
      result.kibor = tasks[4].value.kibor;
    }

    if (tasks[4].value.usdPkr) {
      result.usdPkr = tasks[4].value.usdPkr;
    }
  }

  if (tasks[5].status === "fulfilled") {
    result.usdPkr = {
      ...result.usdPkr,
      ...tasks[5].value,
    };
  }

  return result;
}
