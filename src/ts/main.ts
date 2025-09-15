import "../css/tailwind.css";


let darkMode = false;
const darkModeIcon = document.querySelector("#darkModeIcon") as SVGElement;
const lightModeIcon = document.querySelector("#lightModeIcon") as SVGElement;
const modeText = document.querySelector("#modeText") as HTMLSpanElement

const colorModeToggle = document.querySelector("#colorToggleMode") as HTMLButtonElement;
colorModeToggle?.addEventListener("click", toggleThemeColor);
document.documentElement.classList.toggle(
  "dark",
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
);

function toggleThemeColor(e: MouseEvent) {
  darkMode = !darkMode
  switch (darkMode) {
    case true:
      lightModeIcon.classList.toggle('hidden')
      darkModeIcon.classList.toggle('hidden')
      modeText.textContent = "light mode"
      localStorage.setItem('theme', 'dark');
      break;
    case false:
      lightModeIcon.classList.toggle('hidden')
      darkModeIcon.classList.toggle('hidden')
      modeText.textContent = "dark mode"
      localStorage.setItem('theme', 'light');


  }
  switchColorMode()
}

function switchColorMode() {
  const root = document.documentElement
  root.classList.toggle(
    "dark",
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
  );
}



