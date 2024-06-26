import React, { useState } from "react";
import { question } from "../../api/responses";
import { useAppDispatch } from "../../hooks/redux-hooks";
import {
  addBotResponseToHistory,
  addUserResponseToHistory
} from "../../store/slices/responseHistorySlice";
import { Question } from "../../types/questionResponse";
import Spinner from "../Spinner/Spinner";
import SubmitButton from "../SubmitButton/SubmitButton";
import "./PromptInput.css";

const PromptInput: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [isBotResponding, setIsBotResponding] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (text.trim() !== "" && !isBotResponding) {
      setIsBotResponding(true);
      try {
        await dispatch(addUserResponseToHistory(text));
        const response = await question(text);
        await dispatch(addBotResponseToHistory(response.query)); // Предполагаем, что response.query - это ответ бота
      } catch (error) {
        alert(error);
      } finally {
        setIsBotResponding(false);
      }
      setText("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <textarea
        placeholder="Введите сообщение"
        value={text}
        className="PromptInput"
        onChange={(e) => setText( e.target.value)}
        onKeyDown={handleKeyPress}
        rows={1}
        disabled={isBotResponding}
      />
      {!isBotResponding ? (
        <SubmitButton disabled={!text.trim() || isBotResponding} />
      ) : (
        <Spinner />
      )}
    </form>
  );
};

export default PromptInput;
