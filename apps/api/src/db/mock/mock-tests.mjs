let tests = [
    {
        id: 1,
        name: "Licences",
        description: "Cours sur les licences",
        duration: 90, //en minutes
        isDeleted: false,
        isFormative: false,
        fkModules: 1,
    },
    {
        id: 2,
        name: "GNU",
        description: "Cours sur GNU",
        duration: 45,
        isDeleted: false,
        isFormative: true,
        fkModules: 1,
    }
]

const getTest = (testId) => {
    return tests.find((test) => test.id == testId);
}

const removeTest = (testId) => {
    tests = tests.filter((test) => test.id != testId);
}

const updateTest = (testId, updateTest) => {
    tests = tests.map((test) =>
        test.id == testId ? updateTest : test
    )
}

const getUniqueId = (products) => {
    // On construit un tableau d'id de produits
    const productsIds = products.map((product) => product.id);
    // La fonction passée à reduce compare deux éléments à la fois (a et b) et
    // retourne le plus grand des deux grâce à Math.max.
    // Au final, reduce parcourt tout le tableau productsIds, compare chaque ID
    // avec l'ID maximal trouvé jusqu'à présent, et retourne l'ID le plus élevé,
    // qui est stocké dans la variable maxId.
    const maxId = productsIds.reduce((a, b) => Math.max(a, b));
    return maxId + 1;
};

export { tests, getTest, removeTest, updateTest, getUniqueId }