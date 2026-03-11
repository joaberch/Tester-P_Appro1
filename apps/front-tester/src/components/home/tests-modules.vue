<script>
import axios from "axios"
import Element from "./element.vue";

export default {
    components: {
        Element
    },
    data() {
        return {
            displayed: "tests", //tests or modules
            tests: [],
            modules: [],
            role: '',
        }
    },
    async mounted() {
        try {
            await this.getMe()
            this.fetchAllModules();

            if (this.role == "student") {
                this.fetchAssignedTests()
            } else if (this.role == "teacher" || this.role == "admin") {
                this.fetchAllTests();
            }
        } catch (error) {
            console.error("error :", error);
        }
    },
    methods: {
        async fetchAllTests() {
            const APIGetAllTestsCall = `${import.meta.env.VITE_API_URL}/tests`;

            const fetchedTests = await axios.get(APIGetAllTestsCall, {
                withCredentials: true
            });

            this.tests = fetchedTests.data.data;
        },
        async fetchAssignedTests() {
            const APIGetAssignedTestsCall = `${import.meta.env.VITE_API_URL}/tests/assigned`;

            const fetchedTests = await axios.get(APIGetAssignedTestsCall, {
                withCredentials: true
            });

            this.tests = fetchedTests.data.data;
        },
        async fetchAllModules() {
            let APIGetAllModulesCall = `${import.meta.env.VITE_API_URL}/modules`;
    
            let fetchedModules = await axios.get(APIGetAllModulesCall, {
                withCredentials: true
            });
            
            this.modules = fetchedModules.data.data;
        },
        async getMe() {
            const APIGetMeCall = `${import.meta.env.VITE_API_URL}/me`;

            try {
                const res = await axios
                    .get(APIGetMeCall, {
                        withCredentials: true
                    }
                );
                this.role = res.data.role
            } catch (error) {
                console.error("Erreur:", error)
            }
        }
    }
}
</script>
<template>
    <div id="global">
        <div id="header">
            <p class="header" :class="{ active: displayed === 'tests' }" @click="displayed = 'tests'">Tests</p>
            <p class="header" :class="{ active: displayed === 'modules' }" @click="displayed = 'modules'">Modules</p>
        </div>
        <div id="content-tests" v-if="displayed == 'tests'">
            <div class="content">
                <Element v-for="element in this.tests" :key="element.id" :element="element" :isTest="true"/>
            </div>
        </div>
        <div id="content-modules" v-else>
            <div class="content">
                <Element v-for="element in this.modules" :key="element.id" :element="element" :isTest="false"/>
            </div>
        </div>
    </div>
</template>
<style scoped>
#global {
    font-family: Arial, sans-serif;
    width: 80%;
    margin: 20px auto;
}

#header {
    display: flex;
    justify-content: start;
    gap: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 15px;
}

#header .header {
    cursor: pointer;
    padding: 10px 15px;
    font-weight: bold;
    color: #555;
    transition: all 0.3s ease;
}

#header .header:hover {
    color: #007BFF;
}

#header .header.active {
    border-bottom: 3px solid #007BFF;
    color: #007BFF;
}

#content-tests,
#content-modules {
    gap: 10px;
    flex-wrap: wrap;
}

#content-tests.active,
#content-modules.active {
    display: flex;
}

.content {
    background-color: #f5f5f5;
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 10px;
    flex: 1 1 200px; /* Ajustable pour responsive */
    box-shadow: 0px 2px 5px rgba(0,0,0,0.1);
}
</style>