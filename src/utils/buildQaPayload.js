export function buildQaPayload(answers = {}) {
  return {
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
    }
  };
}


