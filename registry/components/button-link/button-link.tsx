/**
 * A link that looks exactly like a Button. Navigation is a link, never a button that pushes a route, so it opens in a new
 * tab, shows its address and works without JavaScript. No client code: it renders on the server as a plain <a>.
 *
 *   <ButtonLink href="/sign-in">Sign in</ButtonLink>
 *   <ButtonLink href="/docs" variant="secondary" as={Link}>Read the docs</ButtonLink>
 *
 * Pass `as` to render your router's link (next/link, a wrapped React Router Link); it receives `href`, `className`,
 * `data-variant` and the other anchor props.
 */
import type { AnchorHTMLAttributes, ComponentType, ReactNode } from "react";
import buttonStyles from "@/registry/components/button/button.module.css";
import type { ButtonSize, ButtonVariant } from "@/registry/components/button/button";
import styles from "./button-link.module.css";

export interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** The element to render instead of <a>, such as next/link. */
  as?: ComponentType<AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>;
  children: ReactNode;
}

export function ButtonLink({ href, variant = "primary", size = "md", as: Anchor, className, children, ...props }: ButtonLinkProps) {
  const classes = [buttonStyles.button, buttonStyles[variant], buttonStyles[size], styles.link, className].filter(Boolean).join(" ");
  const content = <span className={styles.content}>{children}</span>;
  if (Anchor) return <Anchor {...props} href={href} data-variant={variant} className={classes}>{content}</Anchor>;
  return <a {...props} href={href} data-variant={variant} className={classes}>{content}</a>;
}

export default ButtonLink;
