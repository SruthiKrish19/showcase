/** Where enquiries from the pitch contact form are delivered. */
export const CONTACT_EMAIL = 'sridzar1234@gmail.com'

/**
 * FormSubmit relays the form to CONTACT_EMAIL — no server or account.
 * The very first submission sends an "Activate form" email to that address;
 * nothing is delivered until that link has been clicked once.
 */
export const CONTACT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`
