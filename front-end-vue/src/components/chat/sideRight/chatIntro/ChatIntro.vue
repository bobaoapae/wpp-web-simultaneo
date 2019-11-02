<template>
    <div id="chat-intro">
        <div class="chat-intro-container">
            <div class="box-img">
                <img src="@/assets/images/intro-connection.jpg" alt="Intro image" />
            </div>

            <div class="box-info">
                <h1>Mantenha seu celular conectado</h1>
                <div>O WhatsApp conecta ao seu telefone para sincronizar suas mensagens. Para reduzir o uso de dados, conecte seu telefone a uma rede Wi-Fi.</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ChatIntro"
};
</script>

<style scoped>
#chat-intro {
    background: #f7f9fa;
    height: 100%;
    display: flex;
    justify-content: center;
}

.chat-intro-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80%;
    max-width: 460px;
}

.box-img {
    text-align: center;
    height: 356px;
}

.box-img img {
    height: 100%;
}

.box-info h1 {
    text-align: center;
    color: #4b5961;
    font-size: 36px;
    font-weight: 300;
    margin-top: 28px;
}

.box-info div {
    text-align: center;
    font-size: 14px;
    color: #929fa6;
    line-height: 20px;
    margin-top: 18px;
}
</style>