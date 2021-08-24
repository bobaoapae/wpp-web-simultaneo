<template>
    <div class="participant">
        <Picture :id="id" :full="false" :group="false"/>
        <div class="infos">
            <div class="info">
                <span class="formattedName">{{ formattedName }}</span>
                <span class="position" v-if="isAdmin">Admin do grupo</span>
            </div>
            <div class="info">
                <span class="phrase">RedeSurftank.com.br</span>
                <span class="pushName">~<span v-html="filters.emojify(pushName)"></span></span>
            </div>
        </div>
    </div>
</template>

<script>
import filters from '@/filters';
import { useStore } from 'vuex';
import { asyncComputed } from '@/AsyncComputed';
import Picture from '@/components/shared/picture/Picture.vue';

export default {
    name: 'ParticipantInfo',
    components: {
        Picture
    },
    props: {
        id: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            required: true
        }
    },
    setup (props) {

        const store = useStore();

        const formattedName = asyncComputed(() => {
            return store.dispatch('findFormattedNameFromId', { id: props.id });
        });
        const pushName = asyncComputed(async () => {
            let contact = await store.dispatch('findContactFromId', { id: props.id });
            return contact.pushname;
        });

        return {
            formattedName,
            pushName,
            filters
        };
    }
};
</script>

<style scoped>
.participant {
    display: flex;
    justify-content: center;
    margin-top: 1vh;
}

.infos {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.info {
    display: flex;
    align-items: center;
    line-height: normal;
}

.formattedName {
    flex-grow: 1;
    overflow: hidden;
    font-size: 17px;
    font-weight: 400;
}

.position {
    display: inline-block;
    height: 16px;
    font-size: 11px;
    line-height: 14px;
    color: #00af9c;
    padding: 1px 5px 0;
    border: 1px solid rgba(0, 175, 56, 0.7);
    border-radius: 3px;
}

.phrase {
    flex-grow: 1;
    overflow: hidden;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
    overflow-wrap: break-word;
}

.pushName {
    flex: none;
    max-width: 100%;
    font-size: 12px;
    display: inline-block;
    height: 21px;
    line-height: 21px;
}
</style>
