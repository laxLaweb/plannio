async function request(url, options = {}) {
  const response = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

export function createPoll(payload) {
  return request("/api/polls", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listPolls() {
  return request("/api/polls");
}

export function getPoll(id) {
  return request(`/api/polls/${id}`);
}

export function registerWithPassword(payload) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginWithPassword(payload) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deletePoll(id) {
  return request(`/api/polls/${id}`, {
    method: "DELETE",
  });
}

export function deleteAccount() {
  return request("/api/auth/account", {
    method: "DELETE",
  });
}

export function lockPollOption(id, optionId) {
  return request(`/api/polls/${id}/lock`, {
    method: "POST",
    body: JSON.stringify({ optionId }),
  });
}

export function sendPollReminder(id) {
  return request(`/api/polls/${id}/remind`, {
    method: "POST",
  });
}

export function getPublicPoll(slug, voterName) {
  const params = voterName ? `?voterName=${encodeURIComponent(voterName)}` : "";
  return request(`/api/p/${slug}${params}`);
}

export function submitVote(slug, { optionIds, voterName }) {
  return request(`/api/p/${slug}/vote`, {
    method: "POST",
    body: JSON.stringify({ optionIds, voterName }),
  });
}
