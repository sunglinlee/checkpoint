import { apiRequest } from './client';

/**
 * Submit Questionnaire - 提交問卷
 * @param {Object} questionnairePayload - Questionnaire data
 * @returns {Promise<{statusCode: string, data: string}>}
 */
export async function submitQuestionnaire(questionnairePayload) {
    const hasImageFile = questionnairePayload && questionnairePayload.snapshot_image instanceof File;

    if (hasImageFile) {
        const formData = new FormData();
        // 將 JSON 資料作為 Blob 附加
        const { snapshot_image, ...rest } = questionnairePayload;
        const jsonBlob = new Blob([JSON.stringify(rest)], { type: 'application/json' });
        formData.append('data', jsonBlob);
        formData.append('snapshot_image', snapshot_image);

        // 按照 Swagger 規格使用 /api/questionnaire/submit
        return apiRequest('/questionnaire/submit', {
            method: 'POST',
            headers: {},
            body: formData
        });
    }

    // 按照 Swagger 規格使用 /api/questionnaire/submit
    return apiRequest('/questionnaire/submit', {
        method: 'POST',
        body: questionnairePayload
    });
}


