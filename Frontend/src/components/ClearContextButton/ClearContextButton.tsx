import React, { ReactNode } from "react";
import "./ClearContextButton.css";
import { useDispatch } from "react-redux";
import { clearHistory } from "../../store/slices/responseHistorySlice";
import { FaTrashAlt } from "react-icons/fa";

interface ClearContextMenuProps {
  children: ReactNode;
}

const ClearContextButton: React.FC<ClearContextMenuProps> = ({ children }) => {
  const dispatch = useDispatch();
  function clearContext() {
    dispatch(clearHistory());
  }
  return (
    <button className='clearContextButton' onClick={clearContext}>
      {children}
    </button>
  );
};
export default ClearContextButton;
