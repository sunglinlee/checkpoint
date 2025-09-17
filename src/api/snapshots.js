import { apiRequest } from './client';

/**
 * Get User Snapshots - 獲取用戶快照列表
 * @param {string} email - User email (required)
 * @param {Object} options - Query options
 * @param {number} options.limit - Limit number of results
 * @param {number} options.offset - Offset for pagination
 * @returns {Promise<{statusCode: string, data: string}>}
 */
export async function getUserSnapshots(email, options = {}) {
    const queryParams = new URLSearchParams();
    if (email) queryParams.append('email', email);
    if (options.limit) queryParams.append('limit', options.limit);
    if (options.offset) queryParams.append('offset', options.offset);

    // 按照 Swagger 規格使用 /api/snapshots
    const path = `/api/snapshots${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    const raw = await apiRequest(path, {
        method: 'GET'
    });

    // Normalize backend response to { data: { snapshots, total, has_more, next_offset } }
    let inner = raw?.data;
    if (typeof inner === 'string') {
        try { inner = JSON.parse(inner); } catch {}
    }

    const questions = inner?.questions || [];
    const snapshots = questions.map((q) => ({
        id: q.id,
        title: q.title ?? '',
        date: q.date,
        mood: q.mood,
        image_url: q.image_url ?? null,
        assigned_image: q.assigned_image ?? null,
        content: q.content,
        reminder_date: q.reminder_date ?? q.schedule_time ?? null,
        tags: Array.isArray(q.tags)
            ? q.tags
            : (typeof q.tags === 'string'
                ? q.tags.split(',').map((t) => t.trim()).filter(Boolean)
                : [])
    }));

    return {
        success: raw?.statusCode === '0000' || raw?.success === true,
        data: {
            snapshots,
            total: inner?.total ?? snapshots.length,
            has_more: inner?.has_more ?? false,
            next_offset: inner?.next_offset ?? 0
        }
    };
}

/**
 * Get Single Snapshot Detail - 獲取單個快照詳情
 * @param {string} snapshotId - Snapshot ID
 * @returns {Promise<{statusCode: string, data: string}>}
 */
export async function getSnapshotDetail(snapshotId) {
    const encodedId = encodeURIComponent(String(snapshotId));
    // 按照 Swagger 規格使用 /api/snapshots/{snapshot_id}
    return await apiRequest(`/api/snapshots/${encodedId}`, {
        method: 'GET'
    });
}

/**
 * Update Snapshot Title - 更新快照標題
 * @param {string} snapshotId - Snapshot ID
 * @param {string} newTitle - New title
 * @returns {Promise<{statusCode: string, data: string}>}
 */
export async function updateSnapshotTitle(snapshotId, newTitle) {
    const encodedId = encodeURIComponent(String(snapshotId));
    // 按照 Swagger 規格使用 /api/snapshots/{snapshot_id}/title
    return await apiRequest(`/api/snapshots/${encodedId}/title`, {
        method: 'PUT',
        body: { title: newTitle }
    });
}

/**
 * Update Snapshot Reminder - 更新快照提醒
 * @param {string} snapshotId - Snapshot ID
 * @param {string} reminderPeriod - Reminder period
 * @returns {Promise<{statusCode: string, data: string}>}
 */
export async function updateSnapshotReminder(snapshotId, reminderPeriod) {
    const encodedId = encodeURIComponent(String(snapshotId));
    // 按照 Swagger 規格使用 /api/snapshots/{snapshot_id}/reminder
    return await apiRequest(`/api/snapshots/${encodedId}/reminder`, {
        method: 'PUT',
        body: { reminder_period: reminderPeriod }
    });
}

/**
 * Delete Snapshot - 刪除快照
 * @param {string} snapshotId - Snapshot ID
 * @returns {Promise<{statusCode: string, data: string}>}
 */
export async function deleteSnapshot(snapshotId) {
    const encodedId = encodeURIComponent(String(snapshotId));
    // 按照 Swagger 規格使用 /api/snapshots/{snapshot_id}
    return await apiRequest(`/api/snapshots/${encodedId}`, {
        method: 'DELETE'
    });
}


