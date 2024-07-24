import { createContext, useState } from "react";
import run from "../Config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState('');
    const [recentPrompt, setRecentPrompt] = useState('');
    const [prevPrompt, setPrevPrompt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState('');

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData(prev => prev + nextWord);
        }, 75 * index);
    }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    }

    const onSent = async (prompt) => {
        setResultData('');
        setLoading(true);
        setShowResult(true);
        let res;

        if(prompt !== undefined){
            res = await run(prompt);
            setRecentPrompt(prompt);

        }else{
            setPrevPrompt(prev => [...prev, input]);
            setRecentPrompt(input)
            res = await run(input);
        }

        

        const response = await run(input);
        
        
        let formattedResponse = response
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')  
            .replace(/\*(.*?)\*/g, '<i>$1</i>')      
            .replace(/^\s*[-•]\s/gm, '<br>• ')       
            .replace(/^\s*(\d+\.)\s/gm, '<br>$1 ')   
            .replace(/\n/g, '<br>')                  
            .replace(/\*/g, '');               

        let words = formattedResponse.split(' ');

        words.map((word, index) => {
            delayPara(index, word + ' ');
        });

        setLoading(false);
        setInput('');
    }

    const contextValue = {
        prevPrompt,
        setPrevPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;