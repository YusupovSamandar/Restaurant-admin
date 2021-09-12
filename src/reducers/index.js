import { createStore } from "redux";

export const AppState = {
    teachers: [],
    students: [],
    selectedTeacher: {},
    groupStudents: [],
    users: [],
    currentUser: {},
    revealFees: false,
    isAuth: true,
}

const reducer = (state = AppState, action) => {
    switch (action.type) {

        case "DATA_LOAD": {
            const { teachers, students } = action;
            const chosenteacher = (teachers && teachers.length > 1) ? teachers[0] : {};
            const filteredStudents = (chosenteacher) ?
                students.filter(student => student.group === chosenteacher.group) :
                [];
            return {
                ...state,
                teachers: teachers,
                students: students,
                selectedTeacher: chosenteacher,
                groupStudents: filteredStudents
            }
        }

        default:
            return state;
    }
}

export default createStore(reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);