import React from 'react';
import Markdown from 'react-markdown';

interface MarkdownRendererProps {
  markdown: string | Promise<string>;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  // Если markdown является Promise, отображаем загрузку или индикатор
  if (markdown instanceof Promise) {
    return <div>Загрузка...</div>;
  }

  function replaceUrlsWithLinks(text: string): string {
    const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g;
    return text.replace(urlRegex, (url) => {
        return `[${url}](${url})`;
    });
}

  // Заменяем символы \n на <br /> для корректного отображения переносов строк
  let formattedMarkdown = markdown.replace(/\\n/g, '\n');
  formattedMarkdown = replaceUrlsWithLinks(formattedMarkdown);
  console.log(formattedMarkdown);

  // Используем компонент ReactMarkdown для отображения Markdown с переносами строк
  return <Markdown>{formattedMarkdown}</Markdown>;
};

export default MarkdownRenderer;