const grades = [10, 2, 21, 35, 50, -10, 0, 1];

// get all grades > 20
const result = grades.filter(grade => grade > 20); // [21, 35, 50];

// get all grades > 30
grades.filter(grade => grade > 30); // [35, 50]


//so filter does is it basically go to each array and you can put some conditions on it and it will traverse all the array and return 
//those elements according to the conditions


/**
 * @param {object[]} results
 */
function getPassingTests(results) {
    return results.filter(result => result.grade >= 10);
}

// sample usage (do not modify)
const data = [{
    id: 1,
    grade: 10
}, {
    id: 2,
    grade: 4
}, {
    id: 3,
    grade: 18
}]
console.log(getPassingTests(data))
