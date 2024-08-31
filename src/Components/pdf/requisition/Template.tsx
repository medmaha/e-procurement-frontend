"use client";
import { Loader2 } from "lucide-react";
import React from "react";
import { Document, Font, PDFViewer } from "@react-pdf/renderer";
import MainForm from "./Main";

type props = {
  // header: Form101HeaderProps;
  data: Requisition;
  // openedBy: Form101OpenByProps;
};

export default function RequisitionTemplate(props: props) {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="block relative w-full min-h-[500px]">
      {loaded ? (
        <PDFViewer width="100%" height="800">
          <Document author="IntraSoft Ltd">
            <MainForm {...props} />
          </Document>
        </PDFViewer>
      ) : (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="max-w-max flex flex-col items-center justify-center gap-2 mx-auto text-center">
            <p className="text-center w-max">
              <Loader2
                className="text-card-foreground animate-spin"
                width={60}
                height={60}
              />
            </p>
            <p className="text-card-foreground text-sm font-bold w-max">
              Loading PDF Reader
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});
