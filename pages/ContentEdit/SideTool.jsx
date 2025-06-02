import { useRef, useState, useEffect } from "react";
import "@/pages/ContentEdit/index.css";
import baseUrl from "@/Managers/constants.js";
import VoiceText from "./VoiceText";

const SideTool = () => {
  return (
    <div className="SideTool-Container">
      <h1 className="SideTool-Header">امکانات ویژه</h1>
      <VoiceText />
    </div>
  );
};

export default SideTool;
