import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DescriptionProps {
  description: string;
  maxLength?: number;
}

export default function Description(props: DescriptionProps) {
  const { description, maxLength = 100 } = props;

  return (
    <>
      <div className="contour"></div>
      <div className="m-16">
        <h2 className="mb-16 mt-20 text-xl-bold text-nomad-black">체험 설명</h2>
        <div className="text-lg-regular text-nomad-black">
          <div className="markdown-content">
            <Markdown remarkPlugins={[remarkGfm]}>{description}</Markdown>
          </div>
        </div>
      </div>
    </>
  );
}