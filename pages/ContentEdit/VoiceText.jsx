import { useRef, useState, useEffect } from "react";
import "@/pages/ContentEdit/index.css";
import baseUrl from "@/Managers/constants.js";

const voiceTextAPI = baseUrl + "stt/transcriptions/";

const VoiceText = () => {
  return (
    <div className="SideTool-Voice-Container">
      <h2 className="SideTool-Voice-Header SideTool-Voice-Item">
        تبدیل صوت به متن
      </h2>
      <p className="SideTool-Voice-Text SideTool-Voice-Item">
        فایل صوتی را در این قسمت بارگذاری کنید و متن آن را دریافت کنید.
      </p>
      <input
        className="SideTool-Voice-File SideTool-Voice-Item"
        type="file"
        name="SideTool-Voice"
        id="SideTool-Voice"
        accept=".mp3"
      />
      <button
        className="SideTool-Voice-Button SideTool-Voice-Item"
        type="submit"
      >
        تبدیل
      </button>
      <textarea
        type="text"
        name="SideTool-Output"
        id="SideTool-Output"
        className="SideTool-Voice-Output SideTool-Voice-Item"
        //   value={() => {}}
        //   onChange={() => {}}
        rows={4}
      ></textarea>
      <button className="SideTool-Voice-Button SideTool-Voice-Item">
        رونوشت متن
      </button>
    </div>
  );
};

export default VoiceText;
