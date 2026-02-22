export async function POST(req) {
  const { pincode } = await req.json();

  try {
    const PICKUP_PIN = "742223"; // your pickup

    const res = await fetch(
      `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pincode}&pickup_postcode=${PICKUP_PIN}`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${process.env.DELHIVERY_TOKEN}`,
        },
      }
    );

    const data = await res.json();

    if (!data.delivery_codes || data.delivery_codes.length === 0) {
      return Response.json({ serviceable: false });
    }

const location = data.delivery_codes[0].postal_code;

// ⭐ calculate delivery days safely
const tat =
  location.tat ||
  location.max_prepaid_days ||
  location.max_cod_days ||
  5; // fallback default

return Response.json({
  serviceable: true,
  city: location.city,
  district: location.district,
  state: location.state_code,
  tat: tat,
  cod: location.cod === "Y",
});


  } catch (err) {
    return Response.json({ serviceable: false });
  }
}