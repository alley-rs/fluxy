import { mergeProps } from "solid-js";
import * as styles from "./index.css";

interface EmptyListProps {
  title?: string;
  description?: string;
}

export default function EmptyList(props: EmptyListProps) {
  const merged = mergeProps(
    { title: "暂无内容", description: "列表是空的，快来添加第一项吧" } as const,
    props,
  );

  return (
    <div class={styles.wrapper}>
      <svg
        width="280"
        height="280"
        viewBox="0 0 280 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Empty List</title>
        {/* 底部阴影 */}
        <ellipse
          cx="140"
          cy="250"
          rx="100"
          ry="15"
          fill="url(#shadowGradient)"
          opacity="0.2"
        />

        {/* 剪贴板背景 */}
        <g filter="url(#clipboardShadow)">
          <rect
            x="70"
            y="50"
            width="140"
            height="180"
            rx="12"
            fill="url(#clipboardGradient)"
          />

          {/* 剪贴板顶部夹子 */}
          <rect
            x="115"
            y="40"
            width="50"
            height="25"
            rx="6"
            fill="url(#clipGradient)"
          />

          {/* 夹子高光 */}
          <rect
            x="115"
            y="40"
            width="50"
            height="12"
            rx="6"
            fill="rgba(255,255,255,0.2)"
          />

          {/* 夹子内部细节 */}
          <rect
            x="120"
            y="48"
            width="40"
            height="10"
            rx="3"
            fill="url(#clipInnerGradient)"
          />
        </g>

        {/* 纸张内容区域 */}
        <rect
          x="85"
          y="75"
          width="110"
          height="140"
          rx="6"
          fill={styles.emptyListThemeContract.color.paper}
          opacity="0.95"
        />

        {/* 空列表项 - 带有圆形图标和线条 */}
        <g opacity="0.2">
          {/* 第一项 */}
          <circle
            cx="100"
            cy="100"
            r="8"
            fill={styles.emptyListThemeContract.color.listItem}
          />
          <rect
            x="115"
            y="95"
            width="60"
            height="4"
            rx="2"
            fill={styles.emptyListThemeContract.color.listItem}
          />
          <rect
            x="115"
            y="103"
            width="40"
            height="3"
            rx="1.5"
            fill={styles.emptyListThemeContract.color.listItemLight}
          />

          {/* 第二项 */}
          <circle
            cx="100"
            cy="130"
            r="8"
            fill={styles.emptyListThemeContract.color.listItem}
          />
          <rect
            x="115"
            y="125"
            width="55"
            height="4"
            rx="2"
            fill={styles.emptyListThemeContract.color.listItem}
          />
          <rect
            x="115"
            y="133"
            width="45"
            height="3"
            rx="1.5"
            fill={styles.emptyListThemeContract.color.listItemLight}
          />

          {/* 第三项 */}
          <circle
            cx="100"
            cy="160"
            r="8"
            fill={styles.emptyListThemeContract.color.listItem}
          />
          <rect
            x="115"
            y="155"
            width="50"
            height="4"
            rx="2"
            fill={styles.emptyListThemeContract.color.listItem}
          />
          <rect
            x="115"
            y="163"
            width="35"
            height="3"
            rx="1.5"
            fill={styles.emptyListThemeContract.color.listItemLight}
          />

          {/* 第四项 */}
          <circle
            cx="100"
            cy="190"
            r="8"
            fill={styles.emptyListThemeContract.color.listItem}
          />
          <rect
            x="115"
            y="185"
            width="45"
            height="4"
            rx="2"
            fill={styles.emptyListThemeContract.color.listItem}
          />
          <rect
            x="115"
            y="193"
            width="50"
            height="3"
            rx="1.5"
            fill={styles.emptyListThemeContract.color.listItemLight}
          />
        </g>

        {/* 中央空状态图标 - 盒子 */}
        <g transform="translate(115, 120)">
          {/* 盒子主体 */}
          <rect
            x="0"
            y="10"
            width="50"
            height="40"
            rx="4"
            fill="url(#boxGradient)"
            filter="url(#boxShadow)"
          />

          {/* 盒子顶部 */}
          <path d="M0 10 L25 0 L50 10 L25 20 Z" fill="url(#boxTopGradient)" />

          {/* 盒子侧面 */}
          <path
            d="M50 10 L25 20 L25 60 L50 50 Z"
            fill="url(#boxSideGradient)"
          />

          {/* 盒子高光 */}
          <rect
            x="2"
            y="12"
            width="20"
            height="25"
            rx="2"
            fill="rgba(255,255,255,0.2)"
          />

          {/* 盒子内部 - 空的感觉 */}
          <ellipse cx="25" cy="18" rx="15" ry="4" fill="rgba(0,0,0,0.1)" />
        </g>

        {/* 装饰性星星 */}
        <g opacity="0.2">
          <circle
            cx="220"
            cy="80"
            r="2"
            fill="var(--emptyList-color-decoration)"
          />
          <circle
            cx="60"
            cy="120"
            r="3"
            fill="var(--emptyList-color-decoration)"
          />
          <circle
            cx="215"
            cy="180"
            r="2.5"
            fill="var(--emptyList-color-decoration)"
          />
        </g>

        {/* 渐变定义 */}
        <defs>
          {/* 剪贴板渐变 */}
          <linearGradient
            id="clipboardGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              stop-color={styles.emptyListThemeContract.color.clipboardFrom}
            />
            <stop
              offset="100%"
              stop-color={styles.emptyListThemeContract.color.clipboardTo}
            />
          </linearGradient>

          {/* 夹子渐变 */}
          <linearGradient id="clipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              stop-color={styles.emptyListThemeContract.color.clipFrom}
            />
            <stop
              offset="100%"
              stop-color={styles.emptyListThemeContract.color.clipTo}
            />
          </linearGradient>

          <linearGradient
            id="clipInnerGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              stop-color={styles.emptyListThemeContract.color.clipInnerFrom}
            />
            <stop
              offset="100%"
              stop-color={styles.emptyListThemeContract.color.clipInnerTo}
            />
          </linearGradient>

          {/* 盒子渐变 */}
          <linearGradient id="boxGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              stop-color={styles.emptyListThemeContract.color.boxFrom}
            />
            <stop
              offset="100%"
              stop-color={styles.emptyListThemeContract.color.boxTo}
            />
          </linearGradient>

          <linearGradient id="boxTopGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              stop-color={styles.emptyListThemeContract.color.boxTopFrom}
            />
            <stop
              offset="100%"
              stop-color={styles.emptyListThemeContract.color.boxTopTo}
            />
          </linearGradient>

          <linearGradient
            id="boxSideGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              stop-color={styles.emptyListThemeContract.color.boxSideFrom}
            />
            <stop
              offset="100%"
              stop-color={styles.emptyListThemeContract.color.boxSideTo}
            />
          </linearGradient>

          {/* 阴影渐变 */}
          <radialGradient id="shadowGradient">
            <stop
              offset="0%"
              stop-color={styles.emptyListThemeContract.color.shadow}
              stop-opacity="0.3"
            />
            <stop
              offset="100%"
              stop-color={styles.emptyListThemeContract.color.shadow}
              stop-opacity="0"
            />
          </radialGradient>

          {/* 滤镜 */}
          <filter
            id="clipboardShadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
            <feOffset dx="0" dy="8" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="boxShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
            <feOffset dx="0" dy="4" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <div class={styles.textWrapper}>
        <h3 class={styles.title}>{merged.title}</h3>
        <p class={styles.description}>{merged.description}</p>
      </div>
    </div>
  );
}
