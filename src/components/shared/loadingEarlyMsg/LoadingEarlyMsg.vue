<template>
   <div
      class="_2sOZc"
      title="Carregando mensagens..."
   >
      <svg
         class="_2bESe"
         height="24"
         viewBox="0 0 46 46"
         width="24"
      >
         <circle
            class="oWVod XqrVN"
            cx="23"
            cy="23"
            fill="none"
            r="20"
            stroke-width="6"
         >
         </circle>
      </svg>
   </div>
</template>

<script>
export default {
    name: 'LoadingEarlyMsg'
};
</script>

<style scoped>
   ._2sOZc {
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06), 0 2px 5px 0 rgba(0, 0, 0, 0.2);
      background-color: #fff;
      border-radius: 50%;
      margin: 0 auto;
      margin-bottom: 15px;
      align-items: center;
      display: flex;
      width: 44px;
      height: 44px;
      justify-content: center;
   }

   svg {
      animation: rotate 2s linear infinite;
   }

   circle {
      stroke: rgba(27, 154, 89, 0.7);
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
      stroke-linecap: round;
      animation: rodar 1.5s ease-in-out infinite;
   }

   @keyframes rotate {
      100% {
         transform: rotate(1turn);
      }
   }

   @keyframes rodar {
      0% {
         stroke-dasharray: 1, 150;
         stroke-dashoffset: 0;
      }
      50% {
         stroke-dasharray: 90, 150;
         stroke-dashoffset: -35;
      }
      100% {
         stroke-dasharray: 90, 150;
         stroke-dashoffset: -124;
      }
   }
</style>
