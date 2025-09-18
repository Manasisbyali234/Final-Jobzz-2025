import { formType } from "../../globals/constants";

function processLogin(formData, result) {

    if(isValid(formData.username) && isValid(formData.password)) {
        if(formData.type === formType.LOGIN_CANDIDATE) {
            result(formData.username === "guest" && formData.password === "12345");
        } else if(formData.type === formType.LOGIN_EMPLOYER) {
            result(formData.username === "admin" && formData.password === "12345");
        }
    }
}

function isValid(value) {
    return value !== undefined 
    && value !== null 
    && value !== "";
}

export default processLogin;