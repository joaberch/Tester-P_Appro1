<script>
import axios from 'axios';

export default {
    props: {
        student: {
            type: Object,
            required: true,
        },
        isAssigned: {
            type: Boolean,
            required: true,
        },
        idTest: {
            type: Number,
            required: true,
        }
    },
    data() {
        return {
            selected: false,
        }
    },
    methods: {
        changeAssignment() {
            if (this.isAssigned) {
                this.unassignStudent();
            } else {
                this.assignStudent();
            }

            this.$emit("change-assignment", {
                student: this.student,
                isAssigned: this.isAssigned
            });

            this.selected = false;
        },
        async assignStudent() {
            const APIAssignStudentsCall = `http://localhost:3000/api/tests/${this.idTest}/user/${this.student.idUser}`;

            const payload = {}

            try {
                await axios.post(APIAssignStudentsCall, payload, {
                    withCredentials: true
                });
            } catch (error) {
                console.error("Erreur:", error)
            }
        },
        async unassignStudent() {
            const APIUnassignStudentsCall = `http://localhost:3000/api/tests/${this.idTest}/user/${this.student.idUser}`;

            try {
                await axios.delete(APIUnassignStudentsCall, {
                    withCredentials: true
                });
            } catch (error) {
                console.error("Erreur:", error)
            }
        }
    }
}
</script>
<template>
    <div class="box" :class="{'isactive': selected}" @dblclick="changeAssignment()" @click="selected=true">
        <span>{{ student.firstname }} {{ student.name }}</span>
    </div>
</template>
<style scoped>
.box {
  padding: 10px 14px;
  margin-bottom: 8px;
  border-radius: 8px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  font-size: 14px;
}

.box:hover {
  background-color: #ececec;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px #8b8b8b;
}

.isactive {
  background-color: #8b8b8b;
  color: white;
  box-shadow: 0 3px 8px rgba(79,140,255,0.35);
}

.isactive:hover {
  background-color: #8b8b8b;
}
</style>