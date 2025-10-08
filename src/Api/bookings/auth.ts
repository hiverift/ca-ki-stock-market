// src/Api/auth.js
import client from "../client"; // path check kar lo: agar client ka location alag ho to adjust karna

export default async function ApiLogin({ email, password }: { email: string; password: string }) {
  // agar backend cookie-based auth use karta hai to withCredentials:true helpful hai
  const res = await client.post("/auth/login", { email, password, role: "user" }, { withCredentials: true });

  console.log("Full login response (res.data):", res.data);

  // handle result wrapper or direct payload
  const data = res.data?.result ?? res.data;

  // try common token fields (flexible)
  const token =
    data?.token ??
    data?.accessToken ??
    data?.jwt ??
    res.data?.token ??
    res.data?.accessToken ??
    null;

  if (token) {
    // store under both keys for backward compatibility
    localStorage.setItem("token", token);
    localStorage.setItem("accessToken", token);
  } else {
    // NOT throwing — server might be using httpOnly cookie. We'll still return response.
    console.warn("No token found in response. Server might be using httpOnly cookie-based auth.");
  }

  // Save user info if present (stringify user object)
  const user = data?.user ?? (data && (data._id || data.id) ? data : null);
  if (user) {
    if (user._id || user.id) localStorage.setItem("userId", user._id ?? user.id);
    if (user.name) localStorage.setItem("userName", user.name);
    if (user.email) localStorage.setItem("userEmail", user.email);
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch (e) {
      console.warn("Could not stringify user for localStorage", e);
    }
  }

  // return normalized object including token (may be null)
  return { ...data, token };
}
