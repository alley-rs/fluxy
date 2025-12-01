import { type Component, mergeProps, splitProps } from "solid-js";
import * as styles from "./Progress.css";

interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "success" | "warning" | "error";
  showLabel?: boolean;
  class?: string;
}

export const Progress: Component<ProgressProps> = (props) => {
  const merged = mergeProps(
    { size: "md" as const, variant: "primary" as const, max: 100, value: 0 },
    props,
  );
  const [local, others] = splitProps(merged, [
    "value",
    "max",
    "size",
    "variant",
    "showLabel",
    "class",
  ]);

  const percentage = () =>
    Math.min(100, Math.max(0, (local.value / local.max) * 100));

  return (
    <div
      class={styles.progressTrack}
      classList={{
        [styles.sizeVariants[local.size]]: true,
        [local.class || ""]: !!local.class,
      }}
      role="progressbar"
      aria-valuenow={local.value}
      aria-valuemin={0}
      aria-valuemax={local.max}
      {...others}
    >
      <div
        class={styles.progressFill}
        classList={{
          [styles.variantVariants[local.variant]]: percentage() < 100,
          [styles.variantVariants.success]: percentage() === 100,
        }}
        style={{ width: `${percentage()}%` }}
      />
    </div>
  );
};
