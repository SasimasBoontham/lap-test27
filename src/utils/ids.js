export function generateUserCode(name = '', email = '') {
  // Generate a stable code based on email only so that changing the display name
  // doesn't change the user's code. Use email as the unique identifier.
  const s = `${email.trim().toLowerCase()}`;
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    const chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  const absHash = Math.abs(hash);
  // convert to base36 and take 5-6 chars
  let code = absHash.toString(36).toUpperCase();
  if (code.length < 5) code = code.padStart(5, '0');
  code = code.slice(0, 6);
  return `U-${code}`;
}

export default generateUserCode;
