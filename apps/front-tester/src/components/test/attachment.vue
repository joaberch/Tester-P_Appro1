<script>
export default {
    props: {
        attachments: {
            type: Array,
            required: true,
        }
    },
    methods: {
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
    <div class="card">
        <span>Pièces jointes :</span>
        <div class="element" v-for="attachment in attachments">
            <div v-if="!attachment.isDeleted">
                <button @click="downloadAttachment(attachment)">{{ attachment.fileName }}</button>
            </div>
        </div>
    </div>
</template>
<style scoped>
.card {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    border: 1px solid #ddd;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 5px;
}

.element {
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
}

.element button {
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0.3rem 0.6rem;
    cursor: pointer;
    transition: background 0.2s;
}

.element button:hover {
    background-color: #e0e0e0;
}
</style>