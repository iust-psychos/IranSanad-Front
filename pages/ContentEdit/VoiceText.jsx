import { useRef, useState } from "react";
import "@/pages/ContentEdit/index.css";
import { voiceTextAPI } from "../../Managers/Voice2TextManager";
import axios from "axios";
import CookieManager from "@/managers/CookieManager";
import { showErrorToast, showSuccessToast } from "@/utils/toast.js";
import VoiceRecorder from "./VoiceRecorder";
import { FiUpload } from "react-icons/fi";

const VoiceText = () => {
  const token = CookieManager.LoadToken();

  const [audioFile, setAudioFile] = useState(null);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file && file.type.includes("audio")) {
      setAudioFile(file);
      setRecordedAudioBlob(null);
    } else {
      showErrorToast("لطفاً یک فایل صوتی معتبر انتخاب کنید");
      setAudioFile(null);
    }
  };

  const handleChangeRecordedAudio = (audioBlob) => {
    setRecordedAudioBlob(audioBlob);
    setAudioFile(null);
  };

  const convertVoice2Text = async () => {
    let fileToSend = audioFile;

    if (voiceMode === "record" && recordedAudioBlob) {
      fileToSend = new File([recordedAudioBlob], "recording.wav", {
        type: "audio/wav",
      });
    }

    if (!fileToSend) {
      showErrorToast("لطفاً ابتدا یک فایل صوتی انتخاب یا ضبط کنید");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("audio_file", fileToSend);

      const response = await axios.post(voiceTextAPI, formData, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });

      setTranscription(response.data.transcription);
    } catch (error) {
      showErrorToast("خطا در پردازش فایل صوتی!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(transcription)
      .then(() => {
        showSuccessToast("متن رونوشت شد!");
      })
      .catch((err) => {
        showErrorToast("خطا در رونوشت متن!");
      });
  };

  const [voiceMode, setVoiceMode] = useState("file");
  const handleChangeVoiceMode = (value) => {
    setVoiceMode(value);
    setAudioFile(null);
    setRecordedAudioBlob(null);
  };

  return (
    <div className="SideTool-Voice-Container">
      <h2 className="SideTool-Voice-Header SideTool-Voice-Item">
        تبدیل صوت به متن
      </h2>
      <div className="SideTool-Voice-Type-Selector">
        <button
          className={voiceMode === "file" ? "activeSelector" : ""}
          onClick={() => {
            handleChangeVoiceMode("file");
          }}
        >
          بارگذاری صوت
        </button>
        <button
          className={voiceMode === "record" ? "activeSelector" : ""}
          onClick={() => {
            handleChangeVoiceMode("record");
          }}
        >
          ضبط صوت
        </button>
      </div>
      <p className="SideTool-Voice-Text SideTool-Voice-Item">
        {voiceMode === "file"
          ? "فایل صوتی را بارگذاری کنید و متن آن را دریافت کنید."
          : "فایل صوتی را ضبط کرده و متن آن را دریافت کنید."}
      </p>
      {voiceMode === "file" ? (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            style={{ display: "none" }}
            name="SideTool-Voice"
            id="SideTool-Voice"
            onChange={handleFileChange}
          />
          <label htmlFor="SideTool-Voice">
            <button
              className="SideTool-Voice-File SideTool-Voice-Item"
              type="button"
              onClick={() => document.getElementById("SideTool-Voice").click()}
            >
              {audioFile ? audioFile.name : <FiUpload />}
            </button>
          </label>{" "}
        </>
      ) : (
        <VoiceRecorder onRecordingComplete={handleChangeRecordedAudio} />
      )}

      <button
        className="SideTool-Voice-Button SideTool-Voice-Item"
        type="submit"
        onClick={convertVoice2Text}
        disabled={(!audioFile && !recordedAudioBlob) || isLoading}
      >
        {isLoading ? "در حال پردازش..." : "تبدیل"}
      </button>

      {transcription && (
        <>
          {" "}
          <textarea
            ref={textareaRef}
            type="text"
            name="SideTool-Output"
            id="SideTool-Output"
            className="SideTool-Voice-Output SideTool-Voice-Item"
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            rows={4}
          ></textarea>
          <button
            className="SideTool-Voice-Button SideTool-Voice-Item"
            onClick={handleCopyLink}
          >
            رونوشت متن
          </button>{" "}
        </>
      )}
    </div>
  );
};

export default VoiceText;
