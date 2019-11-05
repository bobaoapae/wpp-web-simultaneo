<template>
    <div class="loading-media">
        <div class="box-circle">
            <svg width="50" height="50" viewBox="0 0 43 43" class="spinner">
                <circle
                        cx="21.5"
                        cy="21.5"
                        r="20"
                        fill="none"
                        stroke-width="3"
                >
                </circle>
            </svg>
        </div>

        <div class="box-cross">
            <span data-icon="media-cancel">
                <svg id="Layer_1"
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 44 44" width="44"
                     height="44">
                    <path fill="#FFF"
                          d="M29.377 16.099l-1.475-1.475L22 20.525l-5.901-5.901-1.476 1.475L20.525 22l-5.901 5.901 1.476 1.475 5.9-5.901 5.901 5.901 1.475-1.475L23.475 22l5.902-5.901z">
                    </path>
                </svg>
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "LoadingMedia"
    }
</script>

<style scoped>
    .loading-media {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .box-circle {
        position: absolute;
        background-color: rgba(0,0,0,0.17);
        border-radius: 50%;

    }

    .box-cross {
        position: absolute;
    }

    svg.spinner {
        animation: rotate 2s linear infinite;
        border-radius: 50%;
    }

    .spinner circle {
        animation: daley 1.5s ease-in-out infinite;
        stroke: hsla(0, 0%, 100%, .9);
    }

    @keyframes daley {
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

    @keyframes rotate {
        100% {
            transform: rotate(1turn);
        }
    }
</style>