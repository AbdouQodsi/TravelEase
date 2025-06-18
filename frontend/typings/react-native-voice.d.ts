declare module 'react-native-voice' {
    interface VoiceOptions {
        RECOGNIZER_ENGINE?: string;
        EXTRA_PARTIAL_RESULTS?: boolean;
        EXTRA_LANGUAGE?: string;
    }

    export default class Voice {
        static start(locale: string, options?: VoiceOptions): Promise<void>;
        static stop(): Promise<void>;
        static cancel(): Promise<void>;
        static destroy(): Promise<void>;
        static isAvailable(): Promise<boolean>;
        static onSpeechStart: (callback: (event: any) => void) => void;
        static onSpeechEnd: (callback: (event: any) => void) => void;
        static onSpeechError: (callback: (event: any) => void) => void;
        static onSpeechResults: (callback: (event: { value: string[] }) => void) => void;
        static onSpeechPartialResults: (callback: (event: { value: string[] }) => void) => void;
        static onSpeechVolumeChanged: (callback: (event: { value: number }) => void) => void;
    }
}