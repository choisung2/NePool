import styled from 'styled-components';
import { API, COLORS } from '../../constants'
import { useForm } from 'react-hook-form'
import { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
  const [loginErr, setLoginErr] = useState("아이디 또는 비밀번호가 일치하지 않습니다.")

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
  })

  const onSubmit = async (data) => {
    try {
      const userData = {
        username: data.id,
        password: data.password
      }
    const res = await axios.post(`${API}/user/login`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    // console.log(res);
    // console.log(res.data.username);
    window.localStorage.setItem('token', res.data.token)
    window.localStorage.setItem('user', res.data.username)
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <>
      <main className="container">
        <h1 className="blind">로그인 또는 회원가입</h1>
        <LoginBox>
          <img src="/img/logo.svg" alt="logo" />
          <Form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="id"></label>
              <Input
                id="id"
                name="id"
                placeholder="아이디"
                {...register("id", {
                  required: true,
                  pattern: /^[a-zA-Z0-9]*$/
                })}
                />
            <label htmlFor="password"></label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="비밀번호"
                {...register("password", {
                  required: true,
                  // pattern: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9])$/
                })}
                />
                {errors.id && errors.id.type === 'pattern' && (<Err>아이디 또는 비밀번호가 일치하지 않습니다.</Err>)}
                {errors.password && errors.password.type === 'pattern' && (<Err>아이디 또는 비밀번호가 일치하지 않습니다.</Err>)}
            <Btn className="loginBtn" disabled={!isValid} type="submit">로그인</Btn>
          </Form>
          <OrLine>또는</OrLine>
          <SocialLogin>
            <SocialBtn color="#f2c94c" name="/img/kakao.svg">카카오톡 계정으로 로그인</SocialBtn>
            <SocialBtn color="#00BF18" name="/img/naver.svg">네이버 계정으로 로그인</SocialBtn>
          </SocialLogin>
          <Signup>
            <li>회원가입</li>
            <li>아이디/비밀번호 찾기</li>
          </Signup>
        </LoginBox>
      </main>
    </>
  )
}

const LoginBox = styled.article`
  margin: 80px auto 10px;
  max-width: 450px;
  width: 100%;
  border: 1px solid ${COLORS.light_gray};
  border-radius: 10px;
  padding: 40px 20px;
  img {
    display: block;
    margin: 18px auto 50px;
    width: 250px;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
  span {
    font-size: 13px;
  }
`

const Input = styled.input`
  width: 400px;
  height: 40px;
  color: ${COLORS.black};
  margin-bottom: 22px;
  border: none;
  border-bottom: 1px solid ${COLORS.light_gray};
  background: none;
  &::placeholder {
    color: #767676;
  }
  &:focus {
    outline: none;
    border-bottom: 1px solid ${COLORS.blue};
  }
`

const Err = styled.span`
  /* display: none; */
  color: ${COLORS.error};
  width: 400px;
`

const Btn = styled.button`
  font-size: 14px;
  width: 400px;
  height: 50px;
  font-size: 16px;
  margin: 15px 0 0;
  color: #fff;
  background-color: ${COLORS.blue};
  border: none;
  border-radius: 5px;
`

const OrLine = styled.span`
  width: 400px;
  margin: 0 auto;
  font-size: 13px;
  display: block;
  text-align: center;
  position: relative;
  margin-bottom: 20px;
  color: ${COLORS.gray};
  &::before, &::after {
    position: absolute;
    content: "";
    width: 178px;
    top: 50%;
    left: 0;
    border-top: 1px solid ${COLORS.light_gray};
  }
  &::after {
    left: 220px;
  }
`

const SocialLogin = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-top: 32px;
`

const SocialBtn = styled.button`
  background: none;
  font-size: 14px;
  border: 1px solid ${props => props.color};
  width: 400px;
  height: 50px;
  border-radius: 5px;
  color: ${COLORS.gray};
  position: relative;
  &::before {
    content: "";
    position: absolute;
    background: url(${props => props.name});
    top: 12px;
    left: 17px;
    width: 24px;
    height: 24px;
    background-size: 24px;
  }
`

const Signup = styled.ul`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 35px;
  position: relative;
  li {
    font-size: 13px;
    color: ${COLORS.gray};
  }
  &::after {
    position: absolute;
    content: "";
    height: 12px;
    top: 4px;
    left: 187px;
    border-left: 1px solid ${COLORS.light_gray};
  }
`