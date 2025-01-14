import Logo from '@/components/auths/Logo';
import Button from '@/components/commons/Button';
import Input from '@/components/commons/Input/Input';
import Loading from '@/components/commons/Loading';
import { notify } from '@/components/commons/Toast';
import SocialSignup from '@/components/socialAuth/SocialSignup';
import { postUser } from '@/libs/api/user';
import { signupSchema } from '@/libs/utils/schemas/signupSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { RegisterRequest, RegisterResponse } from '@trip.zip-api';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type FormData = {
  email: string;
  nickname: string;
  password: string;
  confirmPassword: string;
};

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<FormData>({
    resolver: yupResolver(signupSchema),
    mode: 'all',
  });

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const mutation = useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: postUser,
    onSuccess: () => {
      setIsLoading(true);
      notify('success', '가입 완료!');
      router.push('/login');
    },
    onError: (error: ApiError) => {
      if (error.response && error.response.data) {
        if (error.response.data.message === '중복된 이메일입니다.') {
          notify('error', '이미 사용중인 이메일입니다.');
          trigger('email');
        } else {
          notify(
            'error',
            '알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.',
          );
          console.error('회원가입 실패', error);
        }
      }
    },
  });

  // confirmPassword를 제외하고 폼 제출
  const onSubmit: SubmitHandler<FormData> = ({ confirmPassword, ...data }) => {
    const registerData: RegisterRequest = {
      email: data.email,
      nickname: data.nickname,
      password: data.password,
    };
    mutation.mutate(registerData);
  };

  return (
    <>
      <Head>
        <title>회원가입 - Trip.zip</title>
        <meta
          name="description"
          content="Trip.zip에 가입해 Trip.zip을 시작해보세요."
        />
        <meta property="og:title" content="로그인 - Trip.zip" />
        <meta
          property="og:description"
          content="Trip.zip에 가입해 Trip.zip을 시작해보세요."
        />
      </Head>
      <div className="page-container mb-50">
        <div className="flex flex-col items-center justify-center">
          <Logo />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full max-w-640 flex-col gap-16"
          >
            <Input
              label="이메일"
              name="email"
              type="text"
              placeholder="이메일을 입력해 주세요"
              register={register('email')}
              error={errors.email}
              onBlur={() => trigger('email')}
            />
            <Input
              label="닉네임"
              name="nickname"
              type="text"
              placeholder="닉네임을 입력해 주세요"
              register={register('nickname')}
              error={errors.nickname}
              onBlur={() => trigger('nickname')}
            />
            <Input
              label="비밀번호"
              name="password"
              type="password"
              placeholder="8자 이상 입력해 주세요"
              register={register('password')}
              error={errors.password}
              onBlur={() => trigger('password')}
            />
            <Input
              label="비밀번호 확인"
              name="confirmPassword"
              type="password"
              placeholder="비밀번호를 한번 더 입력해 주세요"
              register={register('confirmPassword')}
              error={errors.confirmPassword}
              onBlur={() => trigger('confirmPassword')}
            />
            {isLoading ? (
              <Loading />
            ) : (
              <Button
                type="submit"
                className="rounded-md"
                variant={isValid ? 'activeButton' : 'disabledButton'}
              >
                회원가입 하기
              </Button>
            )}
          </form>
          <div className="text-md mt-20 flex gap-8">
            <p>회원이신가요?</p>
            <Link
              href="login"
              className="text-custom-green-200 underline decoration-custom-green-200 underline-offset-2 dark:text-custom-green-100 dark:decoration-custom-green-100"
            >
              로그인하기
            </Link>
          </div>
          <SocialSignup />
        </div>
      </div>
    </>
  );
}
