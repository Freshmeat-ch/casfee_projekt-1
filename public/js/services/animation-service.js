/* eslint-disable no-undef */
export class AnimationService {
  shootConfetti(event) {
    party.confetti(event, {
      count: party.variation.range(40, 60),
      settings: {
        debug: true,
      },
    });
  }
}
