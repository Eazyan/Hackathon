import "./App.css";
import Blank from "./components/blank/Blank";
import Center from "./components/Center/Center";
import Header from "./components/Header/Header";
import MessageBox from "./components/message box/MessageBox";
import PromptInput from "./components/promptInput/PromptInput";
import { useAppSelector } from "./hooks/redux-hooks";
import MarkdownConverter from "./components/MarkdownConverter/MarkdownConverter";
import ClearContextButton from "./components/ClearContextButton/ClearContextButton";
import { FaTrashAlt } from "react-icons/fa";

function App() {
  const messages = useAppSelector(
    (state) => state.responseHistory
  ).responseHistory;
  console.log(messages);

  return (
    <>
      <Header />
      <div className="App">
        <Center>
          <Blank>
            {[...messages].reverse().map((message) => (
              <>
                {message[0] === "User" ? (
                  <MessageBox mode="User">{message[1]}</MessageBox>
                ) : (
                  <MessageBox mode="Bot">
                    <MarkdownConverter markdown={message[1]} />
                  </MessageBox>
                )}
              </>
            ))}
            <MessageBox mode="Bot">
              <MarkdownConverter markdown="Привет! Я Тинькофф Q&A Бот и я готов ответить на любой твой вопрос!" />
            </MessageBox>
          </Blank>
          <div className='InputArea'>
            <PromptInput />
            <ClearContextButton><FaTrashAlt /></ClearContextButton>
          </div>
        </Center>
      </div>
    </>
  );
}

export default App;
