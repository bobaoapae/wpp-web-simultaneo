<template>
    <div class="header">
        <div class="header-container">
            <div class="button-container">
                <button @click="handleClick">
                    <span data-icon="back-light" class="">
                        <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path fill="#FFF" d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20v-2z">
                            </path>
                        </svg>
                    </span>
                </button>
            </div>

            <div class="label">Nova conversa</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Header',
    methods: {
        handleClick () {
            this.$root.$emit('showNewChat', false);
        }
    }
};
</script>

<style scoped>
.header{
    display: flex;
    flex: none;
    box-sizing: border-box;
    color: #fff;
    height: 108px;
    flex-direction: column;
    justify-content: flex-end;
    background-color: #00bfa5;
    padding-right: 20px;
    padding-left: 23px;
}

.header-container {
    height: 59px;
    align-items: center;
    display: flex;
    flex: none;
    width: 100%;
}

.button-container {
    width: 53px;
    flex: none;
}

button {
    cursor: pointer;
    vertical-align: top;
    flex: none;
    outline: none;
    border: 0;
    padding: 0;
    background: none;
    font-family: Segoe UI,Helvetica Neue,Helvetica,Lucida Grande,Arial,Ubuntu,Cantarell,Fira Sans,sans-serif;
    margin: 0;
}

.label {
    margin-top: -3px;
    font-weight: 500;
    flex-grow: 1;
    font-size: 19px;
    line-height: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
