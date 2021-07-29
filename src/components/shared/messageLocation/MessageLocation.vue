<template>
    <div class="location">
        <a :href="link" target="_blank" v-b-visible="handleVisible">
            <MapboxVue
                v-if="visible"
                :access-token="mapboxAccessToken"
                :map-options="{
                                style: mapStyle,
                                center: [msg.lng, msg.lat],
                                zoom: 14,
                                interactive: false
                              }"
                :attributionControl="false"
                :nav-control="{ show: false }"
                @map-load="loaded"
            />
        </a>
        <MessageTime :class="{'no-caption' : !msg.hasCaption, 'custom-time' : !msg.hasCaption}" :msg="msg"/>
    </div>
</template>

<script>
import MapboxVue from 'mapbox-gl-vue';
import Mapbox from 'mapbox-gl';
import MessageTime from '../messageTime/MessageTime';

export default {
    components: {
        MapboxVue,
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
        loaded (map) {
            new Mapbox.Marker({ color: 'red' })
                .setLngLat([this.msg.lng, this.msg.lat])
                .addTo(map);
        },
        handleVisible (visible) {
            this.visible = visible;
        }
    }
};
</script>

<style scoped>
#map {
    width: 100%;
    height: 100%;
}
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
