const DELHIVERY_API_BASE = "https://track.delhivery.com";

function getToken() {
  return process.env.DELHIVERY_TOKEN || "";
}

function hasCredentials() {
  return Boolean(getToken());
}

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Token ${getToken()}`,
  };
}

function normalizeScan(scan) {
  return {
    location: scan?.Location || scan?.location || null,
    dateTime: scan?.ScannedDateTime || scan?.scannedDateTime || scan?.date || null,
    status: scan?.Status || scan?.status || null,
    statusText: scan?.StatusText || scan?.scanType || scan?.scan || null,
    scanType: scan?.scanType || scan?.ScanType || null,
    remarks: scan?.Remarks || scan?.remarks || null,
  };
}

export function normalizeScans(shipmentData) {
  const scans = shipmentData?.[0]?.Scans;
  if (!Array.isArray(scans)) return [];
  return scans
    .map(normalizeScan)
    .filter((s) => s.status || s.statusText || s.location)
    .reverse();
}

function detectDelivered(scans) {
  return scans.some((s) => {
    const text = `${s.status || ""} ${s.statusText || ""}`.toLowerCase();
    return (
      text.includes("delivered") ||
      text.includes("delivered to") ||
      (text.includes("out for delivery") && false)
    );
  });
}

function deriveStatus(scans) {
  if (scans.length === 0) return "N/A";
  const latest = scans[scans.length - 1] || scans[0];
  const text = `${latest.status || ""} ${latest.statusText || ""}`.toLowerCase();

  if (text.includes("delivered")) return "Delivered";
  if (text.includes("out for delivery")) return "Out for Delivery";
  if (text.includes("in transit") || text.includes("reached") || text.includes("hub")) return "In Transit";
  if (text.includes("picked up") || text.includes("pickup") || text.includes("manifested")) return "Picked Up";
  if (text.includes("booked") || text.includes("accepted") || text.includes("created")) return "Booked";
  return "In Transit";
}

export async function createDelhiveryShipment({
  orderRef,
  waybillPrefix,
  name,
  phone,
  addressLine1,
  addressLine2,
  pincode,
  city,
  state,
  country = "India",
  weightKg = 0.5,
  orderValue,
  paymentMode = "Pre-paid",
  quantity = 1,
  pickupLocation = process.env.DELHIVERY_PICKUP_LOCATION,
  clientName = process.env.DELHIVERY_CLIENT_NAME,
  client = process.env.DELHIVERY_CLIENT,
  countryCode = "+91",
  phoneExt,
}) {
  if (!hasCredentials()) {
    throw new Error("DELHIVERY_TOKEN is not configured.");
  }

  const payload = {
    format: "json",
    data: [
      {
        shipment: {
          name: name,
          add: addressLine1 ? `${addressLine1}${addressLine2 ? ", " + addressLine2 : ""}` : "",
          phone: phone,
          pin: pincode,
          city: city,
          state: state,
          country: country,
          address_type: "Home",
          order: orderRef,
          shipment_id: orderRef,
          payment_mode: paymentMode,
          total_amount: orderValue,
          quantity: quantity,
          weight: weightKg,
          cod_amount: paymentMode === "COD" ? orderValue : 0,
          pickup_location: pickupLocation,
          client_name: clientName,
          client: client,
          country_code: countryCode,
        },
      },
    ],
  };

  if (phoneExt) payload.data[0].shipment.phone_ext = phoneExt;
  if (waybillPrefix) payload.data[0].shipment.waybill_prefix = waybillPrefix;

  const res = await fetch(`${DELHIVERY_API_BASE}/api/cmu/create.json`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      `Delhivery shipment could not be created (${res.status}): ${
        json?.message || json?.error || "Unknown error"
      }`
    );
  }

  const tracked = json?.shipment?.[0]?.tracking_data?.tracking_url;
  const waybill =
    json?.shipment?.[0]?.waybill || json?.packages?.[0]?.waybill || json?.waybill || null;

  return {
    waybill,
    shipmentId: json?.shipment?.[0]?.shipment_id || orderRef,
    labelUrl: json?.label_url || null,
    response: json,
  };
}

export async function getDelhiveryTracking(waybill) {
  if (!hasCredentials()) {
    throw new Error("DELHIVERY_TOKEN is not configured.");
  }
  if (!waybill) {
    throw new Error("A waybill (AWB) number is required.");
  }

  const params = new URLSearchParams({ waybill: String(waybill), token: getToken() });
  const res = await fetch(`${DELHIVERY_API_BASE}/api/v1/packages/json/?${params.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      `Delhivery tracking could not be fetched (${res.status}): ${
        json?.error || json?.message || "Unknown error"
      }`
    );
  }

  const shipmentData =
    json?.ShipmentData ||
    json?.shipment_data ||
    json?.output?.ShipmentData ||
    [];

  const rawFirst = shipmentData?.[0] || json?.shipmentData?.[0] || null;
  const scans = normalizeScans(shipmentData);
  const delivered = detectDelivered(scans);
  const status = deriveStatus(scans);

  return {
    waybill: String(waybill),
    status,
    delivered,
    scans,
    raw: json,
    rawFirst,
  };
}
