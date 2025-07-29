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
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file && file.type.includes("audio")) {
      setAudioFile(file);
      console.log("in: ", audioFile);
    } else {
      showErrorToast("لطفاً یک فایل صوتی معتبر انتخاب کنید");
      setAudioFile(null);
    }
  };

  const convertVoice2Text = async () => {
    if (!audioFile) {
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("audio_file", audioFile);

      const response = await axios.post(voiceTextAPI, formData, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });

      setTranscription(response.data.transcription);
    } catch (error) {
      showErrorToast("خطا در پردازش فایل صوتی!");
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

  return (
    <div className="SideTool-Voice-Container">
      <h2 className="SideTool-Voice-Header SideTool-Voice-Item">
        تبدیل صوت به متن
      </h2>
      <p className="SideTool-Voice-Text SideTool-Voice-Item">
        فایل صوتی را در این قسمت بارگذاری کنید و متن آن را دریافت کنید.
      </p>
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
      </label>

      <button
        className="SideTool-Voice-Button SideTool-Voice-Item"
        type="submit"
        onClick={convertVoice2Text}
        disabled={!audioFile || isLoading}
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

      <p className="SideTool-Voice-Text SideTool-Voice-Item">
        به صورت زنده فایل صوتی را در این قسمت ضبط کرده و متن آن را دریافت کنید.
      </p>
      <VoiceRecorder />
      <button
        className="SideTool-Voice-Button SideTool-Voice-Item"
        type="submit"
        onClick={convertVoice2Text}
        disabled={!audioFile || isLoading}
      >
        {isLoading ? "در حال پردازش..." : "تبدیل"}
      </button>
    </div>
  );
};

export default VoiceText;
