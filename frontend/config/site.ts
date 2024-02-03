export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "CRUD",
  description:
    "A simple crud application with NextJS (with the new serverside components logic - based in React), Tailwind CSS and much more!",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Suppliers",
      href: "/supplies",
    },
    {
      title: "Companies",
      href: "/companies",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/kylix31",
    docs: "https://ui.shadcn.com",
  },
}
