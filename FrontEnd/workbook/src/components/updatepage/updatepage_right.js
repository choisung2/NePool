import React, { useEffect, useState } from 'react';
import { COLORS, API } from '../../constants/index';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import styled,{css} from 'styled-components';
import axios from 'axios'; 


export default function Updatepage_Right() {
    const navigate = useNavigate();
    const location = useLocation();
    const workbookdata = location.state.workbookdata
    const imgurl = location.state.imageurl
    console.log(imgurl)
    const user = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    const [workid,setWorkid] = useState('');
    const [imageurl,setImageurl] = useState('');

    const [question,setQuestion] = useState([
        {
            id: "",
            question: "",
            answer_a: "",
            answer_b: "",
            answer_c: "",
            answer_d: "",
            answer_e: "",
            correct: "",
            explanation:"",
        }
    ])
    
    const [putworkbook,setPutworkbook] = useState(
        {
            title: workbookdata.title,
            content: workbookdata.content,
            type:'수능·내신'
        }
    );

    // 문제 보이기 (Get)
    const GetQuestion = async () =>{
        const res = await axios.get(`${API}/work/${user}/${workbookdata.id}`,{
            headers:{
                'Content-type' : "application/json",
            }
        })
        // console.log(res);
        setQuestion(res.data)
    }

    const handlingChange = (e)=>{
        setPutworkbook({...putworkbook,[e.target.name]: e.target.value})
    }

    // 문제집 수정
    const UpdateWorkbook = async () =>{
        const res = await axios.put(`${API}/workbook/update/${user}/${workbookdata.id}`,{
            title: putworkbook.title,
            content: putworkbook.content,
            type: putworkbook.type,
            image:imageurl
        },{
            headers:{
                'Content-type' : "application/json",
                Authorization : `Bearer ${token}` 
            }
        })
        // console.log(res);
        navigate('/mypage');
    }

    useEffect(()=>{
        GetQuestion()
    },[workid])
    

    // 이미지 업로드 API
    const ChangeImg = async (e) =>{
        const uploadFiles = e.target.files[0]
        console.log(uploadFiles)
        const formData = new FormData()
        formData.append('uploadFiles',uploadFiles)
        
        const ress = await axios.post(`${API}/upload`,    
            formData,
            {
                headers: {
                    'Content-type' : 'multipart/form-data',
                    Authorization : `Bearer ${token}`,
                },
            }
        )
        console.log(ress)
        setImageurl(ress.data[0].imageUrl)
    }

    // 문제 삭제
    const DeleteQuestion = async (workid)=> {
        console.log(workid)
        console.log(user)
        console.log(workbookdata.id)
        const ress = await axios(`${API}/work/${user}/${workbookdata.id}/${workid}`,
        {
            method:'delete',
            headers:{
                'Content-type' : "application/json",
                Authorization : `Bearer ${token}` 
            }    
        })    
        // console.log(ress)
        window.location.reload();
    }    
    

    return(
        <>
            <Article>

                <Myworkbook>
                    <p>문제집 만들기</p>
                </Myworkbook>

                <ScrollbarSection>

                    <WorkbookForm onSubmit={(e)=>{e.preventDefault()}} >  
                        <Input type="file" id ="input" onChange = {ChangeImg}/>                              
                        <Label htmlFor="input"><WorkbookImg imgurl ={imgurl} /></Label>
                        <TextSelect>
                            <TextInput  name = "title" value={putworkbook.title} onChange={handlingChange} type="text"></TextInput>
                            <Select placeholder = {workbookdata.type} name="type" value={putworkbook.type} onChange={handlingChange}>
                                <option value="수능·내신">수능·내신</option>
                                <option value="어학">어학</option>
                                <option value="자격증">자격증</option>
                                <option value="시사·상식">시사·상식</option>
                                <option value="기타">기타</option>
                            </Select>
                            <Explain rows="5" placeholder={workbookdata.content} name="content" value={putworkbook.content} onChange={handlingChange}></Explain>
                            <Workbookupdate type="submit" onClick ={UpdateWorkbook}>수정</Workbookupdate>
                        </TextSelect>    
                    </WorkbookForm>
                    
                    <QuestionUl>
                        {
                            question.map((questiondata,i)=>{
                                return(
                                    <QuestionLi key = {questiondata.id}>
                                        <Question>{i+1}. {questiondata.question}</Question>
                                        <Answer>[정답 : {questiondata.correct}]</Answer>
                                        <Answers>{questiondata.explanation}</Answers>
                                        <ButtonDiv>
                                            <Link to={"/updatequestion"} state={{workbookid:workbookdata.id,question:questiondata}}>
                                                <Update>수정</Update>
                                            </Link>
                                            <Delete onClick = { () => { DeleteQuestion(questiondata.id);} }>삭제</Delete>
                                        </ButtonDiv>
                                    </QuestionLi>
                                )
                            })
                        }
                    </QuestionUl>

                    <Link to ='/add' state= {{workbookid: workbookdata.id}}><CreateBtn>+</CreateBtn></Link>

                </ScrollbarSection>
            </Article>
        </>
    )
}


const Article = styled.article`
    position:relative;
    box-sizing:border-box;
    margin:0 auto;
    margin-right:4%;
    border:3px solid ${COLORS.light_gray};
    border-radius:15px;
    flex-basis:70%;
`

const Myworkbook = styled.div`
    border-bottom: 3px solid ${COLORS.light_gray};
    height:7%;
    p{
        font-size:1.1rem;
        font-weight: 700;
        line-height:3rem;
        margin-left:20px;
    }
`;

const ScrollbarSection = styled.section`
    width:100%;
    max-height:90%;
    overflow-x: auto;
    overflow-y: scroll;
    &::-webkit-scrollbar{
        width: 6px;
    }
    &::-webkit-scrollbar-thumb{
        background-color: ${COLORS.light_gray};
        border-radius:15px;
    }
    &::-webkit-scrollbar-track{
        background-color: white;
    }
`;
const WorkbookForm = styled.form`
    display:flex;
    margin: 1em 0;
    width:100%;
    height:45%;
`;

const Input = styled.input`
    display:none;
    width:20%;
    height:100%;
`;
const Label = styled.label`
    cursor:pointer;
    margin-left: 18%;
    margin-right: 50px;
    width:20%;
    height:100%;
`;
const WorkbookImg = styled.div`
    width: 100%;
    height: 280px;
    background: url(/img/mango.png) no-repeat center center/cover;
    ${props => props.imgurl &&
                    css`
                        background: url(${props=>props.imgurl}) no-repeat center center/cover;
                    `
                }
    opacity: 0.6;
`;

const TextSelect = styled.div`
    width:30%;
    height:80%;
    margin-left:15px;
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;    
`;

const TextInput = styled.input`
    margin-top:36px;
    width:95%;
    height:30px;
    font-weight:bold;
    padding-left:10px;
    color: ${COLORS.black};
    border-radius:5px;
    border: 2px solid ${COLORS.light_gray};
    &:focus{
        border-color: ${COLORS.blue};
    }
`;

const Select = styled.select`
    margin-top:20px;
    width:100%;
    font-weight:bold;
    height:35px;
    padding-left:5px;
    color: ${COLORS.black};
    border: 2px solid ${COLORS.light_gray};
    border-radius:5px;
`;

const Explain = styled.textarea`
    padding:3%;
    width:93%;
    height:80px;
    font-weight:bold;
    padding-left:10px;
    color: ${COLORS.black};
    border: 2px solid ${COLORS.light_gray};
    border-radius:5px;
    margin-top:20px;
    resize: none;
`;

const Workbookupdate = styled.button`
    border:none;
    font-size:12px;
    width:40%;
    height:32px;
    margin-top:20px;
    border-radius:5px;
    background-color: ${COLORS.blue};
    color:#fff;
`
const QuestionUl = styled.ul`
    width:100%;
`;

const QuestionLi = styled.li`
    padding:2em;
`;

const Question = styled.p`
    font-size:16px;
    font-weight:bold;
`;

const Answer = styled.p`
    margin-top:7px;
    margin-left:6px;
    font-weight:600;
    font-size:13px;
    color:${COLORS.gray};
`;

const Answers = styled.p`
    margin-top:7px;
    margin-left:6px;
    font-weight:400;
    font-size:13px;
    color:${COLORS.light_gray};

`;

const ButtonDiv = styled.div`
    display:flex;
    margin-left:6px;
    margin-top:15px;
`;

const Update = styled.button`
    border:none;
    font-size:12px;
    width:60px;
    height:32px;
    border-radius:5px;
    background-color: ${COLORS.blue};
    margin-right:10px;
    color:#fff;
`;

const Delete = styled.button`
    border:none;
    font-size:12px;
    width:60px;
    height:32px;
    border-radius:5px;
    background-color: ${COLORS.blue};
    color:#fff;
`;

const CreateBtn = styled.button`
    position:absolute;
    z-index:2;
    width:50px;
    font-size:30px;
    line-height:25px;
    height:50px;
    bottom:20px;
    right:20px;
    border-radius:50%;
    background-color:${COLORS.blue};
    color:#fff;
`;
