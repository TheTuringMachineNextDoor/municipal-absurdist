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
};
