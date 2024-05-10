import { createSignal, onMount } from "solid-js";
import "./index.scss";

function RippleEffect() {
  const [animationTrigger, setAnimationTrigger] = createSignal(false);

  onMount(() => {
    setAnimationTrigger(true);
  });

  return (
    <div class="ripple-container">
      {/* 中心内容可以放在这里 */}
      <div classList={{ ripple: true, active: animationTrigger() }} />
    </div>
  );
}

export default RippleEffect;
