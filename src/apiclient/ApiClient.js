const BASE_URL = import.meta.env.VITE_LOCAL_API_URL;

async function apiClient(endpoint, { method = "GET", headers = {}, body, params } = {}) {
  let url = `${BASE_URL}${endpoint}`;
  // Get token from localStorage instead of Redux (this is not a React component)
  const token = localStorage.getItem('token');
  console.log(token);
  
  // query params handle karo
  if (params && typeof params === "object") {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token || ''}`,
      ...headers,
    },
  };

  if (body) {
    // agar FormData hai to Content-Type set na karo
    if (body instanceof FormData) {
      delete options.headers["Content-Type"];
      options.body = body;
    } else {
      options.body = JSON.stringify(body);
    }
  }

  try {
    const res = await fetch(url, options);
    console.log(res);
    
    const data = await res.json().catch(() => ({}));

   if (!res.ok) {
  // backend ka pura error data bhi attach kar do
  const error = new Error(data.FailureMessage || data.message || "Something went wrong");
  error.status = res.status;
  error.body = data; // backend se aya full json
  throw error;
}

    return data;
  } catch (err) {
    throw err;
  }
}

export default apiClient;
