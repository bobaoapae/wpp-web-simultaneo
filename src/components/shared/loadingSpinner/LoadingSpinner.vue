<template>
    <div id="loading">
        <svg width="50" height="50" viewBox="0 0 44 44">
            <circle  cx="22" cy="22" r="20" fill="none" stroke-width="4" />
        </svg>
    </div>
</template>

<script>
    export  default {
        name: 'LoadginSpinner'
    }
</script>


<style scoped>
    svg {
        display: block;
        pointer-events: none;
        z-index: 2;
        animation: rotate 2s linear infinite;
    }

    circle {
        stroke: #acb9bf;
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
        stroke-linecap: round;
        animation: spinner 1.5s ease-in-out infinite;
    }

    @keyframes rotate {
        100% {
            transform: rotate(1turn);
        }
    }

    @keyframes spinner {
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