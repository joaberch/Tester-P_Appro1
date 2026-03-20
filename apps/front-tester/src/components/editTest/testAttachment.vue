<script>
import axios from 'axios';

export default {
    props: {
        attachment: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            saveTimeout: null
        }
    },
    methods: {
        debounceUpdateAttachment(attachment) {
            clearTimeout(this.saveTimeout);
            this.saveTimeout = setTimeout(() => {
                this.updateAttachment(attachment);
            }, 1000)
        },
        async updateAttachment(attachment) {
            try {
                const APIUpdateAttachment = `${import.meta.env.VITE_API_URL}/attachments/${attachment.idAttachment}`;

                const payload = {
                    fileName: attachment.fileName,
                }

                await axios.put(APIUpdateAttachment, payload, {
                    withCredentials: true
                })
            } catch (error) {
                console.error(error);
            }
        },
        async archiveAttachment(idAttachment) {
            try {
                const APIArchiveAttachment = `${import.meta.env.VITE_API_URL}/attachments/archive/${idAttachment}`;

                await axios.put(APIArchiveAttachment, {}, {
                    withCredentials: true
                })
                this.attachment.isDeleted = true;
            } catch (error) {
                console.error(error);
            }
        },
        downloadAttachment(attachment) {
            const buffer = attachment.fileContent;

            const uint8Array = new Uint8Array(buffer.data);
            const blob = new Blob([uint8Array]);

            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = attachment.fileName;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }
}
</script>
<template>
    <div class="attachment" v-if="!attachment.isDeleted">
        <div class="card">
            <span>Nom du fichier: <input type="text" v-model="attachment.fileName" placeholder="Nom de la pièce jointe" @input="debounceUpdateAttachment(attachment)" /></span>
            <button @click="downloadAttachment(attachment)">Télécharger</button>
            <button @click="archiveAttachment(attachment.idAttachment)" class="delete-btn">Supprimer</button>
        </div>
    </div>
</template>
<style scoped>
.card {
    display: flex;
    justify-content: space-between;
        border: 1px solid #ddd;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 5px;
}

.delete-btn {
    background: #ff4d4f;
    color: white;
    border: none;
    padding: 0.3rem 0.6rem;
    cursor: pointer;
    border-radius: 3px;
}

.delete-btn:hover {
    background-color: #c0392b;
}
</style>