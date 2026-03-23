<script>
import axios from 'axios';
import Document from '../components/documents/document.vue';

export default {
    data() {
        return {
            documents: [],
            documentIndex: 0,
            me: {},
            date: '',
            fieldMap: {
                "Nom et  Prénom": "name",
                "Classe": "class",
                "au (jour-date)": "absent_from",
                "Absent_eduJour_Date": "absent_to",
                "heure début": "h_begin",
                "heure de fin": "h_end",
                "nb de périodes atelier": "periods_nbr",
                "Lieu": "location",
                "Date": "date",
                "Motif": "reason",
            }
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
        async fetchMe() {
            try {
                const APIGetMeCall = `${import.meta.env.VITE_API_URL}/users/me`;

                const me = await axios.get(APIGetMeCall, {
                    withCredentials: true,
                });

                this.me = me.data;
            } catch (error) {
                console.error(error);
            }
        },
        updateDocument(value) {
            this.documentIndex = (this.documentIndex + value + this.documents.length) % this.documents.length;
        },
        getDate() {
            const now = new Date();
            let day = now.getDate();
            if (day < 10) {
                day = '0' + day;
            }
            let month = now.getMonth()+1;
            if (month < 10) {
                month = '0' + month;
            }
            const year = now.getFullYear();
            
            return `${day}.${month}.${year}`;
        }
    },
    async mounted() {
        await this.fetchDocuments();
        await this.fetchMe();
        this.date = this.getDate();
    },
    computed: {
        selectedDocument() {
            return this.documents[this.documentIndex] || {};
        },
        formData() {
            return {
                name: `${this.me.name || ''} ${this.me.firstname || ''}`,
                class: `${this.me.class || ''}`,
                absent_from: '',
                absent_to: '',
                h_begin: '',
                h_end: '',
                periods_nbr: '',
                reason: '',
                location: '',
                date: `${this.date || ''}`,
            }
        }
    }
}
</script>
<template>
    <div class="documents">
        <button @click="updateDocument(-1)"><-</button>
        <button @click="updateDocument(1)">-></button>
        <Document :document="selectedDocument" :dataType="formData" :map="fieldMap"/>
    </div>
</template>