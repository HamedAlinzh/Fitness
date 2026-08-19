/**
 * The seam where an online payment gateway will plug in. **Nothing is connected yet**,
 * and that is deliberate: Iranian PSPs won't issue a merchant id without e-Namad, which
 * is still in progress, so there is no credential to test an integration against. Rather
 * than ship untestable request/verify code, the flow stops one step short of the gateway.
 *
 * Until then a payment link is an **invoice**: `/pay/[token]` shows the plan and the
 * amount, the payer settles it with the coach directly, and the coach marks the order
 * paid in the admin panel. Everything else — issuing links, tokens, expiry, statuses,
 * the public page — is already real, so connecting a gateway is an additive change.
 *
 * ## What connecting one will involve
 *
 * 1. Flip `PAYMENT_GATEWAY_CONNECTED` and read the merchant id from an env var.
 * 2. Add a "pay now" Server Action on `/pay/[token]` that creates the gateway
 *    transaction from `order.amountRial` — note `Order.amountRial` is already in rial,
 *    which is what Iranian gateways settle in — and stores the returned handle in
 *    `Order.gatewayAuthority` before redirecting.
 * 3. Add a callback route that **verifies server-side** against the gateway. Never trust
 *    the browser's return trip: arriving at the callback URL is not proof of payment.
 * 4. Make that callback idempotent — it is a public URL and will be hit twice. Only
 *    move `PENDING → PAID`, and re-verifying an already-paid order must not double-count
 *    or overwrite `paidAt`.
 * 5. Re-check the amount from the database at verify time, never from the query string.
 *
 * The `gateway`, `gatewayAuthority` and `gatewayRefId` columns on `Order` are already
 * there and named generically, so none of the above needs a migration.
 */

export const PAYMENT_GATEWAY_CONNECTED = false;
