/**
 * Web Audio API를 이용한 사운드 합성 서비스
 * 외부 파일 없이도 경쾌한 효과음을 생성합니다.
 */

class AudioService {
    private ctx: AudioContext | null = null;

    private init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    /**
     * 레벨업 축하 "Tada-✨" 사운드
     */
    playLevelUp() {
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // 도-솔-도 3단 음계로 경쾌하게!
        this.playTone(261.63, now, 0.1);      // C4
        this.playTone(392.00, now + 0.1, 0.1); // G4
        this.playTone(523.25, now + 0.2, 0.4); // C5
    }

    /**
     * 미션 완료 "Ding!" 사운드
     */
    playMissionClear() {
        this.init();
        if (!this.ctx) return;
        this.playTone(880, this.ctx.currentTime, 0.2); // A5
    }

    /**
     * 카운트다운 틱 소리
     */
    playTick(high: boolean = false) {
        this.init();
        if (!this.ctx) return;
        const freq = high ? 880 : 440;
        this.playTone(freq, this.ctx.currentTime, 0.1);
    }

    /**
     * 시작 알림음
     */
    playStart() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        this.playTone(880, now, 0.1);
        this.playTone(1320, now + 0.1, 0.2);
    }

    private playTone(freq: number, startTime: number, duration: number) {
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine'; // 부드러운 소리
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }
}

export const audioService = new AudioService();
