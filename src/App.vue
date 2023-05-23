<template>
   <router-view/>
</template>

<script>
export default {
    name: 'App'
};
</script>

<style>
   html,
   body {
      height: 100%;
   }

   ::-webkit-scrollbar {
      width: 6px !important;
      height: 6px !important;
   }

   ::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, .2);
   }

   ::-webkit-scrollbar-track {
      background: hsla(0, 0%, 100%, .08);
   }

   .emoji-mart-category-label span {
      background-color: #f0f0f0 !important;
      color: #969696;
   }

   .emoji-type-image.emoji-set-apple {
      background-image: url("assets/images/emojis-apple.png") !important;
   }
   .custom-space {
       height: 100%;
       width: 100%;
   }
   .default-icons {
       height: 25px;
       width: 25px;
       justify-content: center;
   }
   .default-button {
       cursor: pointer;
       margin: 5px;
       height: 35px;
       width: 30px;
   }
   .bg {
       width: 100%;
       height: 100%;
       display: flex;
       justify-content: center;
       align-items: center;
       background: linear-gradient(175deg, #009688 0%, #1ebea5 50%);
   }
   .bg:before {
       content: "";
       display: block;
       position: absolute;
       left: 0;
       top: 0;
       width: 100%;
       height: 100%;
       opacity: 0.2;
       background-image: url("@/assets/images/bg-login.png");
       background-position: center;
   }

   .content-header {
       height: 50px;
       width: 100%;
       border-top-left-radius: 10px;
       border-top-right-radius: 10px;
       background: linear-gradient(300deg, #009688 0%, #1ebea5 50%);
   }

   .content {
       align-self: start;
       flex: 2;
       background: #fff;
       border-radius: 20px;
       z-index: 1;
       box-shadow: 0 17px 50px 0 rgba(0, 0, 0, 0.19),
       0 12px 15px 0 rgba(0, 0, 0, 0.24);
       margin: 3%;
   }

   /* - - Dashboard Settings - - */

   #table-header,
   #table-rows,
   .table-row,
   .table-footer {
       display: flex;
       flex-wrap: wrap;
       text-align: center;
       justify-content: center;
   }

   #table-header {
       font-weight: bold;
       padding: 20px;
       border-bottom: 3px solid #333;
       border-top: 3px solid #333;
       justify-content: space-around;
   }

   .table-row {
       width: 100%;
       padding: 12px;
       border-bottom: 1px solid #ccc;
       justify-content: space-around;
   }

   #table-rows {
       border-bottom: 3px solid #333;
   }

   #table-header div,
   .table-row div {
       width: 19%;
       height: 30px;
   }

   .table-footer {
        padding-top: 15px;
        align-items: center;
   }

   /* - - Custom Buttons - - */
   .new-btn {
       background-color: darkseagreen;
       color: black;
       height: 35px;
       width: 35px;
       font-weight: bold;
       font-size: 15px;
       border-radius: 10px;
   }

   .delete-btn {
       background-color: indianred;
       height: 35px;
       width: 35px;
       margin-left: 10px;
       border-color: black;
       border-radius: 10px;
   }

   .dd-option-btn {
       background-color: red;
   }

   .edit-btn {
       background-color: lightblue;
       border-color: black;
       height: 35px;
       width: 35px;
       border-radius: 10px;
   }

   .list-btn {
       margin-top: -15px;
       border: transparent;
       background: transparent;
       color: blue;
   }
</style>
