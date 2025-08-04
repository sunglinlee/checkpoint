import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { icons } from './icons.jsx';

const TransitionPage = ({ onNavigate }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const synth = useRef(null);
    const loop = useRef(null);

    useEffect(() => {
        // Initialize synth and effects
        synth.current = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'fmsine' },
            envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 1.5 },
        }).toDestination();
        
        const reverb = new Tone.Reverb({ decay: 8, wet: 0.4 }).toDestination();
        synth.current.connect(reverb);

        // Define the melody
        const melody = [
            ['C4', '8n'], ['E4', '8n'], ['G4', '8n'], ['C5', '8n'],
            ['E5', '4n'], ['G4', '4n'],
            ['D4', '8n'], ['F4', '8n'], ['A4', '8n'], ['D5', '8n'],
            ['F5', '4n'], ['A4', '4n']
        ];
        
        let step = 0;
        loop.current = new Tone.Loop(time => {
            const [note, duration] = melody[step % melody.length];
            synth.current.triggerAttackRelease(note, duration, time);
            step++;
        }, '2n').start(0);

        // Cleanup on unmount
        return () => {
            Tone.Transport.stop();
            Tone.Transport.cancel();
            if (synth.current) synth.current.dispose();
            if (reverb) reverb.dispose();
        };
    }, []);

    const toggleMusic = async () => {
        if (Tone.context.state !== 'running') {
            await Tone.start();
        }

        if (isPlaying) {
            Tone.Transport.pause();
        } else {
            Tone.Transport.start();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="bg-[#FDFCF9] min-h-screen w-full flex flex-col items-center justify-center p-4 text-[#3D4A4D] text-center">
            <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12 animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-bold text-[#5C6B68] mb-6">一個與自己獨處的邀請</h2>
                <div className="text-lg text-gray-700 space-y-4 leading-relaxed">
                    <p>請您留下15分鐘與自己獨處的時間，直覺的將看到問題的感受記錄下來即可，沒有正確答案，也沒有是非對錯。</p>
                    <p>放輕鬆，把心靜下來，舒服地、慢慢地專注在呼吸上。</p>
                    <p className="font-semibold text-[#8A9A87]">一切都會很好的。</p>
                </div>
                <div className="mt-8 flex flex-col items-center gap-4">
                     <button onClick={toggleMusic} className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600">
                        {isPlaying ? <icons.pause /> : <icons.play />}
                        <span>{isPlaying ? '暫停音樂' : '播放輕音樂'}</span>
                    </button>
                    <button onClick={() => onNavigate('questionnaire')} className="btn-primary">
                        我準備好了
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransitionPage; 