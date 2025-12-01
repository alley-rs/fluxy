import { type Component, type JSX, Show, mergeProps } from "solid-js";
import * as styles from "./Card.css";

export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hoverable?: boolean;
  children?: JSX.Element;
}

export const Card: Component<CardProps> = (props) => {
  const merged = mergeProps({ padding: "md", hoverable: false }, props);

  return (
    <div
      class={`${styles.cardBase} ${styles.cardPadding[merged.padding as keyof typeof styles.cardPadding]} ${
        merged.hoverable ? styles.cardHoverable : ""
      } ${props.class || ""}`}
      {...props}
    >
      <Show when={merged.title || merged.subtitle}>
        <div class={styles.cardHeader}>
          <Show when={merged.title}>
            <h3 class={styles.cardTitle}>{merged.title}</h3>
          </Show>
          <Show when={merged.subtitle}>
            <p class={styles.cardSubtitle}>{merged.subtitle}</p>
          </Show>
        </div>
      </Show>
      {merged.children}
    </div>
  );
};
