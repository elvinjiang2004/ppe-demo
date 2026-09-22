"use strict";
(function () {
  class PageHeader extends HTMLElement {
    connectedCallback() {
      var home = this.getAttribute("home") || "index.html";
      var wrapper = document.createElement("div");
      wrapper.className = "page-width header-content";
      var navigation = document.createElement("div");
      navigation.className = "header-navigation";
      var title = document.createElement("a");
      title.className = "wordmark";
      title.href = home;
      title.textContent = "Personal Projects Explorer";
      var about = document.createElement("a");
      about.className = "header-link";
      about.href = home.replace(/[^/]*$/, "about.html");
      about.textContent = "About";
      navigation.append(title, about);
      var category = document.createElement("span");
      category.textContent = this.getAttribute("category") || "";
      wrapper.append(navigation, category);
      this.replaceChildren(wrapper);
    }
  }
  class PageFooter extends HTMLElement {
    connectedCallback() {
      var wrapper = document.createElement("div");
      wrapper.className = "page-width";
      wrapper.textContent = "Personal Projects Explorer";
      this.replaceChildren(wrapper);
    }
  }
  customElements.define("page-header", PageHeader);
  customElements.define("page-footer", PageFooter);
})();
