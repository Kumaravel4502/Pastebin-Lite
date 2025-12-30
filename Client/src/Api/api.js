const API_BASE = import.meta.env.VITE_API_BASE || "";

export const createPaste = async (data) => {
  try {
    const res = await fetch(`${API_BASE}/api/pastes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Failed to create paste" }));
      throw new Error(err.error || "Failed to create paste");
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error: Failed to create paste");
  }
};

export const fetchPaste = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/api/pastes/${id}`);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Paste unavailable" }));
      throw new Error(err.error || "Paste unavailable");
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error: Failed to fetch paste");
  }
};
