export default function RefundPolicy() {
  return (
    <main className="pt-28 max-w-5xl mx-auto px-6 pb-20">
      <h1 className="text-4xl font-bold mb-6">Refund & Cancellation Policy</h1>

      <p className="mb-4">
        At Lux&Glow, customer satisfaction is important to us. Please read our
        return and refund policy carefully.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Return Eligibility</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>Returns are accepted within <strong>4 days</strong> of delivery.</li>
        <li>Product must be unused and in original condition.</li>
        <li>Return is accepted only if product is mismatched or incorrect.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Unboxing Video Mandatory</h2>
      <p>
        For mismatch or incorrect product claims, customers must provide a
        complete unboxing video clearly showing the package and product.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Non-Returnable Cases</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>No returns for torn or damaged items after delivery.</li>
        <li>We manually inspect every product before dispatch.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Refund / Replacement</h2>
      <p>
        Customers may choose either refund or replacement. Refund amount may
        have delivery charges deducted.
      </p>
    </main>
  );
}
