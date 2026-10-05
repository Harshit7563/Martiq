import { COMPANY } from '@/data/company'

export type PolicyBlock = {
  heading: string
  body: string[]
  bullets?: string[]
}

export type PolicyDoc = {
  slug: string
  title: string
  intro: string
  blocks: PolicyBlock[]
}

const C = COMPANY.legalName
const B = COMPANY.brand
const A = COMPANY.address
const E = COMPANY.email
const P = COMPANY.phone
const W = COMPANY.website
const G = COMPANY.gstin
const D = COMPANY.effectiveDate
const J = COMPANY.jurisdiction

export const POLICIES: PolicyDoc[] = [
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    intro: `This Privacy Policy describes how ${C} (“${B}”, “we”, “us”, “our”) collects, uses, stores, shares, and protects personal information when you access ${W}, create an account, place an order, contact support, or otherwise interact with our services. This Policy is effective ${D} and should be read with our Terms & Conditions.`,
    blocks: [
      {
        heading: '1. Data controller & contact',
        body: [
          `The data controller for personal information processed through ${W} is ${C}, GSTIN ${G}.`,
          `Registered / correspondence address: ${A}.`,
          `Privacy & data requests: ${E} · ${P}.`,
          `For unresolved privacy grievances, see our Grievance Redressal Policy and contact the Grievance Officer at ${COMPANY.grievanceOfficer.email}.`,
        ],
      },
      {
        heading: '2. Scope',
        body: [
          'This Policy applies to visitors, registered users, and customers in India who use our website, mobile web experience, and related customer-care channels (email, phone, WhatsApp where enabled).',
          'It does not apply to third-party websites or apps that we may link to (courier tracking, payment gateways, social platforms). Those services have their own privacy practices.',
        ],
      },
      {
        heading: '3. Information we collect',
        body: [
          'We collect information you provide and information generated when you use Martiq:',
        ],
        bullets: [
          'Identity & account: name, email address, mobile number, password or OTP verification data, profile preferences, wishlist.',
          'Order & fulfilment: shipping and billing address, order contents, size/fit selections, delivery instructions, invoices, return/exchange requests.',
          'Payment-related: payment method type (UPI, card, net banking, wallet, COD), transaction reference / order ID, payment status. Full card numbers and UPI PINs are processed by licensed payment partners; Martiq does not store full card PANs or CVV.',
          'Device & usage: IP address, browser and device type, pages viewed, referring URL, session timestamps, approximate location derived from IP, crash/diagnostic logs.',
          'Cookies & similar tech: essential cookies for login, cart and checkout; analytics/preference cookies as described in this Policy.',
          'Support communications: emails, call notes, chat transcripts, and documents you voluntarily share with customer care.',
          'Marketing (optional): channel preferences if you opt in to promotional emails/SMS/WhatsApp.',
        ],
      },
      {
        heading: '4. How we use personal information',
        body: [
          'We use personal information only for lawful business purposes, including:',
        ],
        bullets: [
          'Processing and delivering orders, returns, exchanges, refunds, and GST-compliant invoicing.',
          'Creating and securing accounts, sending OTPs, preventing fraud, abuse, and unauthorised access.',
          'Providing transactional notifications (order confirmation, dispatch, delivery attempts).',
          'Customer support and grievance handling.',
          'Improving product assortment, website performance, and user experience through aggregated analytics.',
          'Sending marketing communications where you have consented or as otherwise permitted under applicable law; you may opt out at any time.',
          'Complying with legal obligations (tax, accounting, consumer protection, lawful requests from authorities).',
        ],
      },
      {
        heading: '5. Legal bases',
        body: [
          'Depending on the context and applicable Indian law (including the Information Technology Act, 2000 and rules thereunder, and the Digital Personal Data Protection framework as in force), we process data on the basis of: performance of a contract (fulfilling your order); legitimate interests (security, service improvement, fraud prevention); consent (marketing and non-essential cookies); and legal obligation (tax and regulatory retention).',
        ],
      },
      {
        heading: '6. Sharing & disclosure',
        body: [
          'We do not sell your personal information. We may share data with:',
        ],
        bullets: [
          'Logistics and courier partners for delivery and reverse pickup.',
          'Licensed payment gateways / payment aggregators to complete transactions.',
          'SMS, email, and messaging providers for transactional and (where opted-in) promotional messages.',
          'Cloud hosting, security, analytics, and customer-support vendors bound by confidentiality and data-processing terms.',
          'Professional advisers (legal, accounting) under confidentiality.',
          'Courts, regulators, or law enforcement when required by applicable Indian law or to protect rights, safety, and integrity of Martiq and our users.',
          'Successor entities in a merger, acquisition, or sale of assets, subject to equivalent protections.',
        ],
      },
      {
        heading: '7. Cross-border transfers',
        body: [
          'Primary operations and customer data for Martiq are intended for processing in India. If a service provider processes data outside India, we take steps consistent with applicable law to ensure appropriate safeguards.',
        ],
      },
      {
        heading: '8. Retention',
        body: [
          'We retain personal information only as long as necessary for the purposes stated in this Policy, including:',
        ],
        bullets: [
          'Order, payment, and invoice records: as required under Indian tax and commercial laws (typically several years).',
          'Account data: while your account remains active and for a reasonable period thereafter for dispute resolution and fraud prevention.',
          'Support records: for a period needed to resolve issues and improve service quality.',
          'Marketing lists: until you unsubscribe or we delete inactive contacts.',
        ],
      },
      {
        heading: '9. Security',
        body: [
          'We implement industry-reasonable technical and organisational measures including HTTPS encryption in transit, access controls, least-privilege principles, and monitoring for suspicious activity. No method of electronic transmission or storage is completely secure; you use the site at your own residual risk subject to mandatory consumer protections.',
        ],
      },
      {
        heading: '10. Your rights',
        body: [
          'Subject to applicable law, you may request access, correction, updating, or deletion of your personal data; withdraw marketing consent; and raise a privacy grievance.',
          `Email ${E} with subject “Privacy request”, or use the Grievance Officer channel in our Grievance Redressal Policy. We aim to acknowledge within ${COMPANY.grievanceOfficer.ackHours} hours and resolve within a reasonable period (target ${COMPANY.grievanceOfficer.resolveDays} days where practicable).`,
          'You may escalate unresolved grievances to the relevant authority under applicable Indian data-protection / IT law.',
        ],
      },
      {
        heading: '11. Children',
        body: [
          'Martiq is intended for users aged 18 years and above (or use under guardian supervision for gift purchases). We do not knowingly collect personal data from children. If you believe a minor has provided data, contact us and we will delete it promptly.',
        ],
      },
      {
        heading: '12. Cookies',
        body: [
          'Essential cookies enable login, cart, checkout, and security. Analytics and preference cookies help us understand traffic and remember settings. You can control cookies in your browser; blocking essential cookies may prevent checkout. See also our Terms for acceptable use of the site.',
        ],
      },
      {
        heading: '13. Changes to this Policy',
        body: [
          `We may update this Privacy Policy from time to time. The effective date (${D}) will be revised when material changes are made. Continued use of ${W} after updates constitutes acceptance where permitted by law. Material changes affecting your rights may be notified by email or a notice on the website.`,
        ],
      },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms & Conditions',
    intro: `These Terms & Conditions (“Terms”) form a binding agreement between you and ${C} regarding your use of ${W} and purchases of products sold under the brand ${B}. Effective ${D}. By browsing, registering, or placing an order, you agree to these Terms, our Privacy Policy, Shipping & Delivery Policy, Return & Refund Policy, Disclaimer, and Grievance Redressal Policy.`,
    blocks: [
      {
        heading: '1. Company identity',
        body: [
          `${C} operates the online storefront ${W} under the brand name ${B}.`,
          `GSTIN: ${G}. Registered / correspondence address: ${A}.`,
          `Customer support: ${E} · ${P}. Business hours: ${COMPANY.hours}.`,
        ],
      },
      {
        heading: '2. Eligibility',
        body: [
          'You represent that you are at least 18 years of age and competent to contract under the Indian Contract Act, 1872, or that you are using the site under the supervision of a parent/guardian who agrees to these Terms.',
          'You agree to provide accurate, current information at registration and checkout.',
        ],
      },
      {
        heading: '3. Account security',
        body: [
          'You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account.',
          'Notify us immediately at ' + E + ' if you suspect unauthorised access. We may suspend accounts involved in fraud, abuse, or policy violations.',
        ],
      },
      {
        heading: '4. Products, descriptions & pricing',
        body: [
          'Product images are illustrative. Colour, wash, and texture may vary slightly due to screen display, lighting, and denim dye lots. Such reasonable variation is not a defect.',
          'Size charts are guides; fit may vary by style. Please measure yourself and review the product page before ordering.',
          'All prices are in Indian Rupees (INR) and inclusive of applicable GST unless expressly stated otherwise.',
          'We may correct pricing, tax, or availability errors. If an error affects your order, we may cancel it and refund amounts collected.',
          'Promotions, coupons, and sale prices are subject to stated conditions and may be modified or withdrawn.',
        ],
      },
      {
        heading: '5. Orders & acceptance',
        body: [
          'Placing an order constitutes an offer to purchase. Acceptance occurs when we confirm the order and/or dispatch the goods.',
          'We reserve the right to refuse or cancel orders for stock unavailability, address/payment issues, suspected fraud, or violation of these Terms.',
          'Order confirmation emails/SMS are acknowledgements; dispatch confirmation indicates fulfilment has begun.',
        ],
      },
      {
        heading: '6. Payment',
        body: [
          'Available payment methods are shown at checkout and may include UPI, cards, net banking, wallets, and Cash on Delivery (COD), subject to serviceability, risk checks, and order-value limits.',
          'COD is available only when the payable order value exceeds ₹500 (or such other threshold displayed at checkout) and the pin code is serviceable for COD.',
          'Online payment methods may be temporarily unavailable due to bank, gateway, or operational reasons. Where a method is unavailable, you will be prompted to use an alternate method such as COD (if eligible).',
          'Payments are processed by licensed third-party payment service providers. Martiq does not store full card numbers or UPI PINs.',
          'Title to goods passes upon full payment and delivery; risk of loss passes upon delivery to the address you provide, except where mandatory law provides otherwise.',
        ],
      },
      {
        heading: '7. Shipping, returns & refunds',
        body: [
          'Delivery estimates, fees, COD rules, and failed-delivery handling are governed by our Shipping & Delivery Policy.',
          'Returns, exchanges, and refunds are governed by our Return & Refund Policy. Those policies form part of these Terms.',
        ],
      },
      {
        heading: '8. User conduct',
        body: [
          'You agree not to:',
        ],
        bullets: [
          'Use the site for unlawful, fraudulent, or abusive purposes.',
          'Attempt unauthorised access, scrape content at scale, or interfere with security or performance.',
          'Misuse payment, COD, or return processes (including false claims or serial return abuse).',
          'Infringe intellectual property or upload malware.',
          'Harass staff or other users through support channels.',
        ],
      },
      {
        heading: '9. Intellectual property',
        body: [
          `All trademarks, logos, product photography, graphics, and copy on ${W} are owned by ${C} or its licensors. You may not copy, reproduce, or commercially exploit them without prior written consent, except for personal, non-commercial viewing.`,
        ],
      },
      {
        heading: '10. Third-party services',
        body: [
          'Courier partners, payment gateways, and linked third-party sites are independent. Martiq is not responsible for their content or practices, but we will reasonably assist with order-related issues involving logistics or payment status.',
        ],
      },
      {
        heading: '11. Limitation of liability',
        body: [
          'To the maximum extent permitted by Indian law, Martiq’s aggregate liability arising out of any product purchase or use of the website is limited to the amount you paid for the relevant order.',
          'We are not liable for indirect, incidental, special, or consequential damages, except where liability cannot be excluded (including fraud, wilful misconduct, or liability that cannot be limited under the Consumer Protection Act, 2019).',
        ],
      },
      {
        heading: '12. Indemnity',
        body: [
          'You agree to indemnify and hold harmless ' +
            C +
            ' and its directors, officers, and employees from claims arising from your breach of these Terms, misuse of the site, or violation of applicable law, to the extent permitted.',
        ],
      },
      {
        heading: '13. Force majeure',
        body: [
          'We are not liable for delays or failures caused by events beyond reasonable control, including natural disasters, epidemics, strikes, war, governmental actions, courier network failures, or widespread internet/payment outages. We will resume performance as soon as reasonably practicable.',
        ],
      },
      {
        heading: '14. Governing law & disputes',
        body: [
          `These Terms are governed by the laws of India. Subject to mandatory consumer protections, courts at ${J} shall have jurisdiction.`,
          'Consumers may also pursue remedies under the Consumer Protection Act, 2019 before appropriate consumer forums.',
          'Please use our Grievance Redressal Policy before initiating formal proceedings so we can attempt an amicable resolution.',
        ],
      },
      {
        heading: '15. Changes',
        body: [
          'We may update these Terms periodically. The effective date will be revised. Continued use of the site after changes constitutes acceptance where permitted by law.',
        ],
      },
      {
        heading: '16. Contact',
        body: [`${C} · ${A} · ${E} · ${P} · GSTIN ${G} · ${W}`],
      },
    ],
  },
  {
    slug: 'shipping',
    title: 'Shipping & Delivery Policy',
    intro: `This Shipping & Delivery Policy explains how ${C} (${B}) processes, ships, and delivers orders placed on ${W}. Effective ${D}.`,
    blocks: [
      {
        heading: '1. Serviceable locations',
        body: [
          'We ship across India to pin codes that are serviceable through our logistics partners. Serviceability (including COD availability) is confirmed when you enter your pin code on the product page or at checkout.',
          'Some remote, restricted, or high-risk pin codes may have longer transit times, prepaid-only delivery, or temporary suspension of service.',
        ],
      },
      {
        heading: '2. Order processing',
        body: [
          'Orders are usually processed and handed to the courier within 1–2 business days after confirmation (excluding Sundays, public holidays, and peak sale periods).',
          'Orders placed after cut-off or during high volume may take additional processing time. You will receive dispatch confirmation with tracking details when available.',
          'We may split shipments if items ship from different locations; you will be informed if this affects delivery.',
        ],
      },
      {
        heading: '3. Delivery timelines',
        body: [
          'Estimated transit after dispatch:',
        ],
        bullets: [
          'Metro and major cities: approximately 2–4 business days.',
          'Other serviceable cities/towns: approximately 3–7 business days.',
          'Remote / difficult terrain locations: may take longer depending on courier schedules.',
        ],
      },
      {
        heading: '4. Shipping charges',
        body: [
          'Free standard shipping on eligible prepaid/COD orders of ₹999 and above to serviceable locations (before exclusions stated at checkout).',
          'Orders below ₹999 may attract a flat shipping fee displayed at checkout before you confirm payment.',
          'Any express shipping option, if offered, is charged separately and shown before order confirmation.',
          'Shipping charges are generally non-refundable except where delay or failure is due to our error or a defective/wrong item (see Return & Refund Policy).',
        ],
      },
      {
        heading: '5. Cash on Delivery (COD)',
        body: [
          'COD is offered only on eligible pin codes and only when the payable order total is greater than ₹500 (or such higher threshold shown at checkout).',
          'We may disable COD for specific accounts, pin codes, or high-risk orders to prevent fraud.',
          'Please keep exact change ready where possible. Refusal of COD without valid reason may affect future COD eligibility.',
        ],
      },
      {
        heading: '6. Tracking',
        body: [
          'After dispatch, tracking / AWB details are shared by SMS/email when provided by the courier partner.',
          `You may also use Track Order on ${W} with your Martiq Order ID, or view status under My Orders when signed in.`,
          'If tracking does not update for 48 hours after dispatch, contact support with your Order ID.',
        ],
      },
      {
        heading: '7. Delivery attempts & failed delivery',
        body: [
          'Couriers typically attempt delivery 2–3 times. Please ensure your phone is reachable and someone is available to receive the parcel.',
          'Failed delivery due to incorrect address, unreachable phone, refusal, or incomplete pin code may result in return to origin. Re-shipping may attract additional charges; otherwise we may process a refund after deducting outbound/return shipping and COD fees as applicable.',
        ],
      },
      {
        heading: '8. Address accuracy',
        body: [
          'You are responsible for providing a complete and accurate delivery address, landmark, and mobile number. Delays arising from incorrect customer information are not treated as Martiq service failures.',
        ],
      },
      {
        heading: '9. Inspection on delivery',
        body: [
          'Where the courier allows, please check the outer packaging for visible damage before accepting. For damaged or wrong items, report within 48 hours of delivery with clear photos as described in the Return & Refund Policy.',
        ],
      },
      {
        heading: '10. Invoices & GST',
        body: [
          `A tax invoice with GST details is shared digitally and/or with the shipment. Our GSTIN is ${G}.`,
          'For GST invoice name/GSTIN on the buyer side (B2B), share details before dispatch by emailing ' + E + ' with your Order ID.',
        ],
      },
      {
        heading: '11. Contact',
        body: [`Shipping queries: ${E} · ${P} · ${A}`],
      },
    ],
  },
  {
    slug: 'returns',
    title: 'Return & Refund Policy',
    intro: `This Return & Refund Policy explains how ${C} (${B}) handles returns, exchanges, cancellations, and refunds for orders on ${W}. Effective ${D}.`,
    blocks: [
      {
        heading: '1. Return window & eligibility',
        body: [
          'Most products may be returned or exchanged within 7 (seven) days of delivery if they are unused, unwashed, unworn beyond try-on, with original tags, packaging, and invoice intact, and in re-saleable condition.',
          'Try-on to check fit is allowed. Odour, stains, alteration, washing, damage caused by the customer, or missing tags voids eligibility.',
          'For defective, damaged in transit, or wrong-item deliveries: report within 48 hours of delivery with clear photographs of the product, tags, and packaging. We will arrange priority pickup or replacement.',
        ],
      },
      {
        heading: '2. Non-returnable items',
        body: [
          'Unless defective or wrongly shipped, the following are generally non-returnable:',
        ],
        bullets: [
          'Items marked “Final sale”, “Non-returnable”, or clearance-only at the time of purchase.',
          'Innerwear, socks, and personal-care items (hygiene products).',
          'Free gifts / promotional add-ons unless the main paid product is also returned.',
          'Products altered or customised at customer request.',
        ],
      },
      {
        heading: '3. How to initiate a return or exchange',
        body: [
          `Sign in → My Orders → select the order → request return/exchange, or email ${E} with Order ID, product name/SKU, size, reason, and photos (for defect/damage).`,
          'Once approved, we schedule a reverse pickup where available, or share self-ship instructions.',
          'Exchanges are subject to stock. If the requested size/colour is unavailable, we will issue a refund as per this Policy.',
        ],
      },
      {
        heading: '4. Reverse shipping costs',
        body: [
          'If the return is due to our error (defective, damaged, or wrong item), reverse pickup / return shipping is borne by Martiq.',
          'For size/fit change of mind or other customer-initiated eligible returns, reverse shipping may be deducted from the refund or charged as displayed during the return request, unless a free-return promotion applies.',
        ],
      },
      {
        heading: '5. Quality check',
        body: [
          'Returned products undergo quality inspection, usually within 3–5 business days of receipt at our warehouse.',
          'Items failing QC (used, damaged by customer, missing components) may be rejected and shipped back; refund will not be issued in such cases.',
        ],
      },
      {
        heading: '6. Refunds',
        body: [
          'After successful QC:',
        ],
        bullets: [
          'Prepaid orders: refund to the original payment method within 5–7 business days after initiation (banks/UPI apps may take additional time to reflect credit).',
          'COD orders: refund via UPI or bank transfer to details you provide, typically within 5–7 business days after initiation.',
          'Original outbound shipping fees are refunded only when the return is due to our error.',
          'Promotional discounts / coupon value may be adjusted as per the offer terms applicable at purchase.',
        ],
      },
      {
        heading: '7. Cancellations before dispatch',
        body: [
          `You may request cancellation from My Orders while status is Placed/Processing, or email ${E} with Order ID before dispatch.`,
          'Once shipped, cancellation is not available — use the return process after delivery.',
          'Martiq may cancel orders for stock issues, payment/address problems, pricing errors, or suspected fraud. Amounts collected are refunded in full for Martiq-initiated cancellations (excluding fraudulent orders under investigation).',
        ],
      },
      {
        heading: '8. Order value & COD notes',
        body: [
          'COD is available only for orders with payable total greater than ₹500 (and other eligibility rules). Cancellation/return abuse on COD orders may lead to COD being disabled for future orders.',
        ],
      },
      {
        heading: '9. Contact',
        body: [`Returns & refunds: ${E} · ${P}. Please include Order ID in all correspondence.`],
      },
    ],
  },
  {
    slug: 'disclaimer',
    title: 'Disclaimer',
    intro: `This Disclaimer sets out important legal notices regarding ${W} and products offered by ${C} under the brand ${B}. Effective ${D}. Please read together with our Terms & Conditions and other policies.`,
    blocks: [
      {
        heading: '1. General',
        body: [
          `${W} is operated by ${C}, GSTIN ${G}, with registered / correspondence address at ${A}.`,
          'Information on this website is provided for shopping and general information. It does not constitute legal, medical, or professional advice.',
          'By using Martiq you acknowledge this Disclaimer and our linked policies.',
        ],
      },
      {
        heading: '2. Product information & imagery',
        body: [
          'Photographs, colours, textures, and fits are illustrative. Actual products may differ slightly due to lighting, display settings, dye lots, and manufacturing tolerances inherent to denim and apparel.',
          'Descriptions, fabrics, and size charts are prepared in good faith. Always review the size chart on the product page. Contact support if you need sizing help before ordering.',
          'We may correct typographical errors, specifications, or imagery without prior notice.',
        ],
      },
      {
        heading: '3. Pricing, offers & availability',
        body: [
          'Prices are in INR and include applicable GST unless stated otherwise. Prices, discounts, coupons, and stock may change without notice.',
          'If a product is listed at an incorrect price or becomes unavailable due to an error, we may cancel the affected order and refund amounts collected, as described in the Return & Refund Policy.',
          'Promotions are subject to their stated terms and may be withdrawn or modified.',
        ],
      },
      {
        heading: '4. Third-party services',
        body: [
          'Links to courier tracking, payment pages, or social media are provided for convenience. We do not control third-party content, availability, or privacy practices.',
          'Payment credentials are handled by licensed payment service providers. Martiq does not store full card numbers or UPI secrets.',
        ],
      },
      {
        heading: '5. No warranties beyond law',
        body: [
          'The website is provided on an “as is” and “as available” basis. To the fullest extent permitted by Indian law, we disclaim warranties of uninterrupted or error-free access, except that mandatory consumer rights under the Consumer Protection Act, 2019 and other non-excludable laws remain unaffected.',
        ],
      },
      {
        heading: '6. Limitation of liability',
        body: [
          'To the maximum extent permitted by law, Martiq’s aggregate liability for any claim relating to a purchase or use of the website is limited to the amount paid for the relevant order.',
          'We are not liable for indirect or consequential losses except where liability cannot be limited under applicable law.',
          'Delays caused by courier networks, payment gateways, force majeure, or incorrect customer addresses are outside our reasonable control; we will still assist in good faith to resolve order issues.',
        ],
      },
      {
        heading: '7. User responsibility',
        body: [
          'You are responsible for accurate delivery details, safeguarding account credentials, and lawful use of the site. Misuse may result in order cancellation, account suspension, and reporting to authorities where required.',
        ],
      },
      {
        heading: '8. Contact',
        body: [`Questions about this Disclaimer: ${E} · ${P} · ${C} · ${A} · GSTIN ${G}.`],
      },
    ],
  },
  {
    slug: 'grievance',
    title: 'Grievance Redressal Policy',
    intro: `This Grievance Redressal Policy describes how ${C} (${B}) receives, acknowledges, and resolves customer and user grievances relating to ${W}, orders, payments, deliveries, returns, privacy, and related services, in line with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 (as applicable), the Consumer Protection Act, 2019, and good industry practice. Effective ${D}.`,
    blocks: [
      {
        heading: '1. Purpose',
        body: [
          'We are committed to transparent, timely, and fair resolution of complaints. This Policy ensures you know how to raise a grievance, who handles it, and expected timelines.',
        ],
      },
      {
        heading: '2. Scope',
        body: [
          'This Policy covers grievances relating to:',
        ],
        bullets: [
          'Orders, payments, invoices, and COD.',
          'Shipping delays, damaged parcels, and failed deliveries.',
          'Returns, exchanges, and refunds.',
          'Product quality (defect / wrong item).',
          'Account access, OTP, and privacy / data requests.',
          'Alleged violation of Terms, abusive conduct, or fraud concerns.',
          'Any other issue arising from use of Martiq services.',
        ],
      },
      {
        heading: '3. How to raise a grievance',
        body: [
          'Please first check Track Order / My Orders for status updates. If unresolved, raise a grievance through any of the following channels:',
        ],
        bullets: [
          `Email: ${COMPANY.grievanceOfficer.email} (preferred for written record) or ${E}`,
          `Phone: ${COMPANY.grievanceOfficer.phone} during ${COMPANY.hours}`,
          `Postal: Grievance Officer, ${C}, ${A}`,
        ],
      },
      {
        heading: '4. Information to include',
        body: [
          'To help us resolve quickly, include:',
        ],
        bullets: [
          'Full name and registered mobile/email.',
          'Order ID (if applicable).',
          'Clear description of the issue and what resolution you seek.',
          'Supporting photos/videos for damage, defect, or wrong product.',
          'Transaction reference for payment disputes.',
        ],
      },
      {
        heading: '5. Grievance Officer',
        body: [
          `Designation: ${COMPANY.grievanceOfficer.name}`,
          `Email: ${COMPANY.grievanceOfficer.email}`,
          `Phone: ${COMPANY.grievanceOfficer.phone}`,
          `Address for correspondence: ${A}`,
          'The Grievance Officer (or an authorised delegate) oversees complaint intake, escalation, and closure for Martiq’s online services.',
        ],
      },
      {
        heading: '6. Acknowledgement & resolution timelines',
        body: [
          `Acknowledgement: We aim to acknowledge grievances within ${COMPANY.grievanceOfficer.ackHours} hours of receipt on business days (longer if received on holidays).`,
          `Resolution: We aim to resolve grievances within ${COMPANY.grievanceOfficer.resolveDays} days of receipt, subject to complexity, courier investigation, payment gateway timelines, and completeness of information from you.`,
          'If more time is required (for example, warehouse QC or bank chargeback cycles), we will inform you of the status and expected next update.',
        ],
      },
      {
        heading: '7. Escalation levels',
        body: [
          'Level 1 — Customer Care: frontline support via ' + E + ' / ' + P + '.',
          'Level 2 — Grievance Officer: if not resolved satisfactorily at Level 1 within a reasonable period, escalate to ' +
            COMPANY.grievanceOfficer.email +
            ' with subject “Escalation — Order/Issue ID”.',
          'Level 3 — External remedies: if still unresolved, you may approach the appropriate consumer forum under the Consumer Protection Act, 2019, or other competent authority under applicable law. Nothing in this Policy limits your statutory rights.',
        ],
      },
      {
        heading: '8. Privacy & data grievances',
        body: [
          'Requests for access, correction, or deletion of personal data, or complaints about privacy practices, may be sent to ' +
            COMPANY.grievanceOfficer.email +
            ' with subject “Privacy grievance”. See our Privacy Policy for details of rights and processing.',
        ],
      },
      {
        heading: '9. Frivolous or abusive complaints',
        body: [
          'We reserve the right to decline or close grievances that are abusive, threatening, clearly frivolous, or filed in bad faith after a reasoned response, without prejudice to genuine consumer rights.',
        ],
      },
      {
        heading: '10. Records',
        body: [
          'We maintain records of grievances and their disposal as required for internal governance and applicable law.',
        ],
      },
      {
        heading: '11. Governing framework',
        body: [
          `This Policy is intended to align with applicable Indian laws including the Consumer Protection Act, 2019 and the Information Technology Act, 2000 & rules. Jurisdiction for disputes is as stated in our Terms & Conditions (${J}), subject to mandatory consumer protections.`,
        ],
      },
      {
        heading: '12. Contact summary',
        body: [
          `${C} · Brand: ${B} · GSTIN ${G}`,
          A,
          `Support: ${E} · ${P}`,
          `Grievance Officer: ${COMPANY.grievanceOfficer.email} · ${COMPANY.grievanceOfficer.phone}`,
          W,
        ],
      },
    ],
  },
]

export function getPolicy(slug: string): PolicyDoc | undefined {
  return POLICIES.find((p) => p.slug === slug)
}

export const POLICY_NAV = POLICIES.map((p) => ({
  slug: p.slug,
  title: p.title,
  to: `/policies/${p.slug}`,
}))
