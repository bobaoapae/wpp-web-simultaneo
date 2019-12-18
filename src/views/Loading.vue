<template>
   <div id="loading">
      <LoadginSpinner/>
   </div>
</template>

<script>
import LoadginSpinner from '@/components/shared/loadingSpinner/LoadingSpinner';

export default {
    name: 'Loading',
    components: {
        LoadginSpinner
    }
};
</script>

<style scoped>
   #loading {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f2f2f2;
   }

</style>
