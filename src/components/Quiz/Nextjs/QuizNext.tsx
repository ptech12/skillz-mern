import { useRef, useState } from "react";
import { Button } from "../../ui/button";
import { data } from "@/data/nextjs";
import "./Quiz.css";
import { submitScore } from "@/apis";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
const QuizNext = ({ topic }: { topic: string | undefined }) => {
    const navigate = useNavigate();
    // const [data, setData] = useState<QuestionType>()
  let [index, setIndex] = useState<number>(0);
  const [question, setQuestion] = useState(data[index]);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [lock, setLock] = useState<boolean>(false);
  let Option1 = useRef<HTMLLIElement>(null);
  let Option2 = useRef<HTMLLIElement>(null);
  let Option3 = useRef<HTMLLIElement>(null);
  let Option4 = useRef<HTMLLIElement>(null);
  const [showExplain, setShowExplain] = useState(false);

  let option_array = [Option1, Option2, Option3, Option4];


  function checkAns(e: any, ans: number) {
    if (lock === false) {
      if (question.answer === ans) {
        e.target.classList.add("correct");
        setLock(true);
        setScore((prevScore) => prevScore + 1);
      } else {
        e.target.classList.add("wrong");
        setLock(true);
        setShowExplain(true)
        // we will get the reference of correct answer
        option_array[question.answer - 1].current?.classList?.add("correct");
      }
    }
  }

  // logic for move to next function
  function next() {
    if (lock) {
      if (index === data.length - 1) {
        setResult(true);
        return 0;
      }
      setIndex(++index);
      setQuestion(data[index]);
        setShowExplain(false)
        setLock(false);
      option_array.map((option) => {
        option.current?.classList.remove("wrong");
        option.current?.classList.remove("correct");
        return null;
      });
    }
  }

  async function handleSubmit() {
    console.log(import.meta.env.VITE_API_URL);
    const accessToken = Cookies.get("token");
    const userId = Cookies.get("userId");
    try {
      const resp = await submitScore(
        accessToken,
        Math.floor((score / data.length) * 100),
        topic,
        userId
      );

      console.log(resp);
      
      
      
      toast.success("success", {
        "position": "top-right"
      })
      navigate('/dashboard')

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container w-[720px] h-screen m-auto mt-8 bg-white flex flex-col gap-5 rounded-lg p-[40px 50px] dark:bg-black dark:text-white">
      {result ? (
        <>
          <h1 className="text-2xl font-medium">Result</h1>
          <hr className="h-[2px] border-none bg-gray-300" />
          <h2>
            You Scored {score} out of {data.length}
          </h2>
          <h3>Percentage: {Math.floor((score / data.length) * 100)} %</h3>
          <div className="grid grid-cols-2 gap-4 ">
            <Button>
              <a href="/dashboard">Back To DashBoard</a>
            </Button>
            <Button onClick={handleSubmit}>Submit Result</Button>
          </div>
        </>
      ) : (
        <>
          <hr className="h-[2px] border-none bg-gray-300" />
          <h2 className=" text-2xl font-medium">
            {index + 1}. {question.question}
          </h2>
          <ul className="dark:bg-black dark:text-white">
            <li
              onClick={(e) => {
                checkAns(e, 1);
              }}
              ref={Option1}
            >
              {" "}
              {question.option1}
            </li>
            <li
              onClick={(e) => {
                checkAns(e, 2);
              }}
              ref={Option2}
            >
              {" "}
              {question.option2}
            </li>
            <li
              onClick={(e) => {
                checkAns(e, 3);
              }}
              ref={Option3}
            >
              {" "}
              {question.option3}
            </li>
            <li
              onClick={(e) => {
                checkAns(e, 4);
              }}
              ref={Option4}
            >
              {" "}
              {question.option4}{" "}
            </li>
          </ul>
          {
            showExplain 
            && 
            <p className="explain font-mono text-xl">
            Explantion: {question.answerText}
          </p>
          
          }
          <Button
            onClick={next}
            className="mt-9 mx-auto w-[250px] h-[65px] text-white bg-[#553f9a] text-2xl font-medium rounded-[8px] cursor-pointer"
          >
            {
            index === data.length - 1 ? 'Check Result' : 'Next'
            }
          </Button>
          <div className="index text-[18px] mb-5 mx-auto text-gray-500">
            {`${index + 1} of ${data.length} questions`}
          </div>
        </>
      )}
    </div>
  );
};

export default QuizNext;
