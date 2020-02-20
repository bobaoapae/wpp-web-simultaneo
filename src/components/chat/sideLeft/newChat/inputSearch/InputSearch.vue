<template>
    <div class="input-search">
        <div class="input-search-container">
            <button>
                <div>
                    <span class="" data-icon="search">
                        <svg height="24" id="Layer_1" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M15.009 13.805h-.636l-.22-.219a5.184 5.184 0 0 0 1.256-3.386 5.207 5.207 0 1 0-5.207 5.208 5.183 5.183 0 0 0 3.385-1.255l.221.22v.635l4.004 3.999 1.194-1.195-3.997-4.007zm-4.808 0a3.605 3.605 0 1 1 0-7.21 3.605 3.605 0 0 1 0 7.21z"
                                fill="#263238"
                                fill-opacity=".3">

                            </path>
                        </svg>
                    </span>
                </div>
            </button>

            <div class="input-label" v-show="!inputSearch">Buscar contatos</div>

            <label for="search">
                <input @input="handleInput" id="search" title="Buscar contatos" type="search" v-model="inputSearch">
            </label>
        </div>
    </div>
</template>

<script>
export default {
    name: 'InputSearch',
    data () {
        return {
            inputSearch: ''
        };
    },
    methods: {
        handleInput () {
            this.$root.$emit('searchNewChat', this.inputSearch);
        }
    }
};
</script>

<style scoped>
.input-search-container {
    height: 49px;
    box-sizing: border-box;
    flex: none;
    position: relative;
}

label {
    left: 12px;
    padding-left: 65px;
    padding-right: 32px;
    right: 14px;
    background-color: #fff;
    border-radius: 18px;
    align-items: center;
    box-sizing: border-box;
    display: flex;
    height: 35px;
    position: absolute;
    top: 7px;
}

input {
    border: none;
    padding: 0;
    font-size: 15px;
    font-weight: 400;
    line-height: 20px;
    min-height: 20px;
    outline: none;
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
    width: 100%;
    z-index: 1;
}

button {
    left: 24px;
    height: 24px;
    position: absolute;
    top: 11px;
    width: 24px;
    z-index: 100;
    outline: none;
    border: 0;
    padding: 0;
    background: none;
    cursor: pointer;
    font-family: Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu, Cantarell, Fira Sans, sans-serif;
    margin: 0;
}

.input-label {
    left: 77px;
    right: 24px;
    color: #999;
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    text-overflow: ellipsis;
    top: 15px;
    transition: opacity .14s linear;
    white-space: nowrap;
    z-index: 100;
}
</style>
