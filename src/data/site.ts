// Settings for the whole site that are not content.

export const site = {
  // The address the newsletter form sends to. Buttondown provides it in
  // Phase 8; it looks like
  //   https://buttondown.com/api/emails/embed-subscribe/YOUR-NAME
  // While this is an empty string the signup form is shown switched off
  // and labelled "Subscriptions open shortly".
  newsletterAction: '',

  // The Tally form readers use to send in a crossword. Paste the form's
  // share link, which looks like
  //   https://tally.so/r/abc123
  // While this is an empty string the page at /games/crossword/submit
  // explains what to send but says the window is shut.
  crosswordSubmissionForm: '',

  // The Tally form readers use to enter the caption contest. Another
  // share link, as above. The page passes the form the contest's number
  // as a hidden field called "contest", so add a hidden field of that
  // name to the form in Tally to see which drawing each caption is for.
  captionContestForm: '',

  // The Tally forms on the Submit page (/submit), one for each door:
  // writing, drawing, and everything else. Share links, as above. A door
  // with no link is shown shut.
  submissionForms: {
    write: '',
    draw: '',
    create: '',
  },

  // Reader accounts (sign-in, likes, saved articles, letters) are kept
  // in a Supabase project. Paste its Project URL and its "anon public"
  // key here; both are in the project under Settings > API. The anon
  // key is meant to be public: what protects the data is the set of
  // rules in supabase/schema.sql, which also has the setup steps.
  // While either is blank, accounts are switched off: the Log In page
  // says the register is not yet open, likes are kept in the reader's
  // own browser, and the Letters desk is shut.
  supabase: {
    url: 'https://tsstoddeztokjrfazdda.supabase.co',
    anonKey: 'sb_publishable_9_KTDvhKPp9XJtl7NsMxwQ_AmVUlc-r',
  },

  // The Tally form on the Contact page (/contact). A share link, as above.
  contactForm: '',

  // Stripe Payment Links for donations, on the Support page (/support).
  // In Stripe, make one Payment Link where the customer chooses the
  // amount, and (if wanted) one that is a monthly subscription. They
  // look like https://donate.stripe.com/abc123. A blank one is shown as
  // "The collection plate is being polished."
  donationLinks: {
    once: '',
    monthly: '',
  },

  // Your Buy Me a Coffee page, shown on the Support page. It looks like
  //   https://buymeacoffee.com/yourname
  // (or https://www.buymeacoffee.com/yourname). While blank, that card
  // on the Support page says the kettle is not yet on.
  buyMeACoffee: '',
};
