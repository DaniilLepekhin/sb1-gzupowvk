import React, { useState, useRef } from 'react';
import RecordRTC from 'recordrtc';
import { Mic, Square, Loader2 } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  isProcessing: boolean;
  onTranscriptionStart?: () => void;
}

export function VoiceRecorder({ 
  onRecordingComplete, 
  isProcessing, 
  onTranscriptionStart 
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      recorderRef.current = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
      });

      recorderRef.current.startRecording();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Не удалось получить доступ к микрофону');
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current!.getBlob();
        onTranscriptionStart?.(); // Notify that transcription is starting
        onRecordingComplete(blob);
        
        // Clean up
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        recorderRef.current = null;
        setIsRecording(false);
      });
    }
  };

  if (isProcessing) {
    return (
      <button
        disabled
        className="px-3 py-2.5 rounded-xl bg-blue-600/50 text-white flex items-center justify-center"
        title="Расшифровка аудио..."
      >
        <Loader2 size={18} className="animate-spin" />
      </button>
    );
  }

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className={`px-3 py-2.5 rounded-xl ${
        isRecording 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-blue-600 hover:bg-blue-700'
      } text-white flex items-center justify-center transition-colors active:scale-95`}
      title={isRecording ? "Остановить запись" : "Записать голосовое сообщение"}
    >
      {isRecording ? <Square size={18} /> : <Mic size={18} />}
    </button>
  );
}