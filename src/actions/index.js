export const loadData = (teachers, students) => {
    return {
        type: "DATA_LOAD",
        teachers,
        students
    };
};