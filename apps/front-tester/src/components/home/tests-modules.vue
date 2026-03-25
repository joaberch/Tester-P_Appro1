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
            page: 1,
            pageSize: 20,
            totalPages: 1,
            isLoading: false,
            myTestsFilter: true,
            otherTestsFilter: true,
            archivedTestsFilter: true,
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
        async fetchAllTests(page=1) {
            if (this.isLoading) return;
            this.isLoading = true;

            try {
                const APIGetAllTestsCall = `${import.meta.env.VITE_API_URL}/tests?page=${page}&pageSize=${this.pageSize}`;
    
                const fetchedTests = await axios.get(APIGetAllTestsCall, {
                    withCredentials: true
                });
                
                this.tests = fetchedTests.data.data;
                this.page = fetchedTests.data.page;
                this.totalPages = fetchedTests.data.totalPages;
            } catch (error) {
                console.error(error);
            } finally {
                this.isLoading = false;
            }
        },
        async fetchAssignedTests() {
            const APIGetAssignedTestsCall = `${import.meta.env.VITE_API_URL}/tests/assigned`;

            const fetchedTests = await axios.get(APIGetAssignedTestsCall, {
                withCredentials: true
            });

            this.tests = fetchedTests.data;
        },
        async fetchAllModules() {
            let APIGetAllModulesCall = `${import.meta.env.VITE_API_URL}/modules`;
    
            let fetchedModules = await axios.get(APIGetAllModulesCall, {
                withCredentials: true
            });
            
            this.modules = fetchedModules.data;
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
        },
        changePageSize() {
            this.page = 1;
            this.fetchAllTests(this.page);
        }
    },
    computed: {
        myTests() {
            return this.tests.filter(t => t.isMine && !t.isDeleted);
        },
        otherTests() {
            return this.tests.filter(t => !t.isMine && !t.isDeleted);
        },
        archivedTests() {
            return this.tests.filter(t => t.isDeleted);
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
            <div class="pagination">
                <p>Page {{ page }}/{{ totalPages }}</p>
                <button @click="fetchAllTests(page-1)" v-if="page-1 > 0" :disabled="isLoading"><-</button>
                <button @click="fetchAllTests(page+1)" v-if="page+1 <= totalPages" :disabled="isLoading">-></button>
                <p>Nombre de test affiché par page :</p>
                <select v-model.number="pageSize" @change="changePageSize">
                    <option :value="5">5</option>
                    <option :value="10">10</option>
                    <option :value="20">20</option>
                    <option :value="50">50</option>
                    <option :value="100">100</option>
                    <option :value="1000">1000</option>
                </select>
                <input type="checkbox" :checked="myTestsFilter">Mes tests
                <input type="checkbox" :checked="otherTestsFilter">Autres tests
                <input type="checkbox" :checked="archivedTestsFilter">Tests archivés
            </div>
            <div class="content" v-if="myTests.length>0">
                <h2>Mes tests</h2>
                <Element v-for="element in myTests" :key="element.id" :element="element" :isTest="true"/>
            </div>
            <div class="content" v-if="otherTests.length>0">
                <h2>Tests</h2>
                <Element v-for="element in otherTests" :key="element.id" :element="element" :isTest="true"/>
            </div>
            <div class="content" v-if="archivedTests.length>0">
                <h2>Tests archivés</h2>
                <Element v-for="element in archivedTests" :key="element.id" :element="element" :isTest="true"/>
            </div>
            
            <div class="content" v-if="tests.length==0 && role=='student'">
                Vous n'avez aucun test d'assigné.
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
.pagination {
    display: flex;
    align-items: center;
}
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
    flex: 1 1 200px;
    box-shadow: 0px 2px 5px rgba(0,0,0,0.1);
}
</style>