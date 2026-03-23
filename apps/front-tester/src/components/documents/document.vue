<script>
import { PDFDocument } from "pdf-lib";

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
            async handler(newDoc) {
                if (newDoc && newDoc.content) {
                    const buffer = newDoc.content;
                    const uint8Array = new Uint8Array(buffer.data);
                    
                    const pdfDoc = await PDFDocument.load(uint8Array);
                    const page = pdfDoc.getPages()[0];
                    const pdfBytes = await pdfDoc.save();
                    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

                    if (this.pdfUrl) {
                        URL.revokeObjectURL(blob);
                    }
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
        </div>
        <div v-else>
            Chargement de l'affichage du PDF.
        </div>
        <button>Télécharger</button>
    </div>
</template>
<style scoped>
iframe {
    border: 1px solid #ccc;
}
</style>