import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const usePrintPDF = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    pageStyle: `
      @page {
        size: auto;
        margin: 20mm;
      }
      body {
        padding: 20px;
        margin: 0;
      }
      @page {
        @top-center {
          content: "ChatX";
        }
        @bottom-center {
          content: "Page " counter(page);
        }
      }
    `,
  });

  return { contentRef, handlePrint };
};

export default usePrintPDF;
