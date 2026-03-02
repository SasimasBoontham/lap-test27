const theme = {
  // Revert to the professional palette requested earlier
    // App color tokens (primary dark blue and accent yellow)
    primary: '#173d62', // deep blue primary
    secondary: '#173d62', // keep secondary aligned with primary for outlines
  // reaction colors
  success: '#10B981',
  danger: '#EF4444',
  // Button tokens: neutral rectangular buttons and pill (oval) buttons
    neutralButton: '#f3f4f6', // light neutral surface for secondary actions
    pill: '#ffe366', // accent / pill buttons (yellow)
    accent: '#ffe366',
    // create/join group button accent
    createAccent: '#fff59c',
  // Text colors
  text: '#000000', // default text black
  textPrimary: '#000000', // headings
  textSecondary: '#64748B', // supporting/details
  // Button text defaults to white for dark primary, otherwise override where needed
  buttonText: '#ffffff',
  // border / line color (use subtle gray for card outlines and inputs)
  border: '#e6e6e6',
  // calendar background
  calendarBackground: '#ffffff',
  // card background for surfaces like group cards and message containers
  cardBackground: '#f7f7f7',
  // calendar item / message box background
  calendarItemBackground: '#9bd3c3',
  // notes item / message box background
  notesItemBackground: '#f0aeae',
  // Background
  background: '#ffffff'
};

export default theme;

