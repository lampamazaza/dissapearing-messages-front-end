import DOMPurify from "dompurify";
import anchorme from "anchorme";

const parseLinks = (data: string, className: string): string => {
  return DOMPurify.sanitize(
    anchorme({
      input: data,
      options: {
        attributes: {
          target: "_blank",
          class: className,
        },
      },
    }),
    {
      ALLOWED_TAGS: ["a"],
      ALLOWED_ATTR: ["class", "target", "href"],
    }
  );
};
export default parseLinks;
