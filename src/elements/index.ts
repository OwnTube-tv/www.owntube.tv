/**
 * Entry point for the site's custom elements. RootLayout.astro imports this module once, so Astro bundles a single
 * script per page. Each element module registers its own tag when imported, which also lets a test import one
 * element on its own.
 *
 * The elements enhance server-rendered HTML: every page must work before, and without, this script.
 */
import "./ot-app-card";
import "./ot-mobile-menu";
