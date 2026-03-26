
interface ActivityEntry {
  type: string;
  name: string;
  description?: string;
  duration?: number;
}

export async function logActivity(
  data: ActivityEntry
): Promise<{ success: boolean; data: any }> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch("/api/activity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to log activity");
  }

  return response.json();
}

export async function fetchActivities(
  params: { type?: string; search?: string; limit?: number } = {}
): Promise<{ success: boolean; data: any[]; total?: number }> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const query = new URLSearchParams();
  if (params.type) query.append("type", params.type);
  if (params.search) query.append("search", params.search);
  if (params.limit) query.append("limit", params.limit.toString());

  const response = await fetch(`/api/activity?${query.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch activities");
  }

  return response.json();
}

export async function updateActivity(
  id: string,
  data: { description: string }
): Promise<{ success: boolean; data: any }> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`/api/activity/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update activity");
  }

  return response.json();
}
