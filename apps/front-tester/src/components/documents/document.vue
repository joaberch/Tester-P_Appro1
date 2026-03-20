<script>
export default {
    props: {
        document: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            pdfUrl: null,
        }
    },
    watch: {
        document: {
            immediate: true,
            handler(newDoc) {
                if (newDoc && newDoc.content) {
                    const buffer = newDoc.content;

                    const uint8Array = new Uint8Array(buffer.data);
                    const blob = new Blob([uint8Array]);
                    
                    this.pdfUrl = URL.createObjectURL(blob);
                } else {
                    this.pdfUrl = null;
                }
            }
        }
    },
    beforeUnmount() {
        if (this.pdfUrl) {
            URL.revokeObjectURL(this.pdfUrl);
        }
    }
}
</script>
<template>
    <div v-if="document">
        <h3>{{ document.name }}</h3>
        <div v-if="pdfUrl">
            <iframe :src="pdfUrl" width="100%" height="500px"></iframe>
            <embed :src="pdfUrl" type="application/pdf" />
        </div>
        <div v-else>
            Chargement de l'affichage du PDF.
        </div>
    </div>
</template>
<style scoped>
iframe {
    border: 1px solid #ccc;
}
</style>