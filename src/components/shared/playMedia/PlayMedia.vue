<template>
   <div class="play-media">
        <span class="_13zv_" data-icon="media-play">
            <svg height="24" viewBox="0 0 24 24" width="24"
                 xmlns="http://www.w3.org/2000/svg">
                <path
                   d="M19.5 10.9l-13-7.5c-1.3-.7-2.4-.1-2.4 1.4v15c0 1.5 1.1 2.1 2.4 1.4l13-7.5c1.3-.9 1.3-2.1 0-2.8z"
                   fill="#FFF">
                </path>
            </svg>
        </span>
   </div>
</template>

<script>
export default {
    name: 'PlayMedia',
    data () {
        return {
            modal: false
        };
    }
};
</script>

<style scoped>
   .play-media {
      position: absolute;
      height: 50px;
      width: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.35);
      border-radius: 50%;
      cursor: pointer;
   }

   span {
      margin-left: 2px;
   }
</style>
