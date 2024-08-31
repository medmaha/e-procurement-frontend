"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Document, Font, PDFViewer, PDFRenderer } from "@react-pdf/renderer";
import ConditionsAndInstructions from "./ConditionsAndInstructions";
import MainForm from "./Main";
import {
  Form101HeaderProps,
  Form101OpenByProps,
  Form101RFQItemsProps,
} from "./types";

type props = {
  header: Form101HeaderProps;
  items: Form101RFQItemsProps;
  openedBy: Form101OpenByProps;
};

export default function Form101Template(props: props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const isRFQ = props.header.isRFQ;

  return (
    <div className="block relative w-full min-h-[500px]">
      {loaded ? (
        <PDFViewer width="100%" height="800">
          <Document
            onRender={() => {
              toast.success("PDF Generate Successfully", {
                toastId: "pdf-generated",
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
              });
            }}
            pageMode="fullScreen"
            producer="IntraSoft Ltd Ltd"
            subject={"View Form 101 | Request For Quotation"}
            keywords="RFQ, Request For Quotation, Form 101, Procurement"
            author={props.header.authorizedBy}
            title="FORM-101 Request For Quotation"
            creator="IntraSoft Ltd"
          >
            <MainForm {...props}>
              {/* {!isRFQ && <ConditionsAndInstructions />} */}
              <ConditionsAndInstructions />
            </MainForm>
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
            <p className="text-card-foreground text-sm font-bold w-max animate-pulse">
              Generating PDF ...
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
