import { apiRequest } from './client';

export async function getUserSnapshots(email, options = {}) {
    const queryParams = new URLSearchParams();
    if (email) queryParams.append('email', email);
    if (options.limit) queryParams.append('limit', options.limit);
    if (options.offset) queryParams.append('offset', options.offset);

    const basePath = (import.meta.env && import.meta.env.DEV) ? '/api/snapshots' : '/snapshots';
    const path = `${basePath}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

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

export async function getSnapshotDetail(snapshotId) {
    const encodedId = encodeURIComponent(String(snapshotId));
    const basePath = (import.meta.env && import.meta.env.DEV) ? '/api/snapshots' : '/snapshots';
    return await apiRequest(`${basePath}/${encodedId}`, {
        method: 'GET'
    });
}

export async function updateSnapshotTitle(snapshotId, newTitle) {
    const encodedId = encodeURIComponent(String(snapshotId));
    const basePath = (import.meta.env && import.meta.env.DEV) ? '/api/snapshots' : '/snapshots';
    return await apiRequest(`${basePath}/${encodedId}/title`, {
        method: 'PUT',
        body: { title: newTitle }
    });
}

export async function updateSnapshotReminder(snapshotId, reminderPeriod) {
    const encodedId = encodeURIComponent(String(snapshotId));
    const basePath = (import.meta.env && import.meta.env.DEV) ? '/api/snapshots' : '/snapshots';
    return await apiRequest(`${basePath}/${encodedId}/reminder`, {
        method: 'PUT',
        body: { reminder_period: reminderPeriod }
    });
}

export async function deleteSnapshot(snapshotId) {
    const encodedId = encodeURIComponent(String(snapshotId));
    const basePath = (import.meta.env && import.meta.env.DEV) ? '/api/snapshots' : '/snapshots';
    return await apiRequest(`${basePath}/${encodedId}`, {
        method: 'DELETE'
    });
}


