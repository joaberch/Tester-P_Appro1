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
            timeout: null,
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
        async generatePDF(readOnly = true) {
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

                fields.forEach(f => {
                    const name = f.getName();
                    const key = this.map[name];
                    if (!(name in this.formData)) {
                        this.formData[name] = key ? this.dataType[key] || '' : '';
                    }
                    const value = this.formData[name];

                    try {
                        const type = f.constructor.name;
                        if (type == "PDFTextField2") {
                            const field = form.getTextField(name);
                            field.setText(value);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                });
                if (readOnly) {
                    form.flatten() //Disable form so it's only a preview
                }

                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });

                if (this.pdfUrl) {
                    URL.revokeObjectURL(this.pdfUrl);
                }
                this.pdfUrl = URL.createObjectURL(blob);
            } catch (error) {
                console.error(error);
            }
        },
        async debounce(func) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                func();
            }, 600);
        },
        async download() {
            await this.generatePDF(false); //Ensure latest version and enable edit in pdf
            if (!this.pdfUrl) {
                return
            }

            const link = document.createElement('a');
            link.href = this.pdfUrl;
            link.download = this.document.name || 'document.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            await this.generatePDF(); //Disable edit in pdf
        }
    },
    beforeUnmount() {
        if (this.pdfUrl) {
            URL.revokeObjectURL(this.pdfUrl);
        }
    },
    computed: {
        filteredFormData() {
            const exclude = ["RemarqueEntreprise", "EntrepriseOuiNon"]
            return Object.fromEntries(
                Object.entries(this.formData).filter(
                    ([key]) => !exclude.includes(key)
                )
            );
        }
    }
}
</script>
<template>
    <div v-if="document">
        <h3>{{ document.name }}</h3>
        <form>
            <div class="card" v-for="(value, key) in filteredFormData" :key="key">
                <p>{{ key }}</p>
                <input @input="debounce(generatePDF)" type="text" v-model="formData[key]">
            </div>
        </form>
        <div v-if="pdfUrl">
            <iframe :src="pdfUrl" width="100%" height="500px"></iframe>
        </div>
        <div v-else>
            Chargement de l'affichage du PDF.
        </div>
        <button @click="download()">Télécharger</button>
    </div>
</template>
<style scoped>
/* Container */
#global {
    display: flex;
    flex-direction: column;
    gap: 20px;
    font-family: Arial, sans-serif;
}

/* Header */
h3 {
    margin: 0 0 10px 0;
    font-size: 1.5rem;
    color: #333;
}

/* Form styling */
form {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

/* Individual card for each field */
.card {
    display: flex;
    flex-direction: column;
    flex: 1 1 200px;
    min-width: 150px;
}

/* Label */
.card p {
    margin: 0 0 5px 0;
    font-weight: bold;
    font-size: 0.9rem;
    color: #555;
}

/* Input field */
.card input {
    padding: 8px 10px;
    font-size: 0.9rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.card input:focus {
    border-color: #0078d4;
    /* nice blue */
    box-shadow: 0 0 3px rgba(0, 120, 212, 0.3);
}

/* PDF iframe */
iframe {
    width: 100%;
    height: 500px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

/* Download button */
button {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #0078d4;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

button:hover {
    background-color: #005ea2;
}

/* Responsive for smaller screens */
@media (max-width: 600px) {
    form {
        flex-direction: column;
    }

    .card {
        min-width: 100%;
    }
}
</style>