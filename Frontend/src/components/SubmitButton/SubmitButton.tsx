import React from "react";
import { IoSend } from "react-icons/io5";
import "./SubmitButton.css";

interface SubmitButtonProps {
  disabled: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ disabled }) => {
  return (
    <button type="submit" className="submitButton" disabled={disabled}>
      <IoSend />
    </button>
  );
};

export default SubmitButton;