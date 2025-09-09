import { loadAuth } from '../api/auth';

export function buildQaPayload(answers = {}) {
  const { user } = loadAuth();
  const email = (user && (user.email || user.mail || user.userEmail)) || null;

  return {
    // 系統資訊（頂層）
    created_at: new Date().toISOString(),
    email, // 只送 email，不送 user_id

    // 問卷主體
    qa: {
      satisfaction: {
        rating: answers.rating ?? null,
        reason: answers.reason ?? ''
      },
      gratitude: {
        grateful_events: answers.grateful_events ?? '',
        share_with: answers.share_with ?? '',
        inspiration: answers.inspiration ?? ''
      },
      focus: {
        current_events: answers.current_events ?? '',
        feelings: answers.feelings ?? '',
        actions: answers.actions ?? ''
      },
      emotion: {
        emotion_event: answers.emotion_event ?? '',
        emotion_name: answers.emotion_name ?? '',
        unmet_needs: answers.unmet_needs ?? ''
      },
      relations: {
        family: answers.family ?? '',
        friends: answers.friends ?? '',
        love: answers.love ?? ''
      },
      career: {
        challenge: answers.challenge ?? '',
        new_understanding: answers.new_understanding ?? ''
      },
      desire: {
        dream: answers.dream ?? '',
        goal: answers.goal ?? ''
      },
      reflection: {
        forgiveness: answers.forgiveness ?? '',
        future_self: answers.future_self ?? ''
      }
    },

    // 此刻的心情與標記（頂層）
    mood_and_tags: {
      snapshot_title: answers.snapshot_title ?? '',
      current_mood: answers.current_mood ?? '',
      current_thoughts: answers.current_thoughts ?? '',
      personal_tags: answers.personal_tags ?? ''
    },

    // 預約（頂層）
    schedule: {
      reminder_period: answers.reminder_period ?? ''
    },

    // 可選圖片（頂層）
    snapshot_image: answers.snapshot_image ?? null
  };
}


