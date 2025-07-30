import { useState, useRef, useEffect } from "react";
import { FaStop, FaPause, FaPlay } from "react-icons/fa";
import { IoMdMic } from "react-icons/io";
import { BsRecordCircleFill } from "react-icons/bs";
import { toPersianDigit } from "../../utils/PersianNumberConverter";

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const timerRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorder.current?.state !== "inactive") {
        mediaRecorder.current?.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      // Timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      mediaRecorder.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        clearInterval(timerRef.current);
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        setAudioUrl(URL.createObjectURL(audioBlob));
        audioChunks.current = [];
      };
    } catch (err) {
      alert("Microphone access denied!");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state !== "inactive") {
      mediaRecorder.current?.stop();
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
    setIsPaused(false);
    clearInterval(timerRef.current);
  };

  const togglePause = () => {
    if (isPaused) {
      // Resume recording
      mediaRecorder.current?.resume();
      // Restart timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      // Pause recording
      mediaRecorder.current?.pause();
      // Clear timer
      clearInterval(timerRef.current);
    }
    setIsPaused(!isPaused);
  };

  // Format time (00:00)
  const formatTime = (seconds) => {
    const mins = toPersianDigit(
      Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0")
    );
    const secs = toPersianDigit((seconds % 60).toString().padStart(2, "0"));
    return `${mins}:${secs}`;
  };

  return (
    <div className="SideTool-Voice-Recorder-Container">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`SideTool-Voice-Recorder-Icon-Button ${
          isRecording
            ? "SideTool-Voice-Recorder-Stop-Button"
            : "SideTool-Voice-Recorder-Record-Button"
        }`}
      >
        {isRecording ? <FaStop /> : <IoMdMic />}
      </button>

      {isRecording && (
        <div className="SideTool-Voice-Recording-Status">
          <BsRecordCircleFill className="SideTool-Voice-Recorder-Pulse-Icon" />
          <span className="SideTool-Voice-Recorder-Recording-Time">
            {formatTime(recordingTime)}
          </span>
          <button
            onClick={togglePause}
            className="SideTool-Voice-Recorder-Icon-Button"
          >
            {isPaused ? <FaPlay /> : <FaPause />}
          </button>
        </div>
      )}

      {audioUrl && !isRecording && (
        <audio
          src={audioUrl}
          controls
          className="SideTool-Voice-Recorder-Audio-Player"
        />
      )}
    </div>
  );
};

export default VoiceRecorder;
