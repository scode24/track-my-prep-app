import React from 'react'
import '../main/Main.css'
import { useState, useEffect } from 'react'
import ProgressBar from './progress-bar/ProgressBar';

function Main() {

    const [topics, setTopics] = useState([]);
    const [questions, setQuestions] = useState({});
    const [selectedFilename, setSelectedFilename] = useState(null);
    const [noOfPrepared, setNoOfPrepared] = useState();
    const [noOfTotal, setNoOfTotal] = useState();

    useEffect(() => {
        const localStoreTopicData = JSON.parse(localStorage.getItem("topic"));
        if (localStoreTopicData !== null) {
            setTopics(localStoreTopicData);
        } else {
            fetch("./topic.json")
                .then(response => response.json())
                .then(data => {
                    setTopics(data);
                    localStorage.setItem("topic", JSON.stringify(data));
                })
                .catch(error => console.log(error));
        }
    }, [])

    const loadQuestions = (event) => {
        let filename = "";
        if (event !== null) {
            filename = event.target.value;
            setSelectedFilename(filename);
        }
        else
            filename = selectedFilename;
        if (localStorage.getItem("questions") == null) {
            localStorage.setItem("questions", JSON.stringify({}));
        }

        const localStoreQuestionData = JSON.parse(localStorage.getItem("questions"))[filename];
        if (localStoreQuestionData !== undefined) {
            const noOfPrep = localStoreQuestionData["preparedQuestionNo"];
            const noOfTotal = localStoreQuestionData["totalQuestionNo"]
            setQuestions(localStoreQuestionData["data"]);
            setNoOfPrepared(noOfPrep);
            setNoOfTotal(noOfTotal);
        } else {
            fetch("./questions/" + filename)
                .then(response => response.text())
                .then(data => {
                    data = formJson(data.split("\r\n"));
                    setQuestions(data);
                    setNoOfPrepared(0);
                    setNoOfTotal(data.length);
                    const existObj = JSON.parse(localStorage.getItem("questions"));
                    existObj[filename] = {
                        "data": data,
                        "preparedQuestionNo": 0,
                        "totalQuestionNo": data.length
                    };
                    localStorage.setItem("questions", JSON.stringify(existObj));
                })
                .catch(error => console.log(error))
        }
    }

    const formJson = (data) => {
        let questions = [];
        for (let index = 0; index < data.length; index++) {
            questions.push({
                "question": data[index],
                "isPrepared": false
            })
        }
        return questions;
    }

    const searchInGoogle = (question) => {
        window.open('http://google.com/search?q=' + question);
    }

    const markUnmarkIsPrepared = (index) => {
        let data = JSON.parse(localStorage.getItem("questions"))[selectedFilename]
        let noOfPrep = data["preparedQuestionNo"];

        if (data["data"][index].isPrepared) {
            noOfPrep--;
            data["data"][index].isPrepared = false;
        } else {
            noOfPrep++;
            data["data"][index].isPrepared = true;
        }

        data["preparedQuestionNo"] = noOfPrep;
        setNoOfPrepared(noOfPrep);

        const existObj = JSON.parse(localStorage.getItem("questions"));
        existObj[selectedFilename] = data;
        localStorage.setItem("questions", JSON.stringify(existObj));

        loadQuestions(null);
    }

    return (
        <div className='main'>
            <div className='left-panel'>
                <div className='card topic-select'>
                    <span>Select one topic</span>

                    <select style={{ 'marginTop': '10px' }} onChange={loadQuestions}>
                        <option defaultValue selected disabled hidden>
                            Select
                        </option>
                        {topics.map((topic, index) => {
                            return <option key={"topic-" + index} value={topic.filename}>{topic.name}</option>
                        })}
                    </select>
                </div>

                {selectedFilename != null ?
                    <div className='card progress-bar-card'>
                        <div>
                            <span>Topic completion %</span>
                            <ProgressBar percentage={(noOfPrepared / noOfTotal) * 100} />
                        </div>
                    </div>
                    : <></>}
            </div>
            <div className='right-panel'>
                <div className='question-panel'>
                    <div className='question-card-header'>
                        <div className='header-option'>
                            <div className='text'>
                                Mark Prepared
                            </div>
                            <div className='icon-button'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-question" viewBox="0 0 16 16">
                                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                                </svg>
                            </div>
                        </div>

                        <div className='header-option'>
                            <div className='text'>
                                Search In Google
                            </div>
                            <div className='icon-button'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div style={{ 'height': '80vh', 'overflow': 'auto' }}>
                        {questions !== undefined && questions.length > 0 && questions.map((item, index) => {
                            return <>
                                <div className='question-card'>
                                    <div className='mark'>
                                        <div className='icon-button'>
                                            <input type='checkbox' value={index} />
                                        </div>
                                        <div className='icon-button' style={{ "backgroundColor": item.isPrepared ? "#0dd817" : "#cccccc" }} onClick={() => markUnmarkIsPrepared(index)}>
                                            {item.isPrepared ?
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                                                </svg>

                                                :
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-question" viewBox="0 0 16 16">
                                                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                                                </svg>
                                            }
                                        </div>
                                        <div className='icon-button' onClick={() => searchInGoogle(item.question)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className='question'>
                                        {item.question}
                                    </div>
                                </div>
                            </>
                        })}

                    </div>
                </div>
            </div>
        </div >
    )
}

export default Main