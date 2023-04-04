<template>
  <div class="bg">
    <div class="content">
      <div class="content-header"></div>
      <div id="table">
        <div>
          <div id="table-heading">
            <div class="order-id">ID</div>
            <div>Operador</div>
            <div>Função</div>
            <div>Telefone</div>
            <router-link class="new-btn" to="/newoperator" tag="button">
              +
            </router-link>
          </div>
        </div>
        <div id="table-rows">
          <div class="table-row">
            <div class="order-number">1</div>
            <div>Adriana</div>
            <div>Programador</div>
            <div>+55 44 9 5124 4123</div>
            <button class="edit-btn">
              <img
                src="@/assets/images/edit.png"
                alt="edit"
                class="icon-default"
              />
            </button>
            <button class="delete-btn">
              <img
                src="@/assets/images/delete.svg"
                alt="delete"
                class="icon-default"
              />
            </button>
          </div>
          <div class="controller-label">
            <button class="list-btn">
              <img
                src="@/assets/images/left.png"
                alt="<"
                class="icon-default"
              />
            </button>
            <p>1/1</p>
            <button class="list-btn">
              <img
                src="@/assets/images/right.png"
                alt=">"
                class="icon-default"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'OperatorDashboard'
};
</script>

<style scoped>
.bg {
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
  background-image: url("../assets/images/bg-login.png");
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
  flex: 2;
  background: #fff;
  border-radius: 10px;
  z-index: 1;
  box-shadow: 0 17px 50px 0 rgba(0, 0, 0, 0.19),
    0 12px 15px 0 rgba(0, 0, 0, 0.24);
  margin-left: 18%;
  margin-right: 18%;
}

#table {
  background-color: white;
  max-width: 1200px;
  margin: 0 auto;
}

#table-heading,
#table-rows,
.table-row,
.controller-label {
  display: flex;
  flex-wrap: wrap;
}

#table-heading {
  font-weight: bold;
  padding: 12px;
  border-bottom: 3px solid #333;
  border-top: 3px solid #333;
  margin-top: 10px;
}

.table-row {
  width: 100%;
  padding: 12px;
  border-bottom: 1px solid #ccc;
}

#table-rows {
  border-bottom: 3px solid #333;
  margin-bottom: 10px;
}

#table-heading div,
.table-row div {
  width: 19%;
}

#table-heading .order-id,
.table-row .order-number {
  width: 5%;
}

select {
  padding: 12px 6px;
  margin-right: 12px;
}

.new-btn {
  background-color: green;
  color: black;
  border-color: grey;
  height: 40px;
  width: 40px;
  border-radius: 50px;
  margin-top: -5px;
  margin-bottom: -20px;
  font-weight: bold;
  font-size: 20px;
}

.delete-btn {
  background-color: #ff2a00;
  border-color: grey;
  height: 40px;
  width: 40px;
  border-radius: 50px;
  margin-left: 10px;
  margin-top: -5px;
  margin-bottom: -20px;
}

.edit-btn {
  background-color: #ffe600;
  border-color: grey;
  height: 40px;
  width: 40px;
  border-radius: 50px;
  margin-top: -5px;
  margin-bottom: -50px;
}

.controller-label {
  margin-top: 10px;
  margin-left: 40%;
  align-content: center;
  align-items: center;
}

.list-btn {
  margin-top: -15px;
  margin-right: 10px;
  margin-left: 10px;
  border: transparent;
  background: transparent;
  color: blue;
}

.icon-default {
  height: 25px;
  width: 25px;
}
</style>
