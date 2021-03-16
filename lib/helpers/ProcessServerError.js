import { notification } from "../../node_modules/antd/lib/index";
export function processServerError(error) {
    console.error(error);
    let errorMessage = getServerErrorMessage(error);
    if (window.strings[errorMessage]) {
        errorMessage = window.strings[errorMessage];
    }
    showErrorMessage('Error', errorMessage);
}
export function getServerErrorMessage(error) {
    debugger;
    if (typeof error == 'string') {
        return error;
    }
    else if (error.data && error.data.Message) {
        return error.data.Message;
    }
    if (Array.isArray(error)) {
        return getArrayErrorsMessage(error);
    }
    //graphql
    else if (error.bodyText) {
        return error.bodyText;
    }
    else if (error.response && error.response.data) {
        const data = error.response.data?.error ?? error.response.data;
        if (typeof data == 'string') {
            return data;
        }
        else if (data.constructor === Object) {
            const keys = Object.keys(data);
            if (keys.length) {
                const objKey = keys[0];
                if (data[objKey]['message']) {
                    return data[objKey]['message'];
                }
                else if (data[objKey][0] && data[objKey][0]['message']) {
                    return data[objKey][0]['message'];
                }
                else if (typeof data[objKey] == 'string') {
                    return data[objKey];
                }
                else if (data[objKey].constructor === Object) {
                    const childKeys = Object.keys(data[objKey]);
                    if (childKeys.length) {
                        const objKey2 = childKeys[0];
                        return `${objKey2}: ${data[objKey][objKey2]}`;
                    }
                    else {
                        return 'Missing child field: empty keys';
                    }
                }
                else if (data[objKey].constructor === Array) {
                    if (data[objKey][0] === 'validation.required') {
                        return `window.strings.field_is_required ${objKey}`;
                    }
                    else {
                        return `${objKey}: ${data[objKey][0]}`;
                    }
                }
                else {
                    return 'Missing field: Message not available';
                }
            }
            else {
                return 'Missing field: Response keys are empty';
            }
        }
        else {
            return 'Missing field: data type not processed';
        }
    }
    else if (error.message) {
        return error.message;
    }
    else if (error.error) {
        return error.error;
    }
    else if (error?.request?.response) {
        return error.request.response;
    }
    else {
        return "Missing field: Couldn't process error";
    }
}
export function showErrorMessage(title, message, duration = 5) {
    let notificationMessage;
    if (typeof message == 'object') {
        notificationMessage = message.message;
    }
    if (!message) {
        notificationMessage = "An unexpected error has occurred. We'll fix it soon";
    }
    else {
        notificationMessage = message;
    }
    notification.error({
        message: title,
        description: notificationMessage,
        duration,
    });
}
function getArrayErrorsMessage(error) {
    const porcessed_error = error
        .map((err) => {
        if ('message' in err) {
            return err.message;
        }
        else
            return '';
    })
        .join();
    return porcessed_error ?? 'No message field found! plase check logs';
}
//# sourceMappingURL=ProcessServerError.js.map