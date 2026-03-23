<script>
import axios from 'axios';
import Document from '../components/documents/document.vue';

export default {
    data() {
        return {
            documents: [],
            documentIndex: 1,
        }
    },
    components: {
        Document,
    },
    methods: {
        async fetchDocuments() {
            try {
                const APIGetDocumentsCall = `${import.meta.env.VITE_API_URL}/documents`;

                const fetchedDocuments = await axios.get(APIGetDocumentsCall, {
                    withCredentials: true,
                });

                this.documents = fetchedDocuments.data;
            } catch (error) {
                console.error(error);
            }
        },
        updateDocument(value) {
            this.documentIndex = (this.documentIndex + value + this.documents.length) % this.documents.length;
        }
    },
    async mounted() {
        await this.fetchDocuments();
    },
    computed: {
        selectedDocument() {
            return this.documents[this.documentIndex] || {};
        }
    }
}
</script>
<template>
    <div class="documents">
        <button @click="updateDocument(-1)"><-</button>
        <button @click="updateDocument(1)">-></button>
        <Document :document="selectedDocument"/>
    </div>
</template>