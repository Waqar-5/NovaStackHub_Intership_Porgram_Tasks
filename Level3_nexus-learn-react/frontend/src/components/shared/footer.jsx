import { Link } from "react-router-dom";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/shared/brand-icons";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Courses", href: "#courses" },
      { label: "Teachers", href: "#teachers" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link to="/" className="font-display text-lg font-bold text-gradient-signature">
              Nexus Learn
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              A premium learning platform for students, teachers, and the people who run
              both.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="GitHub" className="glass rounded-md p-2 hover:text-primary">
                <GithubIcon className="size-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="glass rounded-md p-2 hover:text-primary">
                <LinkedinIcon className="size-4" />
              </a>
              <a href="#" aria-label="Twitter" className="glass rounded-md p-2 hover:text-primary">
                <TwitterIcon className="size-4" />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-display text-sm font-semibold">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Nexus Learn. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
