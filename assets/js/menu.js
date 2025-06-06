const container = document.querySelector(".container");
const allMenus = document.querySelectorAll(".menu");

// Hide menus on body click
document.body.addEventListener("click", () => {
  allMenus.forEach(menu => {
    if (menu.classList.contains("open")) {
      menu.classList.remove("open");
    }
  });
});

// Reset menus on resize
window.addEventListener("resize", () => {
  allMenus.forEach(menu => {
    menu.classList.remove("open");
  });
});

handleMenuInteract = (menu, dropdown) => (event) => {
  event.stopPropagation();

  if (menu.classList.contains("open")) {
    menu.classList.remove("open");
  } else {
    // Close all menus...
    allMenus.forEach(m => m.classList.remove("open"));
    // ...before opening the current one
    menu.classList.add("open");
  }

  if (dropdown.getBoundingClientRect().right > container.getBoundingClientRect().right) {
    dropdown.style.left = "auto";
    dropdown.style.right = 0;
  }
}

// Handle desktop menu
allMenus.forEach(menu => {
  const trigger = menu.querySelector(".menu__trigger");
  const dropdown = menu.querySelector(".menu__dropdown");

  trigger.addEventListener("click", handleMenuInteract(menu, dropdown));
  trigger.addEventListener("keydown", event => {
    if (event.code === "Enter") {
      handleMenuInteract(menu, dropdown)(event);
    }
  });

  dropdown.addEventListener("click", event => event.stopPropagation());
});
