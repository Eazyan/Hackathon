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
    // Регулярное выражение для поиска URL-адресов
    const urlRegex = /(https?:\/\/(?:www\.|(?!www))[а-яА-ЯёЁa-zA-Z0-9][а-яА-ЯёЁa-zA-Z0-9-]+[а-яА-ЯёЁa-zA-Z0-9]\.[^\s]{2,}|www\.[а-яА-ЯёЁa-zA-Z0-9][а-яА-ЯёЁa-zA-Z0-9-]+[а-яА-ЯёЁa-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[а-яА-ЯёЁa-zA-Z0-9]+\.[^\s]{2,}|www\.[а-яА-ЯёЁa-zA-Z0-9]+\.[^\s]{2,})/g;

    // Замена существующих ссылок на пустую строку, чтобы избежать дублирования
    text = text.replace(/[\[\]\(\)]/g, "");

    // Замена URL-адресов на ссылки в формате Markdown
    return text.replace(urlRegex, (url) => {
        return `[${url}](${url})`;
    });
}
  // Заменяем символы \n на <br /> для корректного отображения переносов строк
  let formattedMarkdown = markdown.replace(/\\n\\n/g, '  \n' ).replace(/\\n/g, '  \n');
  formattedMarkdown = replaceUrlsWithLinks(formattedMarkdown);
  console.log(formattedMarkdown);

  // Используем компонент ReactMarkdown для отображения Markdown с переносами строк
  return <Markdown>{formattedMarkdown}</Markdown>;
};

export default MarkdownRenderer;