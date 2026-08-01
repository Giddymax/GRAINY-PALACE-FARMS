import { siteConfig } from "@/lib/site-config";
import { formatGHS } from "@/lib/format";

export type WhatsAppOrderItem = {
  name: string;
  quantity: number;
  unit: string;
  price: number;
};

function digitsOnly(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

/** Builds a wa.me deep link with a pre-filled, bold-labelled message. */
export function buildWhatsAppLink(
  message: string,
  phone: string = siteConfig.contact.whatsapp
) {
  const number = digitsOnly(phone);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** WhatsApp message for a single product quick-order. */
export function buildProductOrderMessage(item: WhatsAppOrderItem) {
  const total = item.price * item.quantity;
  return [
    `Hello Grainy Palace Farms, I'd like to order:`,
    ``,
    `*${item.name}*`,
    `Quantity: ${item.quantity} ${item.unit}`,
    `Unit price: ${formatGHS(item.price)}`,
    `*Total: ${formatGHS(total)}*`,
    ``,
    `Please confirm availability and delivery.`,
  ].join("\n");
}

/** WhatsApp message summarising a full cart. */
export function buildCartOrderMessage(items: WhatsAppOrderItem[]) {
  const lines = items.map(
    (item) =>
      `• ${item.name} — ${item.quantity} ${item.unit} x ${formatGHS(
        item.price
      )} = ${formatGHS(item.price * item.quantity)}`
  );
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return [
    `Hello Grainy Palace Farms, I'd like to place this order:`,
    ``,
    ...lines,
    ``,
    `*Total: ${formatGHS(total)}*`,
    ``,
    `Please confirm availability, delivery zone and payment options.`,
  ].join("\n");
}

/** WhatsApp message after an order/quote/enquiry has been submitted on the site. */
export function buildFollowUpMessage(reference: string, summary: string) {
  return [
    `Hello Grainy Palace Farms, I just submitted a request on your website.`,
    ``,
    `*Reference:* ${reference}`,
    summary,
    ``,
    `Please could you confirm and let me know next steps?`,
  ].join("\n");
}

export function buildEnquiryMessage(topic: string, details: string) {
  return [`Hello Grainy Palace Farms, I have an enquiry about *${topic}*.`, ``, details].join(
    "\n"
  );
}
