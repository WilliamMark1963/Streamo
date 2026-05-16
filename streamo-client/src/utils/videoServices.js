import API from "./APIintercept";

/**
 * Sends multipart form data to back-end endpoints
 * @param {FormData} formData - Compiled form payload fields
 * @param {Function} onProgress - Callback mapping progress percentage
 */
export const publishNewVideo = async (formData, onProgress) => {
    const { data } = await API.post('/video/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        // Native Axios hook to capture buffer packet uploads
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
        }
    });
    return data;
};