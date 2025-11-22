document.addEventListener("DOMContentLoaded", () => {
  const triggers = document.querySelectorAll("[data-modal]");
  const modals = document.querySelectorAll(".modal");

  function openModal(key) {
    const modal = document.getElementById(`modal-${key}`);
    if (!modal) return;
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal(modal) {
    modal.setAttribute("aria-hidden", "true");
  }

  triggers.forEach((item) => {
    item.addEventListener("click", () => {
      const key = item.getAttribute("data-modal");
      if (key) openModal(key);
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });

    modal.querySelectorAll("[data-close]").forEach((btn) => {
      btn.addEventListener("click", () => closeModal(modal));
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      modals.forEach((modal) => closeModal(modal));
    }
  });
});
