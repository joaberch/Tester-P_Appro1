<script>
import { PDFDocument } from "pdf-lib";

export default {
    props: {
        document: {
            type: Object,
            required: true,
        },
        dataType: {
            type: Object,
            required: true,
        },
        map: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            pdfUrl: null,
            fields: [],
            formData: {},
        }
    },
    watch: {
        document: {
            immediate: true,
            handler() { this.generatePDF(); }
        },
        dataType: {
            deep: true,
            handler() { this.generatePDF(); }
        },
    },
    methods: {
        async generatePDF() {
            try {
                if (!this.document || !this.document.content) {
                    this.pdfUrl = null;
                    return;
                }

                const uint8Array = new Uint8Array(this.document.content.data);
                const pdfDoc = await PDFDocument.load(uint8Array);
                const form = pdfDoc.getForm();

                const fields = form.getFields();
                this.fields = fields.map(f => f.getName());

                this.formData = {};
                fields.forEach(f => {
                    const name = f.getName();
                    const key = this.map[name];
                    const value = key ? this.dataType[key] || '' : '';
                    this.formData[name] = value;

                    try {
                        const type = f.constructor.name;
                        if (type == "PDFTextField2") {
                            form.getTextField(name)?.setText(value);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                });

                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });

                if (this.pdfUrl) {
                    URL.revokeObjectURL(this.pdfUrl);
                }
                this.pdfUrl = URL.createObjectURL(blob);
            } catch (error) {
                console.error(error);
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