function saveJwtAccessTokenInCookie(token) {
    // Create a new cookie object.
    const cookie = new Cookie("jwtAccessToken", token);
  
    // Set the cookie properties.
    cookie.expires = new Date(Date.now() + 3600 * 24); // Expires in 24 hours.
    cookie.path = "/"; // Cookie is accessible from the entire domain.
    cookie.secure = true; // Only accessible over HTTPS.
    cookie.httpOnly = true; // Cannot be accessed by JavaScript.
  
    // Set the cookie.
    document.cookie = cookie.toString();
}