import { keyframes } from "@vanilla-extract/css";

/**
 * ============================================
 * 淡入淡出动画
 * ============================================
 */

/**
 * 淡入动画
 * @example
 * animation: `${fadeIn} ${tokens.duration.normal} ${tokens.easing.easeOut}`
 */
export const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

/**
 * 淡出动画
 */
export const fadeOut = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

/**
 * ============================================
 * 滑入动画
 * ============================================
 */

/**
 * 从上方滑入
 * 适用于下拉菜单、通知等
 */
export const slideInFromTop = keyframes({
  from: {
    transform: "translateY(-100%)",
    opacity: 0,
  },
  to: {
    transform: "translateY(0)",
    opacity: 1,
  },
});

/**
 * 从下方滑入
 * 适用于底部面板、Toast 等
 */
export const slideInFromBottom = keyframes({
  from: {
    transform: "translateY(100%)",
    opacity: 0,
  },
  to: {
    transform: "translateY(0)",
    opacity: 1,
  },
});

/**
 * 从左侧滑入
 * 适用于侧边栏、抽屉等
 */
export const slideInFromLeft = keyframes({
  from: {
    transform: "translateX(-100%)",
    opacity: 0,
  },
  to: {
    transform: "translateX(0)",
    opacity: 1,
  },
});

/**
 * 从右侧滑入
 * 适用于侧边栏、抽屉等
 */
export const slideInFromRight = keyframes({
  from: {
    transform: "translateX(100%)",
    opacity: 0,
  },
  to: {
    transform: "translateX(0)",
    opacity: 1,
  },
});

/**
 * ============================================
 * 滑出动画
 * ============================================
 */

/**
 * 向上滑出
 */
export const slideOutToTop = keyframes({
  from: {
    transform: "translateY(0)",
    opacity: 1,
  },
  to: {
    transform: "translateY(-100%)",
    opacity: 0,
  },
});

/**
 * 向下滑出
 */
export const slideOutToBottom = keyframes({
  from: {
    transform: "translateY(0)",
    opacity: 1,
  },
  to: {
    transform: "translateY(100%)",
    opacity: 0,
  },
});

/**
 * 向左滑出
 */
export const slideOutToLeft = keyframes({
  from: {
    transform: "translateX(0)",
    opacity: 1,
  },
  to: {
    transform: "translateX(-100%)",
    opacity: 0,
  },
});

/**
 * 向右滑出
 */
export const slideOutToRight = keyframes({
  from: {
    transform: "translateX(0)",
    opacity: 1,
  },
  to: {
    transform: "translateX(100%)",
    opacity: 0,
  },
});

/**
 * ============================================
 * 缩放动画
 * ============================================
 */

/**
 * 缩放进入
 * 适用于模态框、弹窗等
 */
export const scaleIn = keyframes({
  from: {
    transform: "scale(0.9)",
    opacity: 0,
  },
  to: {
    transform: "scale(1)",
    opacity: 1,
  },
});

/**
 * 缩放退出
 */
export const scaleOut = keyframes({
  from: {
    transform: "scale(1)",
    opacity: 1,
  },
  to: {
    transform: "scale(0.9)",
    opacity: 0,
  },
});

/**
 * 从小到大缩放
 */
export const scaleUp = keyframes({
  from: {
    transform: "scale(0)",
  },
  to: {
    transform: "scale(1)",
  },
});

/**
 * 从大到小缩放
 */
export const scaleDown = keyframes({
  from: {
    transform: "scale(1)",
  },
  to: {
    transform: "scale(0)",
  },
});

/**
 * ============================================
 * 旋转动画
 * ============================================
 */

/**
 * 360度旋转
 * 适用于加载指示器、刷新按钮等
 */
export const spin = keyframes({
  from: {
    transform: "rotate(0deg)",
  },
  to: {
    transform: "rotate(360deg)",
  },
});

/**
 * 反向旋转
 */
export const spinReverse = keyframes({
  from: {
    transform: "rotate(360deg)",
  },
  to: {
    transform: "rotate(0deg)",
  },
});

/**
 * ============================================
 * 弹跳动画
 * ============================================
 */

/**
 * 垂直弹跳
 * 适用于提示箭头、加载动画等
 */
export const bounce = keyframes({
  "0%, 100%": {
    transform: "translateY(0)",
    animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
  },
  "50%": {
    transform: "translateY(-25%)",
    animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
  },
});

/**
 * 水平弹跳
 */
export const bounceHorizontal = keyframes({
  "0%, 100%": {
    transform: "translateX(0)",
    animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
  },
  "50%": {
    transform: "translateX(-25%)",
    animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
  },
});

/**
 * ============================================
 * 脉冲动画
 * ============================================
 */

/**
 * 透明度脉冲
 * 适用于加载占位符、呼吸灯效果等
 */
export const pulse = keyframes({
  "0%, 100%": {
    opacity: 1,
  },
  "50%": {
    opacity: 0.5,
  },
});

/**
 * 缩放脉冲
 * 适用于提示点、通知图标等
 */
export const pulsing = keyframes({
  "0%": {
    transform: "scale(1)",
    opacity: 1,
  },
  "50%": {
    transform: "scale(1.05)",
    opacity: 0.8,
  },
  "100%": {
    transform: "scale(1)",
    opacity: 1,
  },
});

/**
 * ============================================
 * 摇晃动画
 * ============================================
 */

/**
 * 水平摇晃
 * 适用于错误提示、表单验证失败等
 */
export const shake = keyframes({
  "0%, 100%": {
    transform: "translateX(0)",
  },
  "10%, 30%, 50%, 70%, 90%": {
    transform: "translateX(-8px)",
  },
  "20%, 40%, 60%, 80%": {
    transform: "translateX(8px)",
  },
});

/**
 * 垂直摇晃
 */
export const shakeVertical = keyframes({
  "0%, 100%": {
    transform: "translateY(0)",
  },
  "10%, 30%, 50%, 70%, 90%": {
    transform: "translateY(-8px)",
  },
  "20%, 40%, 60%, 80%": {
    transform: "translateY(8px)",
  },
});

/**
 * ============================================
 * 翻转动画
 * ============================================
 */

/**
 * 水平翻转
 * 适用于卡片翻转、图标切换等
 */
export const flipHorizontal = keyframes({
  from: {
    transform: "rotateY(0deg)",
  },
  to: {
    transform: "rotateY(180deg)",
  },
});

/**
 * 垂直翻转
 */
export const flipVertical = keyframes({
  from: {
    transform: "rotateX(0deg)",
  },
  to: {
    transform: "rotateX(180deg)",
  },
});

/**
 * ============================================
 * 进度动画
 * ============================================
 */

/**
 * 进度条填充
 * 从左到右的填充动画
 */
export const progressFill = keyframes({
  from: {
    transform: "translateX(-100%)",
  },
  to: {
    transform: "translateX(0)",
  },
});

/**
 * 无限进度条
 * 适用于不确定进度的加载状态
 */
export const progressIndeterminate = keyframes({
  "0%": {
    transform: "translateX(-100%)",
  },
  "50%": {
    transform: "translateX(0)",
  },
  "100%": {
    transform: "translateX(100%)",
  },
});

/**
 * ============================================
 * 骨架屏动画
 * ============================================
 */

/**
 * 骨架屏闪烁效果
 * 适用于内容加载占位
 */
export const shimmer = keyframes({
  "0%": {
    backgroundPosition: "-200% 0",
  },
  "100%": {
    backgroundPosition: "200% 0",
  },
});

/**
 * ============================================
 * 波纹动画
 * ============================================
 */

/**
 * 涟漪效果
 * 适用于点击反馈、加载状态等
 */
export const ripple = keyframes({
  "0%": {
    transform: "scale(0)",
    opacity: 1,
  },
  "100%": {
    transform: "scale(4)",
    opacity: 0,
  },
});

/**
 * 波浪效果
 */
export const wave = keyframes({
  "0%, 100%": {
    transform: "translateY(0)",
  },
  "50%": {
    transform: "translateY(-10px)",
  },
});

/**
 * ============================================
 * 心跳动画
 * ============================================
 */

/**
 * 心跳效果
 * 适用于点赞、收藏等交互
 */
export const heartbeat = keyframes({
  "0%": {
    transform: "scale(1)",
  },
  "14%": {
    transform: "scale(1.3)",
  },
  "28%": {
    transform: "scale(1)",
  },
  "42%": {
    transform: "scale(1.3)",
  },
  "70%": {
    transform: "scale(1)",
  },
});
