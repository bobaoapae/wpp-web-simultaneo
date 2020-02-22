<template>
    <div class="location">
        <a :href="link" target="_blank" v-b-visible="handleVisible">
            <MglMap
                v-if="visible"
                :accessToken="mapboxAccessToken"
                :attributionControl="false"
                :center="[msg.lng, msg.lat]"
                :interactive="false"
                :mapStyle.sync="mapStyle"
                :zoom="14"
            >
                <MglMarker :coordinates="[msg.lng, msg.lat]" color="red"/>
            </MglMap>
        </a>
        <MessageTime :class="{'no-caption' : !msg.hasCaption, 'custom-time' : !msg.hasCaption}" :msg="msg"/>
    </div>
</template>

<script>
import { MglMap, MglMarker } from 'vue-mapbox';
import MessageTime from '../messageTime/MessageTime';

export default {
    components: {
        MglMap,
        MglMarker,
        MessageTime
    },
    data () {
        return {
            mapboxAccessToken: 'pk.eyJ1IjoiYm9iYW9hcGFlIiwiYSI6ImNrNnR6ZG56djA0bHozbG4yZDMxMW42YjMifQ.iR0-urBMWuzYfqW2-St0gA',
            mapStyle: 'mapbox://styles/mapbox/light-v9',
            visible: false
        };
    },
    props: {
        msg: {
            type: Object,
            required: true
        }
    },
    computed: {
        link () {
            return `https://maps.google.com/maps?q=${this.msg.lat}%2C${this.msg.lng}&z=17&hl=pt-BR`;
        }
    },
    methods: {
        handleVisible (visible) {
            this.visible = visible;
        }
    }
};
</script>

<style scoped>
.location {
    width: 270px;
    height: 203px;
    object-fit: contain;
    padding: 3px;
}

.custom-time {
    right: 5px;
    bottom: 6px;
}

.no-caption {
    color: #FFF;
    background: rgba(0, 0, 0, 0.3);
    padding: 0 5px;
    border-radius: 3px;
}
</style>
