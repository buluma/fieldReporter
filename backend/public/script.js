const statusEl = document.querySelector("#serviceStatus .value");
const statusDot = document.querySelector("#serviceStatus .dot");
const usersBody = document.querySelector("#usersBody");
const refreshButton = document.querySelector("#refreshUsers");

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const setStatus = (status, label, color) => {
  statusEl.textContent = label;
  statusDot.style.background = color;
  statusDot.setAttribute("aria-label", status);
};

const renderUsers = (users) => {
  if (!users.length) {
    usersBody.innerHTML =
      '<tr><td colspan="4" class="empty">No users found.</td></tr>';
    return;
  }

  usersBody.innerHTML = users
    .map(
      (user) => `
        <tr>
          <td>${user.username}</td>
          <td>${user.role}</td>
          <td>${formatDateTime(user.createdAt)}</td>
          <td>${formatDateTime(user.updatedAt)}</td>
        </tr>
      `,
    )
    .join("");
};

const loadStatus = async () => {
  try {
    const response = await fetch("/health");
    if (!response.ok) {
      throw new Error("Service unavailable");
    }
    const data = await response.json();
    if (data.status === "ok") {
      setStatus("healthy", "Healthy", "var(--success)");
    } else {
      setStatus("warning", "Degraded", "var(--warning)");
    }
  } catch (error) {
    setStatus("down", "Offline", "#ef4444");
  }
};

const loadUsers = async () => {
  usersBody.innerHTML =
    '<tr><td colspan="4" class="empty">Loading users…</td></tr>';
  try {
    const response = await fetch("/users");
    if (!response.ok) {
      throw new Error("Failed to load users");
    }
    const data = await response.json();
    renderUsers(data.users || []);
  } catch (error) {
    usersBody.innerHTML =
      '<tr><td colspan="4" class="empty">Unable to load users.</td></tr>';
  }
};

refreshButton.addEventListener("click", () => {
  loadUsers();
});

loadStatus();
loadUsers();
