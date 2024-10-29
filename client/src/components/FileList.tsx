import React from "react";
import FileLink from "./FileLink";

export default function FileList() {
  return (
    // <div className="flex flex-col gap-5 w-min px-[60px] py-[20px]">
    //   <h3>ไฟล์แนบ</h3>
    //   <div className="flex flex-col gap-2">
    //     <FileLink asset={{ url: "#", name: "surapee_resume.pdf" }} />
    //     <FileLink asset={{ url: "#", name: "surapee_transcript.pdf" }} />
    //     <FileLink asset={{ url: "#", name: "surapee_certification.pdf" }} />
    //   </div>
    // </div>
    <div className="flex justify-start gap-3 flex-wrap px-[60px] py-[20px]">
      <FileLink asset={{ url: "#", name: "surapee_resume.pdf" }} />
      <FileLink asset={{ url: "#", name: "surapee_transcript.pdf" }} />
      <FileLink asset={{ url: "#", name: "surapee_certification.pdf" }} />
      <FileLink asset={{ url: "#", name: "surapee_certification.pdf" }} />
      <FileLink asset={{ url: "#", name: "surapee_certification.pdf" }} />
      <FileLink asset={{ url: "#", name: "surapee_certification.pdf" }} />
      <FileLink asset={{ url: "#", name: "surapee_certification.pdf" }} />
    </div>
  );
}
