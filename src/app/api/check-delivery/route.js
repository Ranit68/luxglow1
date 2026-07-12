const PICKUP_PIN = "742223";

export async function POST(req) {
  try {
    const { pincode } = await req.json();
    const token = process.env.DELHIVERY_TOKEN;

    if (!token) {
      return Response.json(
        { serviceable: false, error: "Delivery service is not configured." },
        { status: 503 }
      );
    }

    if (!/^\d{6}$/.test(String(pincode || ""))) {
      return Response.json(
        { serviceable: false, error: "Invalid pincode." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pincode}&pickup_postcode=${PICKUP_PIN}`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return Response.json(
        { serviceable: false, error: "Delivery lookup failed." },
        { status: 502 }
      );
    }

    const data = await response.json();

    if (!data.delivery_codes || data.delivery_codes.length === 0) {
      return Response.json({ serviceable: false });
    }

    const location = data.delivery_codes[0].postal_code;
    const tat =
      location.tat ||
      location.max_prepaid_days ||
      location.max_cod_days ||
      5;

    return Response.json({
      serviceable: true,
      city: location.city,
      district: location.district,
      state: location.state_code,
      tat,
      cod: location.cod === "Y",
    });
  } catch {
    return Response.json(
      { serviceable: false, error: "Delivery lookup failed." },
      { status: 500 }
    );
  }
}
